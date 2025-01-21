import crypto from 'crypto';

const MERCHANT_ID = process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.NEXT_PUBLIC_PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.NEXT_PUBLIC_PHONEPE_SALT_INDEX;
const API_ENDPOINT = process.env.NODE_ENV === 'production' 
  ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
  : 'https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, userDetails, productTitle } = req.body;

    // Create merchant transaction ID
    const merchantTransactionId = `SLT_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // Create payload
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: `SLTU_${Date.now()}`,
      amount: amount * 100, // Convert to paisa
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe/callback`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe/callback`,
      paymentInstrument: {
        type: 'PAY_PAGE'
      },
      merchantOrderId: merchantTransactionId,
      orderContext: {
        orderDetails: {
          itemName: productTitle,
          itemQuantity: 1,
        },
        customerDetails: {
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          email: userDetails.email,
          phone: userDetails.phoneNumber,
        }
      }
    };

    // Convert payload to base64
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

    // Generate checksum
    const string = `${base64Payload}/pg/v1/pay${SALT_KEY}`;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = `${sha256}###${SALT_INDEX}`;

    // Make request to PhonePe
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({
        success: true,
        redirectUrl: data.data.instrumentResponse.redirectInfo.url
      });
    } else {
      throw new Error(data.message || 'Payment initialization failed');
    }

  } catch (error) {
    console.error('PhonePe Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
} 