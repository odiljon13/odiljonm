// Uzum Market API: Reviews & Rating System Endpoint
// Node.js / Vercel Serverless API Endpoint

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, query, body } = req;

  // GET /api/reviews?productId=101
  if (method === 'GET') {
    const productId = Number(query.productId) || 101;
    
    // Sample initial reviews dataset
    const reviews = [
      {
        id: 1,
        productId: productId,
        userName: "Shohrux M.",
        rating: 5,
        date: "2026-08-01",
        comment: "Juda a'lo mahsulot! Yetkazib berish ham juda tez bo'ldi. Tavsiya qilaman!",
        photoUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80"
      },
      {
        id: 2,
        productId: productId,
        userName: "Madinabonu K.",
        rating: 5,
        date: "2026-08-03",
        comment: "Kutilganidan ham sifatli chiqdi. Rasmda ko'ringanidek 100% mos!",
        photoUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80"
      }
    ];

    return res.status(200).json({
      success: true,
      productId: productId,
      reviews: reviews
    });
  }

  // POST /api/reviews
  if (method === 'POST') {
    const newReview = {
      id: Date.now(),
      productId: Number(body.productId) || 101,
      userName: body.userName || "Anonim Xaridor",
      rating: Number(body.rating) || 5,
      date: new Date().toISOString().split('T')[0],
      comment: body.comment || "A'lo darajada!",
      photoUrl: body.photoUrl || ""
    };

    return res.status(201).json({
      success: true,
      message: "Sharhingiz Backend serverga muvaffaqiyatli saqlandi!",
      review: newReview
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
};
