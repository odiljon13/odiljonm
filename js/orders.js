// Order History JS Logic
let $ordersList = document.getElementById("orders-list");
let $ordersBadge = document.getElementById("orders-badge");
let $logoutBtn = document.getElementById("logout");

let savedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("admin"));
if(!savedUser){
    alert("Siz ro'yxatdan o'tishingiz kerak!");
    setTimeout(()=>{ window.location.href = "../html/login.html"; }, 1000);
}

function getOrders(){
    return JSON.parse(localStorage.getItem("order_history")) || [];
}

let $invoiceModal = document.getElementById("invoiceModal");
let $closeInvoiceModal = document.getElementById("closeInvoiceModal");

function renderOrders(){
    let orders = getOrders();
    $ordersList.innerHTML = "";

    if(orders.length === 0){
        $ordersList.innerHTML = `
            <div class="empty-orders">
                <i class="bi bi-box-seam"></i>
                <h3>Hozircha buyurtmalar mavjud emas</h3>
                <p>Harid qilgan mahsulotlaringiz tarixi bu yerda saqlanadi.</p>
                <a href="../html/index.html" class="goto-shop-btn" style="padding: 12px 28px; background: #6c2bd9; color: white; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block; margin-top: 16px;">Xarid qilishni boshlash</a>
            </div>
        `;
        if($ordersBadge) $ordersBadge.textContent = "0 ta buyurtma";
        return;
    }

    if($ordersBadge) $ordersBadge.textContent = `${orders.length} ta buyurtma`;

    orders.forEach(order => {
        let $card = document.createElement("div");
        $card.className = "order-card";
        
        let itemsHtml = order.items.map(item => `
            <img src="${item.thumbnail || ''}" alt="${item.title || ''}" class="order-item-img" title="${item.title}">
        `).join("");

        $card.innerHTML = `
            <div class="order-card-header">
                <div>
                    <span class="order-id">Buyurtma #${order.id}</span>
                    <span class="order-date"> • ${order.date}</span>
                </div>
                <button class="btn-invoice" onclick="openInvoice(${order.id})">
                    <i class="bi bi-printer"></i> Chekni ko'rish / Print
                </button>
            </div>

            <!-- LIVE ORDER TRACKER -->
            <div class="order-tracker-container">
                <div class="tracker-title">
                    <i class="bi bi-truck-front-fill" style="color: #6c2bd9;"></i> Buyurtma holatini kuzatish (Live Tracker):
                </div>
                <div class="tracker-steps">
                    <div class="tracker-step completed">
                        <div class="step-circle"><i class="bi bi-check-lg"></i></div>
                        <span class="step-label">Qabul qilindi ⏳</span>
                    </div>
                    <div class="tracker-step completed">
                        <div class="step-circle"><i class="bi bi-box-seam"></i></div>
                        <span class="step-label">Qadoqlanmoqda 📦</span>
                    </div>
                    <div class="tracker-step active">
                        <div class="step-circle"><i class="bi bi-truck"></i></div>
                        <span class="step-label">Yo'lda 🚚</span>
                    </div>
                    <div class="tracker-step">
                        <div class="step-circle"><i class="bi bi-house-check"></i></div>
                        <span class="step-label">Yetkazildi ✅</span>
                    </div>
                </div>
            </div>

            <div class="order-items-flex">
                ${itemsHtml}
            </div>

            <div class="order-card-footer">
                <span>Mahsulotlar soni: <b>${order.totalItems} ta</b></span>
                <span style="font-size: 17px; font-weight: 800; color: #6c2bd9;">Jami: $${order.totalCost}</span>
            </div>
        `;
        $ordersList.appendChild($card);
    });
}

function openInvoice(orderId){
    let orders = getOrders();
    let order = orders.find(o => o.id == orderId);
    if(!order || !$invoiceModal) return;

    let $invId = document.getElementById("invId");
    let $invDate = document.getElementById("invDate");
    let $invUser = document.getElementById("invUser");
    let $invItemsList = document.getElementById("invItemsList");
    let $invTotalCost = document.getElementById("invTotalCost");

    if($invId) $invId.textContent = `#${order.id}`;
    if($invDate) $invDate.textContent = order.date;
    if($invUser) $invUser.textContent = savedUser ? (savedUser.firstName || savedUser.username || "Odiljon") : "Odiljon";
    if($invTotalCost) $invTotalCost.textContent = `$${order.totalCost}`;

    if($invItemsList){
        $invItemsList.innerHTML = order.items.map(item => `
            <tr>
                <td>${item.title}</td>
                <td>${item.quantity || 1} ta</td>
                <td>$${item.price}</td>
                <td>$${((item.quantity || 1) * item.price).toFixed(2)}</td>
            </tr>
        `).join("");
    }

    $invoiceModal.style.display = "flex";
}

function closeInvoice(){
    if($invoiceModal) $invoiceModal.style.display = "none";
}
if($closeInvoiceModal) $closeInvoiceModal.addEventListener("click", closeInvoice);
window.addEventListener("click", (e)=>{
    if(e.target === $invoiceModal) closeInvoice();
});

if($logoutBtn){
    $logoutBtn.addEventListener("click", ()=>{
        localStorage.removeItem("user");
        window.location.href = "../html/login.html";
    });
}

renderOrders();
