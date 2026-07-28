let $box  = document.querySelector("#container");
let $search = document.querySelector(".searchInp");
let $sort =  document.querySelector("#tanlov");
let $categorySelect = document.getElementById("categorySelect");
let lout = document.querySelector("#logout");
let closeLoading =  document.querySelector(".loading_close");

// Header badges & buttons
let $cartBadge = document.getElementById("cart-count-badge");
let $wishlistBadge = document.getElementById("wishlist-count-badge");
let $themeToggleBtn = document.getElementById("themeToggleBtn");

// Modals
let $paymentModal = document.getElementById("paymentModal");
let $closePaymentModal = document.getElementById("closePaymentModal");
let $cancelPayBtn = document.getElementById("cancelPayBtn");
let $paymentForm = document.getElementById("paymentForm");

let $quickViewModal = document.getElementById("quickViewModal");
let $closeQuickViewModal = document.getElementById("closeQuickViewModal");
let $quickViewContent = document.getElementById("quickViewContent");

let savedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("admin"));
if(savedUser){
    closeLoading.className = "loading_parent";
    fetch("https://dummyjson.com/products")
    .then(res=>res.json())
    .then(data=>{
        let customProducts = JSON.parse(localStorage.getItem("added_products")) || [];
        allProducts = [...customProducts, ...data.products];
        getdata(allProducts);
        closeLoading.className = "loading_close";
    });
} else {
    alert("Siz ro'yxatdan o'tishingiz kerak");
    setTimeout(()=>{ window.location.href = "../html/login.html"; }, 1500);
}

let allProducts = [];

// Dark Theme toggle
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-theme");
}
if($themeToggleBtn){
    $themeToggleBtn.addEventListener("click", ()=>{
        document.body.classList.toggle("dark-theme");
        let theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
        localStorage.setItem("theme", theme);
    });
}

function updateBadges(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalCartQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if($cartBadge) $cartBadge.textContent = totalCartQty;

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if($wishlistBadge) $wishlistBadge.textContent = wishlist.length;
}
updateBadges();

function getdata(item){
    $box.innerHTML = "";
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    item.forEach(i=>{
        let isWishlist = wishlist.some(w => w.id == i.id);
        let heartIcon = isWishlist ? '<i class="bi bi-heart-fill" style="color: #ec4899;"></i>' : '<i class="bi bi-heart"></i>';
        
        let discount = i.discountPercentage ? Math.round(i.discountPercentage) : (i.id % 20 + 5);
        let starRating = i.rating ? i.rating : (4 + (i.id % 10) / 10).toFixed(1);

        let $newDiv = document.createElement("div");
        $newDiv.className = "product-card";
        $newDiv.innerHTML = `<div>
            <span class="discount-badge">-${discount}%</span>
            <button class="wishlist-btn" onclick="toggleWishlist(${i.id}, event)" title="Saralanganlarga qo'shish">
                ${heartIcon}
            </button>
            <button class="quickview-btn" onclick="openQuickView(${i.id}, event)" title="Tezkor ko'rish">
                <i class="bi bi-eye-fill"></i>
            </button>
            <a href="../html/single.html?product-id=${i.id}">
                <img src="${i.thumbnail}" alt="${i.title}">
            </a>
            <div class="body">
                <div class="rating-row">
                    <span class="stars">⭐️ ${starRating}</span>
                </div>
                <h1>${i.title}</h1>
                <strong>$${i.price}</strong>
                <p>${i.description}</p>
                <div class="card-buttons-group">
                    <button class="btn-cart" onclick="addToCart(${i.id})">
                        <i class="bi bi-cart-plus"></i> Savatchaga
                    </button>
                    <button class="btn-buy" onclick="buyNow(${i.id})">
                        ⚡ Sotib olish
                    </button>
                </div>
            </div>
        </div>`;
        $box.appendChild($newDiv);
    });
}

