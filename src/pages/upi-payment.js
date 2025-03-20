'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Moon, Shield, Sun } from 'lucide-react';
import upiqr from 'upiqr';
import PaymentAcknowledgmentModal from '../components/PaymentAcknowledgmentModal';
import { useTheme } from '../components/ThemeProvider';
import Image from 'next/image';
import merchantConfig from '../config/merchantConfig.json';

const UPI_PROVIDERS = [
  { name: 'Google Pay', lightLogo: '/assets/gpay.svg', darkLogo: '/assets/gpay_dark.svg' },
  { name: 'PhonePe', lightLogo: '/assets/phonepe.svg', darkLogo: '/assets/phonepe_dark.svg' },
  { name: 'Paytm', lightLogo: '/assets/paytm.svg', darkLogo: '/assets/paytm_dark.svg' },
  { name: 'BHIM', lightLogo: '/assets/bhim.svg', darkLogo: '/assets/bhim_dark.svg' }
];

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

const UPIPaymentPage = () => {
  const router = useRouter();
  const [qrCode, setQrCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { isDarkTheme } = useTheme();

  useEffect(() => {
    // Log router query parameters when they change
    if (router.isReady) {
      console.log('UPI Payment Page - Initial Query Parameters:', {
        query: router.query,
        asPath: router.asPath,
        pathname: router.pathname
      });
    }
  }, [router.isReady, router.query]);

  // Get data from URL parameters with proper type conversion
  const orderData = {
    orderID: router.query.orderID || '',
    item: router.query.item || '',
    totalAmount: router.query.amount ? Number(router.query.amount) : 0,
    currency: 'INR' // UPI only supports INR
  };

  const billingDetails = {
    firstName: router.query.firstName || '',
    lastName: router.query.lastName || '',
    emailID: router.query.email || '',
    mobileNumber: router.query.mobile || '',
    city: router.query.city || '',
    state: router.query.state || ''
  };

  const merchantDetails = {
    merchantVPA: process.env.NEXT_PUBLIC_MERCHANT_VPA || router.query.merchantVPA || '',
    payeeName: process.env.NEXT_PUBLIC_MERCHANT_PAYEE_NAME || router.query.payeeName || ''
  };

  useEffect(() => {
    // Validate currency and amount
    if (router.isReady) {
      console.log('Amount Validation Details:', {
        rawAmount: router.query.amount,
        parsedAmount: Number(router.query.amount),
        totalAmount: orderData.totalAmount,
        query: router.query
      });

      if (router.query.currency && router.query.currency !== 'INR') {
        console.error('Invalid currency for UPI payment');
        router.push('/error?message=' + encodeURIComponent('UPI payments are only supported for Indian Rupees (INR)'));
        return;
      }

      // Check if amount exists and is valid
      if (!router.query.amount) {
        console.error('Missing amount parameter:', {
          url: router.asPath,
          query: router.query
        });
        router.push('/error?message=' + encodeURIComponent('Payment amount is missing'));
        return;
      }

      const amount = Number(router.query.amount);
      if (isNaN(amount) || amount <= 0) {
        console.error('Invalid amount value:', {
          rawAmount: router.query.amount,
          parsedAmount: amount,
          isNaN: isNaN(amount),
          isZeroOrNegative: amount <= 0
        });
        router.push('/error?message=' + encodeURIComponent('Invalid payment amount. Please try again.'));
        return;
      }

      console.log('Amount validation passed:', {
        amount,
        orderData
      });
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    // Generate QR code when router is ready and we have all required data
    if (router.isReady) {
      console.log('Data for QR generation:', {
        orderData,
        billingDetails,
        merchantDetails
      });
      
      if (orderData.orderID && merchantDetails.merchantVPA) {
        generateQRCode();
      } else {
        console.error('Missing required data:', {
          hasOrderID: !!orderData.orderID,
          hasMerchantVPA: !!merchantDetails.merchantVPA
        });
      }
    }
  }, [router.isReady, router.query]);

  const generateQRCode = async () => {
    try {
      const qrData = {
        payeeVPA: merchantDetails.merchantVPA,
        payeeName: merchantDetails.payeeName,
        amount: orderData.totalAmount.toString(),
        transactionNote: `Payment for ${orderData.item}`
      };
      
      console.log('Generating QR with data:', qrData);
      
      const { qr } = await upiqr(qrData);
      setQrCode(qr);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handlePaymentComplete = async () => {
    try {
      setIsSubmitting(true);
      setShowPaymentModal(true);
    } catch (error) {
      setIsSubmitting(false);
      alert('Something went wrong. Please try again.');
      console.error(error);
    }
  };

  // Show loading state while router is not ready
  if (!router.isReady) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  // If showing payment modal, render it
  if (showPaymentModal) {
    return (
      <PaymentAcknowledgmentModal
        orderID={orderData.orderID}
        item={orderData.item}
        currency={orderData.currency}
        amount={orderData.totalAmount}
        merchantDetails={{
          homepageUrl: merchantConfig.homepageUrl,
          contactPreference: merchantConfig.contactPreference
        }}
        paymentProvider="UPI"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Order Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md px-8 py-4 mb-8">
          <div className='grid grid-cols-3 mb-2'>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-end p-2 col-span-2">
              Order Summary
            </h1>
            <div className='text-end'>
              <ThemeToggle />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Details */}
            <div className="border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 pb-6 md:pb-0 md:pr-8">
              <div className="space-y-2">
                <div className="rounded-lg flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{orderData.orderID}</span>
                </div>
                <div className="rounded-lg flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Product:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{orderData.item}</span>
                </div>
                <div className="rounded-lg flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹ {orderData.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="md:pl-8">
              <div className="space-y-2">
                <div className="rounded-lg flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {billingDetails.firstName} {billingDetails.lastName}
                  </span>
                </div>
                <div className="rounded-lg flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {billingDetails.emailID}
                  </span>
                </div>
                <div className="rounded-lg flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Mobile:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {billingDetails.mobileNumber}
                  </span>
                </div>
                <div className="rounded-lg flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {billingDetails.city}{billingDetails.state ? `, ${billingDetails.state}` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Instructions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              UPI Payment
            </h2>
            
            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-400">
                Scan QR Code below in any UPI app to Pay
              </p>
              
              {/* UPI Apps Grid */}
              <div className="grid grid-cols-4 gap-4 mt-6 mb-8">
                {UPI_PROVIDERS.map((app) => (
                  <div key={app.name} className="flex flex-col items-center justify-center h-16">
                    <div className="flex items-center justify-center w-full h-full p-2">
                      <Image
                        src={isDarkTheme ? app.darkLogo : app.lightLogo} 
                        alt={app.name} 
                        width={100}
                        height={40}
                        className="object-contain w-auto h-8"
                        priority={true}
                        onError={(e) => {
                          const target = e.target;
                          target.style.display = 'none';
                          target.parentElement?.querySelector('.fallback-text')?.classList.remove('hidden');
                        }}
                      />
                    </div>
                    <span className="fallback-text hidden text-sm font-medium text-gray-700 dark:text-gray-200">
                      {app.name}
                    </span>
                  </div>
                ))}
              </div>

              {qrCode && (
                <div className="flex flex-col items-center">
                  <div className="bg-white p-1 rounded-lg">
                    <Image
                      src={qrCode} 
                      alt="UPI QR Code"
                      width={320}
                      height={320}
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target;
                        target.style.display = 'none';
                        target.parentElement?.querySelector('.fallback-text')?.classList.remove('hidden');
                      }}
                    />
                  </div>
                  <div className="p-4 rounded-lg">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      UPI ID: <span className="font-bold">{merchantDetails?.merchantVPA}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-left">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4" />
                  Payment Instructions:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Verify payee name appears as <span className="font-semibold text-gray-800 dark:text-gray-200">{merchantDetails?.payeeName}</span></li>
                  <li>Complete the payment using your preferred UPI app</li>
                  <li>Click the button below after payment is done</li>
                </ol>
              </div>
            </div>

            <button 
              onClick={handlePaymentComplete}
              disabled={isSubmitting}
              className={`mt-8 w-full py-3 px-4 rounded-lg
                       flex items-center justify-center gap-2
                       ${isSubmitting 
                         ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                         : 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'} 
                       text-white transition-colors`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  Proceed after successful payment
                </>
              )}
            </button>

            {/* Add a timeout message for long operations */}
            {isSubmitting && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                Please wait while we process your payment...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentPage; 