import { MongoClient } from 'mongodb';
import https from 'https';

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
  if (!telegramBotToken || !telegramChatId) {
    console.error('Telegram bot token or chat ID is missing');
    return;
  }

  const payload = JSON.stringify({
    chat_id: telegramChatId,
    text: message,
    parse_mode: 'HTML'
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${telegramBotToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          console.error('Telegram API error:', data);
          reject(new Error(`Telegram API error: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error sending Telegram notification:', error);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
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

    try {      
      // Save to MongoDB first
      console.log('Saving to MongoDB for order:', orderID);
      await saveBillingDetailsToMongoDB(orderID, billingDetails, paymentProvider);
      console.log('MongoDB save completed for order:', orderID);
      
      // Prepare Telegram notification
      const telegramMessage = `
<b>🔔 New Payment Notification</b>

<b>ORDER DETAILS:</b>
🆔 Order ID: ${orderID}
📦 Item: ${billingDetails.item}
💰 Amount: ${billingDetails.currency} ${billingDetails.amount}
💳 Payment Method: ${paymentProvider}
📊 Status: PAYMENT INITIATED

<b>CUSTOMER DETAILS:</b>
👤 Name: ${billingDetails.firstName} ${billingDetails.lastName}
📧 Email: ${billingDetails.emailID}
📞 Mobile: ${billingDetails.phoneNumber}
📍 Location: ${billingDetails.city}, ${billingDetails.state}, ${billingDetails.country}
`.trim();
      
      // Send Telegram notification (non-blocking)
      console.log('Sending Telegram notification for order:', orderID);
      try {
        await sendTelegramNotification(telegramMessage);
        console.log('Telegram notification sent successfully for order:', orderID);
      } catch (error) {
        console.error('Failed to send Telegram notification:', error);
      }
      
      // Send success response after MongoDB save
      return res.status(200).json(
        formatResponse(200, {
          success: true,
          message: 'Billing details processed successfully',
          data: { orderID }
        })
      );
    } catch (error) {
      console.error('Operation failed:', {
        orderID,
        error: error.message,
        stack: error.stack
      });
      
      // Still return success to client as we don't want to block the payment flow
      return res.status(200).json(
        formatResponse(200, {
          success: true,
          message: 'Billing details received',
          data: { orderID }
        })
      );
    }
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