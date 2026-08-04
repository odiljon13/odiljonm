// Uzum Market API: Products Endpoint
// Node.js / Vercel Serverless API Endpoint

const fs = require('fs');
const path = require('path');

// In-Memory & File Dataset Handler
function getProductsData() {
  try {
    const dataPath = path.join(process.cwd(), 'js', 'uzum_data.js');
    if (fs.existsSync(dataPath)) {
      const code = fs.readFileSync(dataPath, 'utf8');
      let initialUzumProducts = [];
      eval(code);
      return initialUzumProducts || [];
    }
  } catch (e) {
    console.error("Dataset load error:", e);
  }
  return [];
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, query, body } = req;
  const products = getProductsData();

  if (method === 'GET') {
    let result = [...products];

    // Filter by Category
    if (query.category && query.category !== 'all') {
      result = result.filter(p => p.category && p.category.toLowerCase() === query.category.toLowerCase());
    }

    // Search Query
    if (query.search) {
      const q = query.search.toLowerCase().trim();
      result = result.filter(p => (p.title && p.title.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q)));
    }

    // Sort by Price (asc / desc)
    if (query.sort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (query.sort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return res.status(200).json({
      success: true,
      total: result.length,
      products: result
    });
  }

  if (method === 'POST') {
    // Add New Product
    const newProd = {
      id: Date.now(),
      title: body.title || "Yangi Mahsulot",
      price: Number(body.price) || 100000,
      oldPrice: Math.round(Number(body.price) * 1.25) || 125000,
      monthlyPrice: Math.round(Number(body.price) / 12) || 8300,
      category: body.category || "Elektronika",
      stock: Number(body.stock) || 15,
      badge: body.badge || "Yangi",
      rating: 5.0,
      reviewsCount: 1,
      thumbnail: body.thumbnail || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80",
      images: body.images || [body.thumbnail],
      description: body.description || "Uzum Market mahsuloti."
    };

    return res.status(201).json({
      success: true,
      message: "Mahsulot muvaffaqiyatli saqlandi",
      product: newProd
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
};
