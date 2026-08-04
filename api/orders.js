// Uzum Market API: Orders & Sales Analytics Endpoint
// Node.js / Vercel Serverless API Endpoint

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, body, query } = req;

  // Create Order
  if (method === 'POST') {
    const order = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      items: body.items || [],
      totalCost: Number(body.totalCost) || 0,
      customerName: body.customerName || "Xaridor",
      phone: body.phone || "+998901234567",
      status: body.status || "📌 Qabul qilindi",
      paymentMethod: body.paymentMethod || "Uzcard/Humo"
    };

    return res.status(201).json({
      success: true,
      message: "Buyurtma muvaffaqiyatli qabul qilindi!",
      order: order
    });
  }

  // Update Order Status
  if (method === 'PUT') {
    return res.status(200).json({
      success: true,
      message: `Buyurtma #${body.orderId || query.id} holati "${body.status}" ga o'zgartirildi!`,
      orderId: body.orderId || query.id,
      newStatus: body.status
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
};
