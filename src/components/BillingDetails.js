'use client';

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const BillingDetails = forwardRef(({ onSubmit, provider }, ref) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailID: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: ''
  });

  const formRef = React.useRef(null);

  useImperativeHandle(ref, () => ({
    getFormData: () => {
      if (formRef.current?.checkValidity()) {
        return formData;
      }
      formRef.current?.reportValidity();
      return null;
    },
    validateForm: () => {
      return formRef.current?.checkValidity() || false;
    }
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add helper function to get button image path
  const getPaymentButtonPath = (provider) => {
    const normalizedProvider = provider.toLowerCase().replace(/\s+/g, '');
    return `/assets/paymentButtons/pay_with_${normalizedProvider}.svg`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Billing Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Please enter your KYC details for us to send the invoice once the transaction is complete.
        </p>
      </div>
      {/* Billing Details */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your first name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="emailID"
              required
              value={formData.emailID}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your email address"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <PhoneInput
              international
              defaultCountry="IN"
              value={formData.phoneNumber}
              onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value }))}
              className="phone-input-wrapper"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Address
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                     text-gray-900 dark:text-white"
            placeholder="Enter your street address"
          />
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              City
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your city"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              State
            </label>
            <input
              type="text"
              name="state"
              required
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your state"
            />
          </div>
        </div>

        {/* Country and PIN Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Country
            </label>
            <input
              type="text"
              name="country"
              required
              value={formData.country}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your country"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              PIN / ZIP Code
            </label>
            <input
              type="text"
              name="pinCode"
              required
              value={formData.pinCode}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                       text-gray-900 dark:text-white"
              placeholder="Enter your PIN/ZIP code"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="relative overflow-hidden"
          >
            <Image
              src={getPaymentButtonPath(provider)}
              alt={`Pay with ${provider}`}
              width={200}
              height={50}
              className="hover:opacity-90 transition-opacity"
            />
          </button>
        </div>
      </form>
    </div>
  );
});

BillingDetails.displayName = 'BillingDetails';

export default BillingDetails; 