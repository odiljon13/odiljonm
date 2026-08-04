// Uzum Market API: Payment Gateway Merchant API (Click, Payme, Uzum Pay)
// Node.js / Vercel Serverless API Endpoint

const CLICK_MERCHANT_ID = process.env.CLICK_MERCHANT_ID || "12345";
const CLICK_SERVICE_ID = process.env.CLICK_SERVICE_ID || "67890";
const PAYME_MERCHANT_ID = process.env.PAYME_MERCHANT_ID || "567890abcdef";

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { provider } = req.query || {};
  const { amount, orderId, cardNumber } = req.body || {};

  // Click Payment URL Generator
  if (provider === 'click' || req.url.includes('click')) {
    const clickUrl = `https://my.click.uz/services/pay?service_id=${CLICK_SERVICE_ID}&merchant_id=${CLICK_MERCHANT_ID}&amount=${amount || 100000}&transaction_param=${orderId || Date.now()}`;
    return res.status(200).json({
      success: true,
      provider: 'click',
      paymentUrl: clickUrl
    });
  }

  // Payme Payment URL Generator
  if (provider === 'payme' || req.url.includes('payme')) {
    const base64Data = Buffer.from(`m=${PAYME_MERCHANT_ID};ac.order_id=${orderId || Date.now()};a=${(amount || 100000) * 100}`).toString('base64');
    const paymeUrl = `https://checkout.paycom.uz/${base64Data}`;
    return res.status(200).json({
      success: true,
      provider: 'payme',
      paymentUrl: paymeUrl
    });
  }

  // Direct Card Processing Simulation (Uzcard / Humo)
  if (req.method === 'POST') {
    const cleanCard = (cardNumber || '').replace(/\s+/g, '');
    const isUzcard = cleanCard.startsWith('8600');
    const isHumo = cleanCard.startsWith('9860');

    return res.status(200).json({
      success: true,
      status: "TO'LANDI",
      cardType: isUzcard ? "Uzcard" : (isHumo ? "Humo" : "Visa/MasterCard"),
      transactionId: "TXN_" + Date.now(),
      paidAmount: amount || 0,
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
};
