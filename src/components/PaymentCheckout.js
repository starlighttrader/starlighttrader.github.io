'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Shield, CreditCard, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import Image from 'next/image';
import { useRouter } from 'next/router';
import BillingDetails from './BillingDetails';
import PaymentAcknowledgmentModal from './PaymentAcknowledgmentModal';

// Configuration for payment providers with their display settings and requirements
const getPaymentProviders = (merchantConfig) => {
  if (!merchantConfig?.preferred_payment_providers) {
    return {};
  }

  const providerAssetMap = {
    'PhonePe': {
      lightIconPath: '/assets/phonepe.svg',
      darkIconPath: '/assets/phonepe_dark.svg',
      isUPI: false
    },
    'UPI': {
      lightIconPath: '/assets/upi.svg',
      darkIconPath: '/assets/upi_dark.svg',
      isUPI: true
    },
    'Wise': {
      lightIconPath: '/assets/wise.svg',
      darkIconPath: '/assets/wise_dark.svg'
    },
    'PayPal': {
      lightIconPath: '/assets/paypal.svg',
      darkIconPath: '/assets/paypal_dark.svg'
    }
  };

  const result = {};
  
  // For each currency in merchant config
  Object.entries(merchantConfig.preferred_payment_providers).forEach(([currency, providers]) => {
    result[currency] = providers.map(provider => ({
      name: provider,
      ...providerAssetMap[provider]
    }));
  });

  return result;
};

// Theme toggle component for light/dark mode switching
const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {isDarkTheme ? (
        <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      )}
    </button>
  );
};

// Individual payment option component for radio button selection
const PaymentOption = ({ name, selected, iconPath, onChange }) => {
  return (
    <label className={`
      relative flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200
      ${selected 
        ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400' 
        : 'border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
    `}>
      <input
        type="radio"
        name="payment"
        checked={selected}
        onChange={onChange}
        className="absolute w-4 h-4 left-4 top-1/2 -translate-y-1/2"
      />
      <div className="ml-6 flex items-center justify-center w-full">
        {iconPath ? (
          <Image
            src={iconPath}
            alt={`${name} logo`}
            width={100}
            height={100}
            className="object-contain"
            onError={(e) => {
              const target = e.target;
              target.style.display = 'none';
              target.parentElement?.querySelector('.fallback-text')?.classList.remove('hidden');
            }}
          />
        ) : (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {name}
          </span>
        )}
        <span className="fallback-text hidden text-sm font-medium text-gray-700 dark:text-gray-200">
          {name}
        </span>
      </div>
    </label>
  );
};

