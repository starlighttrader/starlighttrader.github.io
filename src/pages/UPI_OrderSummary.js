import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import upiqr from 'upiqr';

const UPI_ID = "starlighttrader@upi";
const UPI_RECEIVER_NAME = "Shakunthala S"

const UPI_OrderSummary = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [showWhatsAppQR, setShowWhatsAppQR] = useState(false);

  useEffect(() => {
    if (router.query) {
      const details = {
        productTitle: decodeURIComponent(router.query.productTitle || ''),
        amount: router.query.amount,
        firstName: decodeURIComponent(router.query.firstName || ''),
        lastName: decodeURIComponent(router.query.lastName || ''),
        email: decodeURIComponent(router.query.email || ''),
        phoneNumber: decodeURIComponent(router.query.phoneNumber || ''),
        address: decodeURIComponent(router.query.address || '')
      };
      setOrderDetails(details);

      // Generate UPI QR code with debug logging
      console.log('Generating QR code with params:', {
        payeeVPA: UPI_ID,
        payeeName: UPI_RECEIVER_NAME,
        amount: details.amount,
        transactionNote: `Payment for ${details.productTitle}`
      });

      upiqr({
        payeeVPA: UPI_ID,
        payeeName: UPI_RECEIVER_NAME,
        amount: Number(details.amount), // Ensure amount is a number
        transactionNote: `${details.productTitle}`
      })
      .then(({ qr }) => {
        console.log('QR code generated successfully:', qr ? 'QR present' : 'QR missing');
        setQrCode(qr);
      })
      .catch((error) => {
        console.error('Error generating QR code:', error);
      });
    }
  }, [router.query]);

  // Add debug output for QR code state
  useEffect(() => {
    console.log('QR code state updated:', qrCode ? 'Present' : 'Missing');
  }, [qrCode]);

  if (!orderDetails) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Order Summary - StarLightTrader</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Order Summary</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border-b md:border-b-0 md:border-r dark:border-gray-700 pb-6 md:pb-0 md:pr-6">
              <h2 className="text-lg font-semibold mb-4 text-center">Product Details</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium"><strong>Product:</strong></span> {orderDetails.productTitle}</p>
                <p><span className="font-medium"><strong>Amount:</strong></span> {parseInt(orderDetails.amount).toLocaleString()} ₹</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-center">Customer Details</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium"><strong>Name:</strong></span> {orderDetails.firstName} {orderDetails.lastName}</p>
                <p><span className="font-medium"><strong>Email:</strong></span> {orderDetails.email}</p>
                {orderDetails.phoneNumber && (
                  <p><span className="font-medium"><strong>Phone:</strong></span> {orderDetails.phoneNumber}</p>
                )}
                <p><span className="font-medium"><strong>Address:</strong></span> {orderDetails.address}</p>
              </div>
            </div>
          </div>
          <hr className="my-6 border-t border-gray-200 dark:border-gray-700" />

          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">Payment Instructions</h2>
            
            <div className="border rounded-lg p-4 mt-6">
              {qrCode && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Scan QR Code below in any UPI app to Pay</p>
                  <div className="flex justify-center">
                    <img 
                      src={qrCode} 
                      alt="UPI QR Code" 
                      className="w-[400px] h-[400px]" 
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <strong>UPI ID:</strong> 
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg inline-block">
                <p className="font-medium">{UPI_ID}</p>
              </div>
            </div>

            <div className="mt-6 text-left">
              <ol className="list-decimal list-inside space-y-2">
                <li>Ensure the payee name appears as <span className="font-semibold">{UPI_RECEIVER_NAME}</span></li>
                <li>Click <span className="font-semibold">Payment Completed</span> button below, after making the payment</li>
              </ol>
            </div>

            <button 
              onClick={() => setShowWhatsAppQR(true)}
              className="mt-6 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Payment Completed
            </button>

            {showWhatsAppQR && (
              <div className="border rounded-lg p-4 mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Scan the below WhatsApp QR Code to send the payment screenshot.
                </p>
                <div className="flex justify-center">
                  <Image
                    src="/SLT_WhatsApp_QR.png"
                    alt="WhatsApp QR Code"
                    width={500}
                    height={500}
                    className="rounded-lg"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
            )}

            {showWhatsAppQR && (
              <button 
                onClick={() => router.push('/')}
                className="mt-6 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Home
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UPI_OrderSummary; 