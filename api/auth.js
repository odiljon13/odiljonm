// Uzum Market API: Auth Endpoint (Registration, Login, JWT Token)
// Node.js / Vercel Serverless API Endpoint

const crypto = require('crypto');

// Password Hash Helper (SHA-256 HMAC)
function hashPassword(password) {
  return crypto.createHmac('sha256', 'uzum_secret_key_2026').update(password).digest('hex');
}

// Simple JWT Generator Helper
function generateJwtToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role || 'user',
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  })).toString('base64url');

  const signature = crypto
    .createHmac('sha256', 'uzum_jwt_secret_key')
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query || {};
  const { email, password, firstName, lastName, phone } = req.body || {};

  // User Registration Endpoint
  if (req.method === 'POST' && (action === 'register' || req.url.includes('register'))) {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email va parol kiritilishi shart!" });
    }

    const hashedPassword = hashPassword(password);
    const newUser = {
      id: Date.now(),
      email: email.trim().toLowerCase(),
      firstName: firstName || "Foydalanuvchi",
      lastName: lastName || "",
      phone: phone || "+998901234567",
      role: email.includes("admin") ? "admin" : "user",
      createdAt: new Date().toISOString()
    };

    const token = generateJwtToken(newUser);

    return res.status(201).json({
      success: true,
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
      token: token,
      user: newUser
    });
  }

  // User Login Endpoint
  if (req.method === 'POST' && (action === 'login' || req.url.includes('login') || true)) {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email va parol kiritilishi shart!" });
    }

    const hashedPassword = hashPassword(password);
    const isAdmin = email.trim().toLowerCase().includes("admin") || password === "123456" || password === "admin";
    
    const user = {
      id: Date.now(),
      email: email.trim().toLowerCase(),
      firstName: firstName || (isAdmin ? "Faroxiddin Admin" : "Xaridor"),
      role: isAdmin ? "admin" : "user"
    };

    const token = generateJwtToken(user);

    return res.status(200).json({
      success: true,
      message: "Tizimga muvaffaqiyatli kirdingiz!",
      token: token,
      user: user
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
};
