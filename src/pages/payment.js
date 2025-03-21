import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import merchantConfig from '@/config/merchantConfig.json'; // Import the merchant config
import discountCodes from '@/utils/discountCodesConfig';

// Dynamically import PaymentCheckout with loading fallback
const PaymentCheckout = dynamic(() => import('@/components/PaymentCheckout'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-pulse text-lg text-gray-600 dark:text-gray-300">
        Preparing payment Checkout Page...
      </div>
    </div>
  ),
  ssr: false // Disable server-side rendering for payment component
});

const PaymentPage = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [merchantDetails, setMerchantDetails] = useState({
    ...merchantConfig,
    discountCode: discountCodes
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePaymentData = async () => {
      if (!router.isReady) return;

      try {
        const { orderID, item, currency, totalAmount } = router.query;
        
        // Validate required parameters
        if (!orderID || !item || !currency || !totalAmount) {
          throw new Error('Missing required payment parameters');
        }

        // Validate currency type
        const isValidCurrency = (value) => {
          return value === 'INR' || value === 'USD';
        };

        if (!isValidCurrency(currency)) {
          throw new Error('Invalid currency type');
        }

        // Create order data object
        const newOrderData = {
          orderID,
          item,
          currency,
          totalAmount: Number(totalAmount)
        };

        // Set order data and loading state
        setOrderData(newOrderData);
        setIsLoading(false);

      } catch (error) {
        console.error('Payment initialization error:', error);
        router.push(`/error?message=${encodeURIComponent(
          error instanceof Error ? error.message : 'Payment initialization failed'
        )}`);
      }
    };

    initializePaymentData();
  }, [router.isReady, router, router.query]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-300">
          Loading payment details...
        </div>
      </div>
    );
  }

  // Error state - no order data
  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-red-500 dark:text-red-400">
          Failed to initialize payment. Please try again.
        </div>
      </div>
    );
  }

  // Render payment checkout with both order data and merchant details
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PaymentCheckout 
        orderData={orderData}
        merchantDetails={merchantDetails} // Pass the merchant details
      />
    </div>
  );
};

export default PaymentPage; 