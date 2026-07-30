let $box = document.querySelector("#container");
let $search = document.querySelector(".searchInp");
let $sort = document.querySelector("#tanlov");
let $categorySelect = document.getElementById("categorySelect");
let lout = document.querySelector("#logout");
let closeLoading = document.querySelector(".loading_close");

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

// Ensure default user session
let savedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("admin"));
if(!savedUser){
    savedUser = { email: "user@uzum.uz", firstName: "Mehmon" };
    localStorage.setItem("user", JSON.stringify(savedUser));
}

let allProducts = [];

function loadProducts() {
    if (closeLoading) closeLoading.className = "loading_parent";
    
    // Read from Uzum Market dataset / localStorage
    allProducts = typeof getStoredUzumProducts === "function" ? getStoredUzumProducts() : [];
    getdata(allProducts);
    
    if (closeLoading) closeLoading.className = "loading_close";
}

loadProducts();

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
    if(!$box) return;
    $box.innerHTML = "";
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if(!item || item.length === 0){
        $box.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #94a3b8;">
                <i class="bi bi-search" style="font-size: 48px; display: block; margin-bottom: 12px; color: #94a3b8;"></i>
                Hech qanday mahsulot topilmadi
            </div>
        `;
        return;
    }

    item.forEach(i=>{
        let isWishlist = wishlist.some(w => w.id == i.id);
        let heartIcon = isWishlist ? '<i class="bi bi-heart-fill" style="color: #ec4899;"></i>' : '<i class="bi bi-heart"></i>';
        
        let discount = i.discountPercentage || 15;
        let starRating = i.rating || 4.9;
        let reviewsCount = i.reviewsCount || 120;

        let productImages = [];
        if (i.images && Array.isArray(i.images) && i.images.length > 0) {
            productImages = [...i.images];
        }
        if (i.thumbnail && !productImages.includes(i.thumbnail)) {
            productImages.push(i.thumbnail);
        }
        if (productImages.length === 0) {
            productImages = [i.thumbnail || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80'];
        }

        let priceFormatted = typeof formatSum === "function" ? formatSum(i.price) : `${i.price} so'm`;
        let monthlyFormatted = i.monthlyPrice 
            ? (typeof formatSum === "function" ? formatSum(i.monthlyPrice) : `${i.monthlyPrice} so'm`) 
            : (typeof formatSum === "function" ? formatSum(Math.round(i.price / 12)) : `${Math.round(i.price / 12)} so'm`);

        let $newDiv = document.createElement("div");
        $newDiv.className = "product-card";
        $newDiv.innerHTML = `
            <span class="discount-badge">-${discount}%</span>
            ${i.badge ? `<span class="uzum-tag-badge">${i.badge}</span>` : ''}
            <button class="wishlist-btn" onclick="toggleWishlist(${i.id}, event)" title="Saralanganlarga qo'shish">
                ${heartIcon}
            </button>
            <button class="quickview-btn" onclick="openQuickView(${i.id}, event)" title="Tezkor ko'rish">
                <i class="bi bi-eye-fill"></i>
            </button>
            <a href="../html/single.html?product-id=${i.id}" class="product-img-wrapper">
                <img src="${productImages[0]}" alt="${i.title}" class="product-main-img">
                ${productImages.length > 1 ? `
                    <div class="slider-dots">
                        ${productImages.map((_, idx) => `<span class="dot ${idx === 0 ? 'active' : ''}"></span>`).join('')}
                    </div>
                ` : ''}
            </a>
            <div class="body">
                <div class="rating-row">
                    <span class="stars">⭐️ ${starRating} (${reviewsCount} ta sharh)</span>
                </div>
                <h1>${i.title}</h1>
                <div class="uzum-installment-badge">
                    <span>${monthlyFormatted} / oy</span>
                </div>
                <div class="uzum-price-box">
                    ${i.oldPrice ? `<del class="uzum-old-price">${typeof formatSum === "function" ? formatSum(i.oldPrice) : i.oldPrice}</del>` : ''}
                    <strong class="uzum-main-price">${priceFormatted}</strong>
                </div>
                <div class="card-buttons-group">
                    <button class="btn-cart" onclick="addToCart(${i.id})">
                        <i class="bi bi-cart-plus"></i> Savatchaga
                    </button>
                    <button class="btn-buy" onclick="buyNow(${i.id})">
                        ⚡ Sotib olish
                    </button>
                </div>
            </div>
        `;

        // Uzum Market Image Rotator - Continuous Automatic Cycling
        if (productImages.length > 1) {
            let imgElem = $newDiv.querySelector(".product-main-img");
            let dots = $newDiv.querySelectorAll(".dot");
            let currentIndex = 0;

            imgElem.onerror = function() {
                this.src = i.thumbnail || productImages[0];
            };

            function updateImage(index) {
                if (index === currentIndex || index < 0 || index >= productImages.length) return;
                currentIndex = index;
                imgElem.style.opacity = "0.5";
                setTimeout(() => {
                    imgElem.src = productImages[currentIndex];
                    imgElem.style.opacity = "1";
                }, 80);
                dots.forEach((dot, dIdx) => {
                    if (dIdx === currentIndex) dot.classList.add("active");
                    else dot.classList.remove("active");
                });
            }

            let intervalTime = 1800 + ((i.id || 0) % 5) * 250;
            setInterval(() => {
                let nextIdx = (currentIndex + 1) % productImages.length;
                updateImage(nextIdx);
            }, intervalTime);
        }

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

    let pImages = (product.images && Array.isArray(product.images) && product.images.length > 0)
        ? product.images
        : [product.thumbnail];

    let priceStr = typeof formatSum === "function" ? formatSum(product.price) : `${product.price} so'm`;

    $quickViewContent.innerHTML = `
        <div style="background: #f5f5fa; padding: 15px; border-radius: 12px; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
            <img id="qvMainImg" src="${pImages[0]}" alt="${product.title}" style="max-width: 100%; max-height: 220px; object-fit: contain; transition: opacity 0.2s;">
            ${pImages.length > 1 ? `
                <div style="display: flex; gap: 6px; overflow-x: auto; max-width: 100%; padding: 4px 0;">
                    ${pImages.map((imgUrl, idx) => `
                        <img src="${imgUrl}" onclick="changeQvImg('${imgUrl}')" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid ${idx === 0 ? '#7000ff' : 'transparent'};" class="qv-thumb">
                    `).join('')}
                </div>
            ` : ''}
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <span style="background: #7000ff; color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; width: fit-content;">${product.category || 'Mahsulot'}</span>
            <h2 style="font-size: 17px; font-weight: 700; color: #1a1a1a; line-height: 1.4;">${product.title}</h2>
            <strong style="font-size: 22px; color: #7000ff;">${priceStr}</strong>
            <p style="font-size: 13px; color: #718096; line-height: 1.5;">${product.description}</p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button onclick="addToCart(${product.id}); closeQuickModal();" style="flex: 1; padding: 10px; background: #7000ff; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;">
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

function changeQvImg(url){
    let main = document.getElementById("qvMainImg");
    if(main) {
        main.style.opacity = "0.5";
        setTimeout(() => {
            main.src = url;
            main.style.opacity = "1";
        }, 100);
    }
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
    let searchWords = $search ? $search.value.toLowerCase().trim() : "";
    let sortValue = $sort ? $sort.value : "new";
    let categoryVal = $categorySelect ? $categorySelect.value : "all";

    let filtered = allProducts.filter(product=>{
        let matchesSearch = product.title.toLowerCase().includes(searchWords) || (product.description && product.description.toLowerCase().includes(searchWords));
        let matchesCat = categoryVal === "all" || (product.category && product.category.toLowerCase() === categoryVal.toLowerCase());
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
        
        let orders = JSON.parse(localStorage.getItem("order_history")) || [];
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        let newOrder = {
            id: Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleDateString("uz-UZ"),
            items: cart.length > 0 ? cart : [allProducts[0] || { title: "Mahsulot", price: 250000 }],
            totalItems: cart.reduce((sum, i) => sum + (i.quantity || 1), 0) || 1,
            totalCost: cart.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0) || (allProducts[0] ? allProducts[0].price : 250000)
        };
        orders.unshift(newOrder);
        localStorage.setItem("order_history", JSON.stringify(orders));

        closePayModal();
        if ($paymentForm) $paymentForm.reset();
        showToast("📦 Buyurtmangiz tarixga saqlandi!");
    });
}

// Admin Panel Navigation Security Guard
let $adminPanelNavBtn = document.getElementById("adminPanelNavBtn");
if ($adminPanelNavBtn) {
    $adminPanelNavBtn.addEventListener("click", () => {
        let savedAdmin = JSON.parse(localStorage.getItem("admin"));
        if (savedAdmin) {
            window.location.href = "../html/admin.html";
        } else {
            let pwd = prompt("🔒 Admin paneliga kirish uchun parolni kiriting (masalan: odiljon13):");
            if (pwd === "odiljon13" || pwd === "admin123" || pwd === "admin") {
                let adminObj = { username: "odiljon", role: "admin" };
                localStorage.setItem("admin", JSON.stringify(adminObj));
                showToast("⚡ Admin rejimi faollashdi!");
                setTimeout(() => {
                    window.location.href = "../html/admin.html";
                }, 600);
            } else if (pwd !== null) {
                alert("❌ Parol noto'g'ri! Oddiy foydalanuvchilar uchun Admin paneliga kirish taqiqlangan.");
            }
        }
    });
}

// Add Product Modal handling (Saves directly to Uzum dataset)
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
        let category = document.getElementById("pCategorySelect") ? document.getElementById("pCategorySelect").value : "Elektronika";
        let img = document.getElementById("pImgInp").value.trim();
        let desc = document.getElementById("pDescInp").value.trim();

        let newProd = {
            id: Date.now(),
            title: title,
            price: price,
            oldPrice: Math.round(price * 1.2),
            monthlyPrice: Math.round(price / 12),
            rating: 5.0,
            reviewsCount: 1,
            badge: "Yangi",
            category: category,
            thumbnail: img,
            images: [img],
            description: desc
        };

        allProducts.unshift(newProd);
        if (typeof saveUzumProducts === "function") {
            saveUzumProducts(allProducts);
        } else {
            localStorage.setItem("uzum_products", JSON.stringify(allProducts));
        }

        getdata(allProducts);
        closeAddModal();
        $addProductForm.reset();
        showToast(`✅ Yangi mahsulot "${title}" saqlandi!`);
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

    let userMsg = document.createElement("div");
    userMsg.className = "chat-msg user";
    userMsg.textContent = text;
    $chatBoxBody.appendChild(userMsg);
    $chatInput.value = "";
    $chatBoxBody.scrollTop = $chatBoxBody.scrollHeight;

    setTimeout(()=>{
        let botMsg = document.createElement("div");
        botMsg.className = "chat-msg bot";
        botMsg.innerHTML = `Rahmat! Savolingiz Telegramga yo'naltirildi. Hozir @odiljon2213 sizga javob beradi... 🚀`;
        $chatBoxBody.appendChild(botMsg);
        $chatBoxBody.scrollTop = $chatBoxBody.scrollHeight;
    }, 600);

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