function toggleWishlist(productId, event){
    if(event) event.stopPropagation();
    let product = allProducts.find(p => p.id == productId);
    if(!product) return;

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let index = wishlist.findIndex(w => w.id == productId);

    if(index !== -1){
        wishlist.splice(index, 1);
        showToast(`💔 "${product.title}" saralanganlardan olindi`);
    } else {
        wishlist.push(product);
        showToast(`❤️ "${product.title}" saralanganlarga qo'shildi!`);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateBadges();
    searchandSort();
}

function openQuickView(productId, event){
    if(event) event.stopPropagation();
    let product = allProducts.find(p => p.id == productId);
    if(!product || !$quickViewModal || !$quickViewContent) return;

    $quickViewContent.innerHTML = `
        <div style="background: #f5f5fa; padding: 15px; border-radius: 12px; height: 100%; display: flex; align-items: center; justify-content: center;">
            <img src="${product.thumbnail}" alt="${product.title}" style="max-width: 100%; max-height: 220px; object-fit: contain;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <h2 style="font-size: 18px; font-weight: 700; color: #1a1a1a;">${product.title}</h2>
            <strong style="font-size: 22px; color: #6c2bd9;">$${product.price}</strong>
            <p style="font-size: 13px; color: #718096; line-height: 1.5;">${product.description}</p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button onclick="addToCart(${product.id}); closeQuickModal();" style="flex: 1; padding: 10px; background: #6c2bd9; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;">
                    🛒 Savatchaga
                </button>
                <button onclick="buyNow(${product.id}); closeQuickModal();" style="flex: 1; padding: 10px; background: #10b981; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;">
                    ⚡ Sotib olish
                </button>
            </div>
        </div>
    `;
    $quickViewModal.style.display = "flex";
}

function closeQuickModal(){
    if($quickViewModal) $quickViewModal.style.display = "none";
}
if($closeQuickViewModal) $closeQuickViewModal.addEventListener("click", closeQuickModal);

function addToCart(productId){
    let product = allProducts.find(p => p.id == productId);
    if(!product) return;
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let index = cart.findIndex(item => item.id == productId);
    
    if(index !== -1){
        cart[index].quantity = (cart[index].quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateBadges();
    showToast(`🛒 "${product.title}" savatchaga qo'shildi!`);
}

function buyNow(productId){
    let product = allProducts.find(p => p.id == productId);
    if(product && $paymentModal){
        $paymentModal.style.display = "flex";
    }
}

function showToast(msg){
    let toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.innerHTML = `<i class="bi bi-check-circle-fill" style="color: #10b981; font-size: 18px;"></i> <span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(()=>{
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.5s ease";
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

// Search & Sort & Category Filter
function searchandSort(){
    let searchWords = $search.value.toLowerCase().trim();
    let sortValue = $sort.value;
    let categoryVal = $categorySelect ? $categorySelect.value : "all";

    let filtered = allProducts.filter(product=>{
        let matchesSearch = product.title.toLowerCase().includes(searchWords);
        let matchesCat = categoryVal === "all" || (product.category && product.category.toLowerCase().includes(categoryVal.toLowerCase()));
        return matchesSearch && matchesCat;
    });

    if(sortValue == "new"){
        filtered.sort((a,b)=>b.price - a.price);
    } else if(sortValue == "old"){
        filtered.sort((a,b)=>a.price - b.price);
    }
    getdata(filtered);
}
if($search) $search.addEventListener("keyup", searchandSort);
if($sort) $sort.addEventListener("change", searchandSort);
if($categorySelect) $categorySelect.addEventListener("change", searchandSort);

if(lout){
    lout.addEventListener("click", ()=>{
        localStorage.removeItem("user");
        window.location.href = "../html/login.html";
    });
}

// Modal handling & Order Creation
function closePayModal(){
    if($paymentModal) $paymentModal.style.display = "none";
}
if($closePaymentModal) $closePaymentModal.addEventListener("click", closePayModal);
if($cancelPayBtn) $cancelPayBtn.addEventListener("click", closePayModal);

window.addEventListener("click", (e)=>{
    if(e.target === $paymentModal) closePayModal();
    if(e.target === $quickViewModal) closeQuickModal();
});

if($paymentForm){
    $paymentForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        
        // Save to Order History
        let orders = JSON.parse(localStorage.getItem("order_history")) || [];
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        let newOrder = {
            id: Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleDateString("uz-UZ"),
            items: cart.length > 0 ? cart : [allProducts[0] || { title: "Mahsulot", price: 50 }],
            totalItems: cart.reduce((sum, i) => sum + (i.quantity || 1), 0) || 1,
            totalCost: cart.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0) || (allProducts[0] ? allProducts[0].price : 50)
        };
        orders.unshift(newOrder);
        localStorage.setItem("order_history", JSON.stringify(orders));

        closePayModal();
        if ($paymentForm) $paymentForm.reset();
        showToast("📦 Buyurtmangiz tarixga saqlandi!");
    });
}

// Add Product Modal handling
let $addProductModal = document.getElementById("addProductModal");
let $openAddProductBtn = document.getElementById("openAddProductBtn");
let $closeAddProductModal = document.getElementById("closeAddProductModal");
let $cancelAddProductBtn = document.getElementById("cancelAddProductBtn");
let $addProductForm = document.getElementById("addProductForm");

function closeAddModal(){
    if ($addProductModal) $addProductModal.style.display = "none";
}

if ($openAddProductBtn) {
    $openAddProductBtn.addEventListener("click", ()=>{
        if ($addProductModal) $addProductModal.style.display = "flex";
    });
}
if ($closeAddProductModal) $closeAddProductModal.addEventListener("click", closeAddModal);
if ($cancelAddProductBtn) $cancelAddProductBtn.addEventListener("click", closeAddModal);

if ($addProductForm) {
    $addProductForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        let title = document.getElementById("pTitleInp").value.trim();
        let price = Number(document.getElementById("pPriceInp").value);
        let img = document.getElementById("pImgInp").value.trim();
        let desc = document.getElementById("pDescInp").value.trim();

        let newProd = {
            id: Date.now(),
            title: title,
            price: price,
            thumbnail: img,
            description: desc
        };

        let customProducts = JSON.parse(localStorage.getItem("added_products")) || [];
        customProducts.unshift(newProd);
        localStorage.setItem("added_products", JSON.stringify(customProducts));

        allProducts.unshift(newProd);
        getdata(allProducts);
        closeAddModal();
        $addProductForm.reset();
        showToast(`✅ Yangi mahsulot "${title}" qo'shildi!`);
    });
}

// Telegram Live Support Chat Widget Logic (@odiljon2213)
let $openChatBtn = document.getElementById("openChatBtn");
let $closeChatBtn = document.getElementById("closeChatBtn");
let $chatBoxCard = document.getElementById("chatBoxCard");
let $chatInput = document.getElementById("chatInput");
let $sendChatBtn = document.getElementById("sendChatBtn");
let $chatBoxBody = document.getElementById("chatBoxBody");

if ($openChatBtn && $chatBoxCard) {
    $openChatBtn.addEventListener("click", ()=>{
        let isHidden = $chatBoxCard.style.display === "none" || !$chatBoxCard.style.display;
        $chatBoxCard.style.display = isHidden ? "flex" : "none";
    });
}

if ($closeChatBtn && $chatBoxCard) {
    $closeChatBtn.addEventListener("click", ()=>{
        $chatBoxCard.style.display = "none";
    });
}

function sendUserChatMessage(){
    if (!$chatInput || !$chatBoxBody) return;
    let text = $chatInput.value.trim();
    if (!text) return;

    // Render user message in chat
    let userMsg = document.createElement("div");
    userMsg.className = "chat-msg user";
    userMsg.textContent = text;
    $chatBoxBody.appendChild(userMsg);
    $chatInput.value = "";
    $chatBoxBody.scrollTop = $chatBoxBody.scrollHeight;

    // Bot instant feedback
    setTimeout(()=>{
        let botMsg = document.createElement("div");
        botMsg.className = "chat-msg bot";
        botMsg.innerHTML = `Rahmat! Savolingiz Telegramga yo'naltirildi. Hozir @odiljon2213 sizga javob beradi... 🚀`;
        $chatBoxBody.appendChild(botMsg);
        $chatBoxBody.scrollTop = $chatBoxBody.scrollHeight;
    }, 600);

    // Open Telegram directly with the user's message to @odiljon2213
    setTimeout(()=>{
        window.open(`https://t.me/odiljon2213?text=${encodeURIComponent("Salom Odiljon, yordam kerak: " + text)}`, "_blank");
    }, 1200);
}

if ($sendChatBtn) $sendChatBtn.addEventListener("click", sendUserChatMessage);
if ($chatInput) {
    $chatInput.addEventListener("keypress", (e)=>{
        if (e.key === "Enter") sendUserChatMessage();
    });
}