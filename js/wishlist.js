// Wishlist JS Logic
let $wishlistGrid = document.getElementById("wishlist-grid");
let $wishlistBadge = document.getElementById("wishlist-badge");
let $logoutBtn = document.getElementById("logout");
let $themeToggleBtn = document.getElementById("themeToggleBtn");

let savedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("admin"));
if(!savedUser){
    alert("Siz ro'yxatdan o'tishingiz kerak!");
    setTimeout(()=>{ window.location.href = "../html/login.html"; }, 1000);
}

function getWishlist(){
    return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(list){
    localStorage.setItem("wishlist", JSON.stringify(list));
    renderWishlist();
}

function removeFromWishlist(id){
    let list = getWishlist().filter(item => item.id != id);
    saveWishlist(list);
}

function renderWishlist(){
    let list = getWishlist();
    $wishlistGrid.innerHTML = "";

    if(list.length === 0){
        $wishlistGrid.innerHTML = `
            <div class="empty-wishlist">
                <i class="bi bi-heartbreak"></i>
                <h3>Saralanganlar ro'yxati bo'sh</h3>
                <p>O'zingizga yoqqan mahsulotlarni yurakcha tugmasi orqali bu yerga saqlab qo'yishingiz mumkin.</p>
                <a href="../html/index.html" class="goto-shop-btn">Mahsulotlarni ko'rish</a>
            </div>
        `;
        if($wishlistBadge) $wishlistBadge.textContent = "0 ta mahsulot";
        return;
    }

    if($wishlistBadge) $wishlistBadge.textContent = `${list.length} ta mahsulot`;

    list.forEach(i => {
        let $newDiv = document.createElement("div");
        $newDiv.className = "wishlist-card";
        $newDiv.innerHTML = `
        <div style="background: #fff; border-radius: 16px; border: 1px solid #f0f0f5; overflow: hidden; position: relative; display: flex; flex-direction: column;">
            <button onclick="removeFromWishlist(${i.id})" style="position: absolute; top: 12px; right: 12px; border: none; background: #ffe5e5; color: #e53e3e; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; z-index: 10; font-size: 16px;">
                <i class="bi bi-trash-fill"></i>
            </button>
            <a href="../html/single.html?product-id=${i.id}" style="display: block; aspect-ratio: 1/1; background: #f5f5fa; padding: 12px;">
                <img src="${i.thumbnail}" alt="${i.title}" style="width: 100%; height: 100%; object-fit: contain;">
            </a>
            <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
                <h1 style="font-size: 15px; font-weight: 700; color: #1a1a1a;">${i.title}</h1>
                <strong style="font-size: 18px; color: #6c2bd9;">$${i.price}</strong>
                <button onclick="addToCartFromWishlist(${i.id})" style="padding: 10px; border: none; border-radius: 10px; background: #6c2bd9; color: white; font-weight: 700; cursor: pointer; margin-top: 6px;">
                    🛒 Savatchaga olish
                </button>
            </div>
        </div>`;
        $wishlistGrid.appendChild($newDiv);
    });
}

function addToCartFromWishlist(id){
    let list = getWishlist();
    let product = list.find(p => p.id == id);
    if(!product) return;
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let index = cart.findIndex(item => item.id == id);
    if(index !== -1){
        cart[index].quantity = (cart[index].quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`🛒 "${product.title}" savatchaga qo'shildi!`);
}

// Dark Mode Toggle
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

if($logoutBtn){
    $logoutBtn.addEventListener("click", ()=>{
        localStorage.removeItem("user");
        window.location.href = "../html/login.html";
    });
}

renderWishlist();