// Order summary component to display transaction details
const OrderSummary = ({ orderData, merchantDetails, handleChangeFinalAmount }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [finalAmount, setFinalAmount] = useState(orderData.totalAmount);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');

  // Function to handle discount code application
  const applyDiscountCode = (code) => {
    if (!code.trim()) {
      return;
    }

    console.log('Applying discount code:', code);
    console.log('Item:', orderData.item);
    console.log('Currency:', orderData.currency);
    console.log('Available discounts:', merchantDetails?.discountCode);

    // Get the discount codes for the current currency
    const discounts = merchantDetails?.discountCode?.[orderData.item]?.[orderData.currency] || [];
    console.log('Matching discounts for item and currency:', discounts);
    
    // Find the matching discount
    const matchingDiscount = discounts.find((discount) => {
      const [key] = Object.keys(discount);
      console.log('Comparing:', key.toLowerCase(), 'with:', code.toLowerCase());
      return key.toLowerCase() === code.toLowerCase();
    });

    console.log('Found matching discount:', matchingDiscount);

    if (matchingDiscount) {
      setDiscountError(''); // Clear any previous error
      const [key, value] = Object.entries(matchingDiscount)[0];
      const discountValue = value;
      console.log('Applying discount value:', discountValue);

      let newAmount = orderData.totalAmount;

      // Calculate new amount based on discount type
      if (discountValue.startsWith('-')) {
        // Subtract fixed amount
        const deduction = parseFloat(discountValue.substring(1));
        console.log('Applying fixed deduction:', deduction);
        newAmount = orderData.totalAmount - deduction;
        // Ensure amount doesn't go below zero
        if (newAmount < 0) {
          newAmount = 0;
        }
        setFinalAmount(newAmount);
        setAppliedDiscount(`-${orderData.currency} ${deduction}`);
      } else if (discountValue.startsWith('*')) {
        // Apply percentage discount
        const multiplier = parseFloat(discountValue.substring(1));
        console.log('Applying percentage discount:', multiplier * 100 + '%');
        newAmount = orderData.totalAmount - (orderData.totalAmount * multiplier);
        setFinalAmount(newAmount);
        setAppliedDiscount(`${(multiplier * 100)}%`);
      }
      console.log('New amount after discount:', newAmount);
    } else {
      // Invalid discount code
      console.log('Invalid discount code');
      setFinalAmount(orderData.totalAmount);
      setAppliedDiscount(null);
      setDiscountError('Invalid discount code');
    }
  };

  // Effect to reset final amount when order data changes
  useEffect(() => {
    setFinalAmount(orderData.totalAmount);
    setDiscountCode('');
    setAppliedDiscount(null);
  }, [orderData.totalAmount]);

  useEffect(() => {
    if (handleChangeFinalAmount) {
      handleChangeFinalAmount(finalAmount);
    }
  }, [finalAmount, handleChangeFinalAmount]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 transition-colors">
      <div className="flex items-center justify-center gap-2 mb-6">
        <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Order Summary
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center rounded-lg">
          <span className="text-gray-600 dark:text-gray-300">Order ID</span>
          <span className="font-medium text-gray-900 dark:text-white">{orderData.orderID}</span>
        </div>
        
        <div className="flex justify-between items-center rounded-lg">
          <span className="text-gray-600 dark:text-gray-300">Item</span>
          <span className="font-medium text-gray-900 dark:text-white">{orderData.item}</span>
        </div>

        {/* Discount Code Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value);
                  setDiscountError(''); // Clear error when input changes
                }}
                placeholder="Enter discount code"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {discountError && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {discountError}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                try {
                  applyDiscountCode(discountCode);
                } catch (error) {
                  console.error('Error applying discount:', error);
                  setDiscountError('Invalid discount code');
                }
              }}
              disabled={!discountCode.trim()}
              className={`px-4 py-2 rounded-lg transition-colors
                       ${!discountCode.trim() 
                         ? 'bg-gray-300 cursor-not-allowed' 
                         : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'} 
                       text-white`}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Final Amount */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Amount</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {orderData.currency === 'INR' ? '₹' : '$'} {orderData.totalAmount.toLocaleString()}
            </span>
          </div>
          
          {appliedDiscount && (
            <div className="flex justify-between items-center mt-2 text-green-600 dark:text-green-400">
              <span>Discount Applied</span>
              <span>{appliedDiscount}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-2 text-lg font-bold">
            <span className="text-gray-800 dark:text-white">Final Amount</span>
            <span className="text-gray-900 dark:text-white">
              {orderData.currency === 'INR' ? '₹' : '$'} {finalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentCheckoutContent = ({ orderData, merchantDetails }) => {
  const router = useRouter();
  const { isDarkTheme } = useTheme();
  const [selectedProvider, setSelectedProvider] = useState('');
  const [finalAmount, setFinalAmount] = useState(orderData.totalAmount);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const billingDetailsRef = React.useRef(null);

  const handleChangeFinalAmount = (finAmount) => {
    setFinalAmount(finAmount);
  };

  const handleProviderChange = (providerName) => {
    setSelectedProvider(providerName);
    setShowBillingForm(true);
  };

  // Initialize selected provider based on currency
  useEffect(() => {
    const providers = getPaymentProviders(merchantDetails);
    const currencyProviders = providers[orderData.currency] || [];
    
    if (currencyProviders.length === 1) {
      // Automatically select the only available provider
      setSelectedProvider(currencyProviders[0].name);
      setShowBillingForm(true);
    } else if (currencyProviders.length > 1 && !selectedProvider) {
      // For multiple providers, select the first one if none selected
      setSelectedProvider(currencyProviders[0].name);
    }
  }, [orderData.currency, merchantDetails]);

  // Show billing form when provider is selected
  useEffect(() => {
    if (selectedProvider) {
      setShowBillingForm(true);
    }
  }, [selectedProvider]);

  const renderLogo = () => {
    if (!merchantDetails?.logo) return null;

    const logoUrl = isDarkTheme ? merchantDetails.logo.dark : merchantDetails.logo.light;
    
    return (
      <div className="flex justify-center mb-8">
        <Image
          src={logoUrl}
          alt="Merchant Logo"
          width={200}
          height={50}
          className="object-contain"
        />
      </div>
    );
  };

  const handlePaymentSubmit = async (billingDetails) => {
    try {
      const finalBillingDetails = billingDetails;
      
      if (showBillingDetails && !finalBillingDetails) {
        throw new Error('Billing details required');
      }

      if (selectedProvider === 'Wise') {
        // Generate Wise payment URL with amount, currency and order ID
        const wiseUrl = `https://wise.com/pay/business/diliprajkumar1?amount=${finalAmount}&currency=${orderData.currency}&description=${encodeURIComponent(orderData.orderID)}`;
        window.open(wiseUrl);
        setShowPaymentModal(true);
      } else if (selectedProvider === 'UPI') {
        // Validate currency for UPI payments
        if (orderData.currency !== 'INR') {
          throw new Error('UPI payments are only supported for Indian Rupees (INR)');
        }

        // For UPI payments, pass data via URL parameters
        const upiPaymentData = {
          orderID: orderData.orderID,
          item: orderData.item,
          amount: finalAmount,  // Pass the numeric amount
          currency: 'INR', // Force INR for UPI payments
          firstName: billingDetails.firstName,
          lastName: billingDetails.lastName,
          email: billingDetails.emailID,
          mobile: billingDetails.phoneNumber,
          city: billingDetails.city,
          state: billingDetails.state,
          merchantVPA: process.env.NEXT_PUBLIC_MERCHANT_VPA,
          payeeName: process.env.NEXT_PUBLIC_MERCHANT_PAYEE_NAME
        };
        
        console.log('UPI Payment Data:', upiPaymentData);
        
        // Create URL with all parameters, ensuring amount is properly included
        const searchParams = new URLSearchParams();
        Object.entries(upiPaymentData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // Ensure amount is converted to string
            const paramValue = key === 'amount' ? value.toString() : value.toString();
            searchParams.append(key, paramValue);
          }
        });
        
        const upiPaymentUrl = `/upi-payment?${searchParams.toString()}`;
        console.log('Redirecting to:', upiPaymentUrl);
        window.location.href = upiPaymentUrl;
        return;
      } else if (selectedProvider === 'PhonePe') {
        // Handle PhonePe payment
        if (!merchantDetails?.phonepeMerchantID || !merchantDetails?.phonepeSaltKey || !merchantDetails?.phonepeSaltIndex) {
          throw new Error('PhonePe merchant details are not configured');
        }

        const response = await fetch('/api/phonepe/initiate-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: finalAmount,
            orderID: orderData.orderID,
            merchantId: merchantDetails.phonepeMerchantID,
            saltKey: merchantDetails.phonepeSaltKey,
            saltIndex: merchantDetails.phonepeSaltIndex,
            billingDetails: finalBillingDetails,
            homepageUrl: merchantDetails.homepageUrl,
            redirectUrl: `${window.location.origin}/phonepe-response?orderId=${orderData.orderID}&merchantId=${orderData.merchantID}`,
            callbackUrl: `${window.location.origin}/api/phonepe/callback`
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        // Redirect to PhonePe payment page
        window.location.href = data.data.redirectUrl;
      }

    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const handleBillingSubmit = async (billingData) => {
    try {
      console.log('Submitting billing details:', {
        billingData,
        finalAmount,
        orderData
      });
      
      // Prepare request payload
      const payload = {
        orderID: orderData.orderID,
        billingDetails: {
          ...billingData,
          amount: finalAmount, // Include the final amount in billing details
          currency: orderData.currency,
          item: orderData.item
        },
        paymentProvider: selectedProvider
      };

      // Save billing details
      const saveBillingResponse = await fetch('/api/save-billing-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!saveBillingResponse.ok) {
        const errorData = await saveBillingResponse.json();
        console.error('Billing details save failed:', errorData);
        throw new Error(errorData.error || 'Failed to save billing details');
      }

      const responseData = await saveBillingResponse.json();
      console.log('Billing details saved successfully:', responseData);

      // Handle different payment providers
      if (selectedProvider === 'Wise') {
        // Generate Wise payment URL with amount, currency and order ID
        const wiseUrl = `https://wise.com/pay/business/diliprajkumar1?amount=${finalAmount}&currency=${orderData.currency}&description=${encodeURIComponent(orderData.orderID)}`;
        window.open(wiseUrl, '_blank', 'noopener,noreferrer');
        setShowPaymentModal(true);
        return;
      }

      if (selectedProvider === 'UPI') {
        // For UPI payments, pass data via URL parameters
        const upiPaymentData = {
          orderID: orderData.orderID,
          item: orderData.item,
          amount: finalAmount,  // Use finalAmount here
          currency: 'INR',
          firstName: billingData.firstName,
          lastName: billingData.lastName,
          email: billingData.emailID,
          mobile: billingData.phoneNumber,
          city: billingData.city,
          state: billingData.state,
          merchantVPA: process.env.NEXT_PUBLIC_MERCHANT_VPA,
          payeeName: process.env.NEXT_PUBLIC_MERCHANT_PAYEE_NAME
        };
        
        console.log('UPI Payment Data:', upiPaymentData);
        
        // Create URL with all parameters
        const searchParams = new URLSearchParams();
        Object.entries(upiPaymentData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
        
        const upiPaymentUrl = `/upi-payment?${searchParams.toString()}`;
        console.log('Redirecting to UPI payment:', upiPaymentUrl);
        window.location.href = upiPaymentUrl;
        return;
      }

      // For other payment providers, redirect to their respective payment pages
      let paymentUrl;
      switch (selectedProvider) {
        case 'PhonePe':
          paymentUrl = `/phonepe-payment?${new URLSearchParams({
            orderID: orderData.orderID
          })}`;
          break;
        case 'PayPal':
          paymentUrl = `/paypal-payment?${new URLSearchParams({
            orderID: orderData.orderID
          })}`;
          break;
        default:
          throw new Error('Unsupported payment provider');
      }

      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Billing submission error:', error);
      router.push(`/error?message=${encodeURIComponent(
        error instanceof Error ? error.message : 'Failed to process billing details'
      )}`);
    }
  };

  return (
    <>
      {showPaymentModal ? (
        <PaymentAcknowledgmentModal
          orderID={orderData.orderID}
          item={orderData.item}
          currency={orderData.currency}
          amount={finalAmount}
          merchantDetails={merchantDetails}
          paymentProvider={selectedProvider}
        />
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-shrink-0">
                <Image
                  src={isDarkTheme ? merchantDetails.logo.dark : merchantDetails.logo.light}
                  alt="Merchant Logo"
                  width={120}
                  height={30}
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white flex-grow text-center mx-4">
                Complete your Payment
              </h1>
              <ThemeToggle />
            </div>

            <OrderSummary 
              orderData={orderData}
              merchantDetails={merchantDetails}
              handleChangeFinalAmount={handleChangeFinalAmount}
            />

            {/* Only show payment method selection if there are multiple providers */}
            {(getPaymentProviders(merchantDetails)[orderData.currency] || []).length > 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {getPaymentProviders(merchantDetails)[orderData.currency].map((provider) => (
                    <PaymentOption
                      key={provider.name}
                      name={provider.name}
                      selected={selectedProvider === provider.name}
                      iconPath={isDarkTheme ? provider.darkIconPath : provider.lightIconPath}
                      onChange={() => handleProviderChange(provider.name)}
                    />
                  ))}
                </div>
              </div>
            )}

            {showBillingForm && (
              <BillingDetails
                ref={billingDetailsRef}
                onSubmit={handleBillingSubmit}
                provider={selectedProvider}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

const PaymentCheckout = (props) => {
  return (
    <PaymentCheckoutContent {...props} />
  );
};

export default PaymentCheckout; 