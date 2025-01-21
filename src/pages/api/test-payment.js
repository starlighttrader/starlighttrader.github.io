// Test out the pages by accessing the link below
// Success case: http://localhost:3000/api/test-payment?status=success
// Failure case: http://localhost:3000/api/test-payment?status=failure

export default function handler(req, res) {
  const { status } = req.query;
  
  if (status === 'success') {
    res.redirect(302, '/payment/success');
  } else {
    res.redirect(302, '/payment/failure');
  }
} 