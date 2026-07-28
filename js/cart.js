// Cart JS Logic
let $cartList = document.getElementById("cart-list");
let $cartSummary = document.getElementById("cartSummary");
let $totalItems = document.getElementById("total-items");
let $totalPrice = document.getElementById("total-price");
let $itemsCountBadge = document.getElementById("items-count-badge");
let $logoutBtn = document.getElementById("logout");
let $buyAllBtn = document.getElementById("buyAllBtn");
let $clearCartBtn = document.getElementById("clearCartBtn");

// Payment Modal elements
let $paymentModal = document.getElementById("paymentModal");
let $closePaymentModal = document.getElementById("closePaymentModal");
let $cancelPayBtn = document.getElementById("cancelPayBtn");
let $paymentForm = document.getElementById("paymentForm");

let savedUser = JSON.parse(localStorage.getItem("user"));
if(!savedUser){
    alert("Siz ro'yxatdan o'tishingiz kerak!");
    setTimeout(()=>{
        window.location.href = "../html/login.html";
    }, 1000);
}

function getCart(){
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function renderCart(){
    let cart = getCart();
    $cartList.innerHTML = "";

    if(cart.length === 0){
        $cartList.innerHTML = `
            <div class="empty-cart-state">
                <i class="bi bi-cart-x"></i>
                <h3>Savatchangiz bo'sh</h3>
                <p>Hozircha savatchaga hech qanday mahsulot qo'shilmadi.</p>
                <a href="../html/index.html" class="goto-shop-btn">Mahsulotlarni ko'rish</a>
            </div>
        `;
        $cartSummary.style.display = "none";
        $itemsCountBadge.textContent = "0 ta mahsulot";
        return;
    }

    $cartSummary.style.display = "block";
    let totalQty = 0;
    let totalCost = 0;

    cart.forEach(item => {
        let itemQty = item.quantity || 1;
        totalQty += itemQty;
        totalCost += item.price * itemQty;

        let $div = document.createElement("div");
        $div.className = "cart-item-card";
        $div.innerHTML = `
            <a href="../html/single.html?product-id=${item.id}" class="cart-item-img-wrapper">
                <img src="${item.thumbnail}" alt="${item.title}">
            </a>
            <div class="cart-item-info">
                <a href="../html/single.html?product-id=${item.id}" class="cart-item-title">${item.title}</a>
                <span class="cart-item-price">$${item.price}</span>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <span class="qty-display">${itemQty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
                <button class="delete-item-btn" onclick="removeItem(${item.id})" title="O'chirish">
                    <i class="bi bi-trash-fill"></i>
                </button>
            </div>
        `;
        $cartList.appendChild($div);
    });

    $totalItems.textContent = `${totalQty} ta`;
    $totalPrice.textContent = `$${totalCost.toFixed(2)}`;
    $itemsCountBadge.textContent = `${totalQty} ta mahsulot`;
}

function changeQty(id, delta){
    let cart = getCart();
    let index = cart.findIndex(item => item.id == id);
    if(index !== -1){
        cart[index].quantity = (cart[index].quantity || 1) + delta;
        if(cart[index].quantity <= 0){
            cart.splice(index, 1);
        }
        saveCart(cart);
    }
}

function removeItem(id){
    let cart = getCart();
    cart = cart.filter(item => item.id != id);
    saveCart(cart);
}

// Clear cart
if($clearCartBtn){
    $clearCartBtn.addEventListener("click", ()=>{
        if(confirm("Savatchadagi barcha mahsulotlarni o'chirmoqchimisiz?")){
            saveCart([]);
        }
    });
}

// Open Payment Modal when clicking Buy / Sotib olish
if($buyAllBtn){
    $buyAllBtn.addEventListener("click", ()=>{
        $paymentModal.style.display = "flex";
    });
}

// Close Modal
function closePayModal(){
    $paymentModal.style.display = "none";
}
if($closePaymentModal) $closePaymentModal.addEventListener("click", closePayModal);
if($cancelPayBtn) $cancelPayBtn.addEventListener("click", closePayModal);

// Close modal when clicking outside form
window.addEventListener("click", (e)=>{
    if(e.target === $paymentModal){
        closePayModal();
    }
});

// Format card inputs smoothly
document.addEventListener("input", (e)=>{
    if(e.target.id === "cardNumberInp"){
        let val = e.target.value.replace(/\D/g, "");
        val = val.replace(/(.{4})/g, "$1 ").trim();
        e.target.value = val;
    }
    if(e.target.id === "cardExpiryInp"){
        let val = e.target.value.replace(/\D/g, "");
        if(val.length >= 2){
            val = val.substring(0,2) + "/" + val.substring(2,4);
        }
        e.target.value = val;
    }
});

// Handle payment form submission
if($paymentForm){
    $paymentForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        
        let orders = JSON.parse(localStorage.getItem("order_history")) || [];
        let cart = getCart();
        
        if(cart.length > 0){
            let newOrder = {
                id: Math.floor(100000 + Math.random() * 900000),
                date: new Date().toLocaleDateString("uz-UZ"),
                items: cart,
                totalItems: cart.reduce((sum, i) => sum + (i.quantity || 1), 0),
                totalCost: cart.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0).toFixed(2)
            };
            orders.unshift(newOrder);
            localStorage.setItem("order_history", JSON.stringify(orders));
        }

        saveCart([]);
        closePayModal();
        window.location.href = "../html/orders.html";
    });
}

// Logout
if($logoutBtn){
    $logoutBtn.addEventListener("click", ()=>{
        localStorage.removeItem("user");
        window.location.href = "../html/login.html";
    });
}

renderCart();
