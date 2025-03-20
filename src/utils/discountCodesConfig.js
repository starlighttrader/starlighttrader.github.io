// Parses the discount codes from environment variables
const parseDiscountCodes = () => {
  try {
    // Get the encoded discount codes from environment variable
    const discountCodesStr = process.env.NEXT_PUBLIC_DISCOUNT_CODES;
    
    if (!discountCodesStr) {
      console.warn('No discount codes found in environment variables');
      return {};
    }

    // Parse the base64 encoded JSON string
    const decodedStr = Buffer.from(discountCodesStr, 'base64').toString('utf-8');
    return JSON.parse(decodedStr);
  } catch (error) {
    console.error('Error parsing discount codes:', error);
    return {};
  }
};

// Export the parsed discount codes
const discountCodes = parseDiscountCodes();
export default discountCodes; 