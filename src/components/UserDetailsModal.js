import React, { useState } from 'react';

const UserDetailsModal = ({ 
  userDetails, 
  setUserDetails, 
  onSubmit, 
  onClose,
  currency,
  amount,
  selectedProductForPurchase
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendTelegramNotification = async () => {
    const message = `🛒 <b>New Purchase Request</b>\n\n` +
      `<b>Product:</b> ${selectedProductForPurchase.title}\n` +
      `<b>Amount:</b> ${currency === 'USD' ? '$' : '₹'}${amount}\n\n` +
      `👤 <b><u>CUSTOMER DETAILS</u></b>:\n` +
      `<b>Name:</b> ${userDetails.firstName} ${userDetails.lastName}\n` +
      `<b>Email:</b> ${userDetails.email}\n` +
      `<b>Mobile:</b> ${userDetails.phoneNumber || 'Not provided'}\n` +
      `<b>Address:</b> ${userDetails.street}\n` +
      `${userDetails.city}, ${userDetails.zipCode}\n` +
      `${userDetails.country}\n\n` +
      `<b>Timestamp:</b> ${new Date().toLocaleString()}`;

    if (!process.env.NEXT_PUBLIC_SLT_TGBOT_TOKEN || !process.env.NEXT_PUBLIC_SLT_TG_USERID) {
      throw new Error('Telegram configuration is missing');
    }

    const telegramUrl = `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_SLT_TGBOT_TOKEN}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: process.env.NEXT_PUBLIC_SLT_TG_USERID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    if (!telegramResponse.ok) {
      throw new Error('Failed to send Telegram notification');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send Telegram notification first
      await sendTelegramNotification();

      if (currency === 'USD') {
        // Existing Wise payment logic
        await onSubmit(e);
      } else {
        // PhonePe payment logic
        const response = await fetch('/api/phonepe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            userDetails: userDetails,
            productTitle: selectedProductForPurchase.title
          })
        });

        const data = await response.json();
        
        if (data.success) {
          // Redirect to PhonePe payment page
          window.location.href = data.redirectUrl;
        } else {
          throw new Error(data.message || 'Payment initialization failed');
        }
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Payment initialization failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold mb-4">Enter Your Details</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          Please enter your KYC details for us to send the payment receipt (invoice) once the transaction is complete.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  value={userDetails.firstName}
                  onChange={(e) => setUserDetails({...userDetails, firstName: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  value={userDetails.lastName}
                  onChange={(e) => setUserDetails({...userDetails, lastName: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full p-2 border rounded dark:bg-gray-700"
                value={userDetails.email}
                onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                WhatsApp / Mobile Number <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="tel"
                className="w-full p-2 border rounded dark:bg-gray-700"
                value={userDetails.phoneNumber}
                onChange={(e) => setUserDetails({...userDetails, phoneNumber: e.target.value})}
                disabled={isSubmitting}
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Billing Address</label>
              <input
                type="text"
                required
                placeholder="Street Address"
                className="w-full p-2 border rounded dark:bg-gray-700 mb-2"
                value={userDetails.street}
                onChange={(e) => setUserDetails({...userDetails, street: e.target.value})}
                disabled={isSubmitting}
              />
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  required
                  placeholder="City"
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  value={userDetails.city}
                  onChange={(e) => setUserDetails({...userDetails, city: e.target.value})}
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  required
                  placeholder="ZIP / Postal Code"
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  value={userDetails.zipCode}
                  onChange={(e) => setUserDetails({...userDetails, zipCode: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
              <input
                type="text"
                required
                placeholder="Country"
                className="w-full p-2 border rounded dark:bg-gray-700"
                value={userDetails.country}
                onChange={(e) => setUserDetails({...userDetails, country: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center">
            <button
              type="submit"
              className="w-full flex items-center justify-center disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Processing...'
              ) : currency === 'USD' ? (
                <img 
                  src="https://wise.com/public-resources/assets/acquiring-payments/wisetag-business/pww-button.svg"
                  alt="Pay with Wise"
                  className="h-12 w-auto"
                />
              ) : (
                <img 
                  src="/PhonePe_BuyButton_Small.svg"
                  alt="Pay with PhonePe"
                  className="h-12 w-auto"
                />
              )}
            </button>
            {currency === 'USD' && (
              <div className="mt-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Don't have a Wise account? </span>
                <a 
                  href="https://wise.com/invite/dic/dilipr59"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign up here
                </a>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsModal; 