import { MongoClient } from 'mongodb';
import axios from 'axios';

/**
 * @typedef {Object} BillingDetails
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} emailID
 * @property {string} phoneNumber
 * @property {string} address
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {string} pinCode
 */

/**
 * @typedef {Object} SaveBillingRequest
 * @property {string} orderID
 * @property {BillingDetails} billingDetails
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} [message]
 * @property {any} [data]
 * @property {string} [error]
 */

// MongoDB connection string
const mongoUri = process.env.NEXT_PUBLIC_MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'SLT_Transactions';
const collectionName = 'billingDetails';

// Telegram bot configuration
const telegramBotToken = process.env.NEXT_PUBLIC_SLT_TGBOT_TOKEN;
const telegramChatId = process.env.NEXT_PUBLIC_SLT_TG_CHANNEL_ID;

/**
 * Validates billing details
 * @param {BillingDetails} billingDetails 
 * @returns {string[]} Array of missing field names
 */
const validateBillingDetails = (billingDetails) => {
  const requiredFields = [
    'firstName',
    'lastName',
    'emailID',
    'phoneNumber',
    'address',
    'city',
    'state',
    'country',
    'pinCode'
  ];

  return requiredFields.filter(field => !billingDetails[field]);
};

/**
 * Standard API response formatter
 * @param {number} statusCode 
 * @param {Object} options
 * @param {boolean} [options.success]
 * @param {string} [options.message]
 * @param {any} [options.data]
 * @param {string} [options.error]
 * @returns {ApiResponse}
 */
const formatResponse = (statusCode, { success, message, data, error }) => {
  return {
    statusCode,
    success: success ?? statusCode < 400,
    message,
    data,
    error
  };
};

/**
 * Sends a Telegram notification
 * @param {string} message 
 * @returns {Promise<void>}
 */
const sendTelegramNotification = async (message) => {
  try {
    if (!telegramBotToken || !telegramChatId) {
      throw new Error('Telegram bot token or chat ID is missing');
    }

    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    const payload = {
      chat_id: telegramChatId,
      text: message,
      parse_mode: 'Markdown'
    };

    // console.log('Sending Telegram message:', { url, payload });

    const response = await axios.post(url, payload);
    console.log('Telegram API response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Failed to send Telegram notification:', {
      error: error.response?.data || error.message,
      config: error.config,
      status: error.response?.status
    });
    throw error;
  }
};

/**
 * Saves billing details to MongoDB
 * @param {string} orderID
 * @param {BillingDetails} billingDetails
 * @param {string} paymentProvider
 * @returns {Promise<void>}
 */
const saveBillingDetailsToMongoDB = async (orderID, billingDetails, paymentProvider) => {
  let client;
  try {
    client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 5000
    });
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.insertOne({
      orderID,
      ...billingDetails,
      PaymentStatus: 'Initiated',
      PaymentMode: paymentProvider,
      timestamp: new Date()
    });

    console.log('MongoDB save success:', {
      orderID,
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error('MongoDB save failed:', {
      orderID,
      error: error.message,
      stack: error.stack
    });
  } finally {
    if (client) {
      await client.close().catch(err => 
        console.error('Error closing MongoDB connection:', err)
      );
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(
      formatResponse(405, { 
        error: 'Method not allowed',
        message: 'Only POST requests are accepted'
      })
    );
  }

  try {
    /** @type {SaveBillingRequest} */
    const { orderID, billingDetails, paymentProvider } = req.body;
    
    // Add debug logging
    console.log('Received billing request:', {
      body: req.body
    });

    // Validate required fields
    if (!orderID || !billingDetails || !paymentProvider) {
      return res.status(400).json(
        formatResponse(400, {
          error: 'Missing required fields',
          message: 'Both orderID, billingDetails, and paymentProvider are required'
        })
      );
    }

    // Validate billing details
    const missingFields = validateBillingDetails(billingDetails);
    if (missingFields.length > 0) {
      return res.status(400).json(
        formatResponse(400, {
          error: 'Missing required billing fields',
          message: `The following fields are required: ${missingFields.join(', ')}`
        })
      );
    }

    // Send success response immediately
    res.status(200).json(
      formatResponse(200, {
        success: true,
        message: 'Billing details received',
        data: { orderID }
      })
    );

    // Process MongoDB and Telegram operations asynchronously
    (async () => {
      try {
        // Save to MongoDB asynchronously
        await saveBillingDetailsToMongoDB(orderID, billingDetails, paymentProvider);

        // Send Telegram notification
        const telegramMessage = `
🔔 *New Payment Notification*

📄 *Order Details:*
🆔 Order ID: ${orderID}
📦 Item: ${billingDetails.item || 'N/A'}
💰 Amount: ${billingDetails.currency === 'INR' ? '₹' : '$'} ${billingDetails.amount || 'N/A'}
💳 Payment Method: ${billingDetails.paymentMethod || 'N/A'}
📊 Status: PAYMENT INITIATED

👤 *Customer Details:*
👤 Name: ${billingDetails.firstName} ${billingDetails.lastName}
📧 Email: ${billingDetails.emailID}
📞 Mobile: ${billingDetails.phoneNumber}
📍 Location: ${billingDetails.city}, ${billingDetails.state}, ${billingDetails.country}
        `;

        await sendTelegramNotification(telegramMessage).catch(error => {
          console.error('Telegram notification failed:', error);
        });
      } catch (error) {
        console.error('Async operation error:', {
          type: error.name,
          message: error.message,
          stack: error.stack
        });
      }
    })().catch(console.error);

  } catch (error) {
    console.error('Request handler error:', error);
    return res.status(500).json(
      formatResponse(500, {
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing your request'
      })
    );
  }
} 