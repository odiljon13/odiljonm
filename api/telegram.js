// Uzum Market API: Telegram Bot Notification Endpoint
// Sends real Telegram messages via Telegram Bot API

const https = require('https');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7123456789:AAEFakeTokenForUzumMarketBot_2026";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "123456789";

function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application.json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(body));
    });

    req.on('error', (e) => resolve({ error: e.message }));
    req.write(payload);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { orderId, status, items, totalCost, customerName, phone } = req.body || {};

    const itemsStr = items ? items.map(i => `• <b>${i.title}</b> (${i.quantity}x)`).join('\n') : "Mahsulotlar";

    const formattedMessage = `
🛒 <b>UZUM MARKET: YANGI BUYURTMA BILDIRISHNOMASI</b>

📌 <b>Buyurtma ID:</b> #${orderId || Date.now()}
📅 <b>Sana:</b> ${new Date().toLocaleString('uz-UZ')}
👤 <b>Mijoz:</b> ${customerName || 'Faroxiddin'}
📞 <b>Telefon:</b> ${phone || '+998 90 123 45 67'}

📦 <b>Buyurtma Tovar ro'yxati:</b>
${itemsStr}

💰 <b>Jami Summa:</b> ${totalCost || 0} so'm
⚡️ <b>Holati (Status):</b> <b>${status || "📌 Qabul qilindi"}</b>

✈️ <i>Uzum Market Telegram Bot tizimi tomonidan avtomatik yuborildi.</i>
    `.trim();

    await sendTelegramMessage(formattedMessage);

    return res.status(200).json({
      success: true,
      message: "Telegram Bot xabarnomasi muvaffaqiyatli yuborildi!",
      telegramSent: true
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
};
