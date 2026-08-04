# Uzum Market Dedicated Telegram Bot Dispatcher
# Bot Username: @ahmedov_aloqa_bot
# Admin Telegram ID: 8395285474

import requests
import json
import time

BOT_USERNAME = "@ahmedov_aloqa_bot"
ADMIN_CHAT_ID = "8395285474"
BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN_FROM_BOTFATHER"

def send_order_notification(order_data):
    """
    Sends structured e-commerce order notification to Admin (8395285474) via @ahmedov_aloqa_bot
    """
    order_id = order_data.get("id", int(time.time()))
    customer_name = order_data.get("customerName", "Faroxiddin")
    phone = order_data.get("phone", "+998 90 123 45 67")
    total_cost = order_data.get("totalCost", "0 so'm")
    items = order_data.get("items", [])

    items_text = ""
    for item in items:
        title = item.get("title", "Mahsulot")
        qty = item.get("quantity", 1)
        price = item.get("price", 0)
        items_text += f"• <b>{title}</b> ({qty}x) - {price:,} so'm\n"

    message = f"""
🛒 <b>UZUM MARKET: YANGI BUYURTMA BILDIRISHNOMASI</b>

📌 <b>Buyurtma ID:</b> #{order_id}
📅 <b>Sana:</b> {time.strftime('%Y-%m-%d %H:%M:%S')}
👤 <b>Mijoz:</b> {customer_name}
📞 <b>Telefon:</b> {phone}

📦 <b>Xarid qilingan mahsulotlar:</b>
{items_text if items_text else '• Standard Uzum Market mahsulotlari'}

💰 <b>Jami Summa:</b> <b>{total_cost}</b>
⚡️ <b>Holati:</b> <b>💳 TO'LANDI</b>

🤖 <i>@ahmedov_aloqa_bot orqali avtomatik Admin ({ADMIN_CHAT_ID}) ga yuborildi.</i>
"""

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": ADMIN_CHAT_ID,
        "text": message.strip(),
        "parse_mode": "HTML"
    }

    try:
        res = requests.post(url, json=payload, timeout=10)
        return res.json()
    except Exception as e:
        print(f"Error sending notification via {BOT_USERNAME}:", e)
        return {"ok": False, "error": str(e)}

if __name__ == "__main__":
    print(f"🚀 Telegram Bot Handler initialized for {BOT_USERNAME} | Admin Chat ID: {ADMIN_CHAT_ID}")
    test_order = {
        "id": 998412,
        "customerName": "Faroxiddin (Admin)",
        "phone": "+998 90 123 45 67",
        "totalCost": "2 450 000 so'm",
        "items": [
            {"title": "Smartfon Xiaomi Redmi Note 13 8/256GB", "quantity": 1, "price": 2450000}
        ]
    }
    print("Sending test notification...")
    print(send_order_notification(test_order))
