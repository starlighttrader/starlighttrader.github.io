import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = req.body;
    const merchantId = process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID;
    const saltKey = process.env.NEXT_PUBLIC_PHONEPE_SALT_KEY.trim();
    const saltIndex = process.env.NEXT_PUBLIC_PHONEPE_SALT_INDEX;

    console.log('Payment Response:', response);

    // Generate checksum for status API
    const baseString = `/pg/v1/status/${merchantId}/${response.transactionId}${saltKey}`;
    const dataSha256 = crypto.createHash('sha256').update(baseString).digest('hex');
    const checksum = `${dataSha256}###${saltIndex}`;

    // Use sandbox/preprod URL
    const statusResponse = await fetch(
      `${process.env.NODE_ENV === 'production' 
        ? 'https://api.phonepe.com/apis/hermes/pg/v1/status'
        : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status'}/${merchantId}/${response.transactionId}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': merchantId
        }
      }
    );

    console.log('Checking payment status...');
    const data = await statusResponse.json();
    console.log('Status Response:', data);

    if (data.success === true && data.code === 'PAYMENT_SUCCESS') {
      console.log('Payment Success - Redirecting to success page');
      return res.redirect(302, '/payment/success');
    } else {
      console.log('Payment Failed:', data.code, data.message);
      return res.redirect(302, '/payment/failure');
    }

  } catch (error) {
    console.error('PhonePe Callback Error:', error);
    return res.redirect(302, '/payment/failure');
  }
} 