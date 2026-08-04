let productId = location.search;
let id = new URLSearchParams(productId).get("product-id");

let img = document.querySelector(".single_img");
let nomi = document.querySelector(".single_title");
let narxi = document.querySelector(".single_price");
let rating = document.querySelector(".single_text");
let tarifi = document.querySelector(".single_desc");
let delet = document.querySelector(".singleDelet");
let update = document.querySelector(".singleUpdate");

// Xavfsizlik: Mahsulotni o'chirish va tahrirlash tugmalarini DOMdan butunlay o'chirib tashlash
document.querySelectorAll(".singleDelet, .singleUpdate, .modal-close").forEach(el => el.remove());

let editI = document.querySelector(".editpicture");
let editN = document.querySelector(".editTitle");
let editP = document.querySelector(".editPrice");
let editD = document.querySelector(".editDesc");
let btnEdit = document.querySelector(".editBtn");
let backBtn = document.querySelector(".backPage");
let closeModal = document.querySelector(".modal-close");
let closeLoading = document.querySelector(".loading_close");

if (closeLoading) closeLoading.className = "loading_parent";

// Comment Section Elements
let $commentsList = document.getElementById("commentsList");
let $commentsBadge = document.getElementById("comments-count-badge");
let $avgRating = document.getElementById("average-rating");
let $commentForm = document.getElementById("commentForm");
let $commentName = document.getElementById("commentName");
let $commentRating = document.getElementById("commentRating");
let $commentText = document.getElementById("commentText");

let currentProduct = null;

// Autofill username if available in localStorage
let savedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("admin"));
if ($commentName && savedUser) {
    if (savedUser.firstName) $commentName.value = savedUser.firstName;
    else if (savedUser.email) $commentName.value = savedUser.email.split("@")[0];
    else if (typeof savedUser === "string") $commentName.value = savedUser;
} else if ($commentName) {
    $commentName.value = "Mehmon Foydalanuvchi";
}

// Load product from Uzum Market localStorage dataset
let allProds = typeof getStoredUzumProducts === "function" ? getStoredUzumProducts() : (JSON.parse(localStorage.getItem("uzum_products")) || []);
currentProduct = allProds.find(p => p.id == id) || allProds[0];

if (currentProduct) {
    getsingle(currentProduct);
    renderComments(currentProduct.reviews || []);
}
if (closeLoading) closeLoading.className = "loading_close";

function getsingle(item){
    if (!item) return;
    let mainImgUrl = (item.images && item.images[0]) ? item.images[0] : (item.thumbnail || "");
    if (img) img.src = mainImgUrl;
    if (nomi) nomi.innerHTML = `${item.title}`;
    
    let priceFormatted = typeof formatSum === "function" ? formatSum(item.price) : `${item.price} so'm`;
    if (narxi) narxi.innerHTML = `${priceFormatted}`;
    if (rating) rating.innerHTML = `⭐️ Rating: ${item.rating || 4.9} / 5 (${item.reviewsCount || 12} ta sharh) • <span style="color: #10b981; font-weight: 700;">Omborda: ${item.stock || 15} ta bor</span>`;
    if (tarifi) tarifi.innerHTML = `${item.description}`;

    // Variant Pills Render (Colors & Sizes)
    let $colorSelector = document.getElementById("colorSelector");
    let $sizeSelector = document.getElementById("sizeSelector");

    if ($colorSelector && item.colors) {
        $colorSelector.innerHTML = item.colors.map((c, idx) => `
            <button type="button" class="variant-pill ${idx === 0 ? 'active' : ''}" onclick="selectVariant(this, 'color')" style="padding: 6px 14px; border: 1.5px solid ${idx === 0 ? '#7000ff' : '#cbd5e1'}; background: ${idx === 0 ? '#7000ff' : '#ffffff'}; color: ${idx === 0 ? '#ffffff' : '#1e293b'}; border-radius: 20px; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all 0.2s;">${c}</button>
        `).join('');
    }

    if ($sizeSelector && item.sizes) {
        $sizeSelector.innerHTML = item.sizes.map((s, idx) => `
            <button type="button" class="variant-pill ${idx === 0 ? 'active' : ''}" onclick="selectVariant(this, 'size')" style="padding: 6px 14px; border: 1.5px solid ${idx === 0 ? '#7000ff' : '#cbd5e1'}; background: ${idx === 0 ? '#7000ff' : '#ffffff'}; color: ${idx === 0 ? '#ffffff' : '#1e293b'}; border-radius: 20px; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all 0.2s;">${s}</button>
        `).join('');
    }
}

window.selectVariant = function(btn, type) {
    let parent = btn.parentElement;
    if (!parent) return;

    // Reset styles on all pills in this group
    parent.querySelectorAll(".variant-pill").forEach(b => {
        b.style.border = "1.5px solid #cbd5e1";
        b.style.background = "#ffffff";
        b.style.color = "#1e293b";
        b.classList.remove("active");
    });

    // Highlight selected pill
    btn.style.border = "1.5px solid #7000ff";
    btn.style.background = "#7000ff";
    btn.style.color = "#ffffff";
    btn.classList.add("active");

    let val = btn.textContent.trim();

    // Dinamik Rasm O'zgarishi: Rang tanlanganda mahsulot rasmi o'zgaradi!
    if (type === 'color' && currentProduct) {
        let targetImg = (currentProduct.colorImages && currentProduct.colorImages[val])
            ? currentProduct.colorImages[val]
            : (currentProduct.images ? currentProduct.images[Array.from(parent.children).indexOf(btn) % currentProduct.images.length] : currentProduct.thumbnail);

        let $mainImg = document.querySelector(".single_img");
        if ($mainImg && targetImg) {
            $mainImg.style.opacity = "0.2";
            $mainImg.style.transition = "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)";
            setTimeout(() => {
                $mainImg.src = targetImg;
                $mainImg.style.opacity = "1";
            }, 180);
        }
    }
};

// ================= COMMENTS & REVIEWS LOGIC =================
function getStoredReviews(){
    return JSON.parse(localStorage.getItem(`product_reviews_${id}`)) || [];
}

function renderComments(apiReviews){
    if (!$commentsList) return;
    
    let storedReviews = getStoredReviews();
    let allReviews = [...storedReviews, ...(apiReviews || [])];
    
    $commentsList.innerHTML = "";
    if (allReviews.length === 0) {
        $commentsList.innerHTML = `
            <div class="empty-comments" style="padding: 20px; text-align: center; color: #94a3b8;">
                <i class="bi bi-chat-dots" style="font-size: 2rem; display: block; margin-bottom: 10px; color: #94a3b8;"></i>
                Hozircha izohlar mavjud emas. Birinchi bo'lib o'z fikringizni bildiring! ✨
            </div>
        `;
        if ($commentsBadge) $commentsBadge.textContent = "0";
        if ($avgRating) $avgRating.textContent = "⭐️ 5.0 / 5";
        return;
    }
    
    let totalStar = 0;
    allReviews.forEach(rev => {
        let stars = Number(rev.rating) || 5;
        totalStar += stars;
        let starSymbols = "⭐️".repeat(stars);
        
        let initial = rev.reviewerName ? rev.reviewerName.charAt(0).toUpperCase() : "U";
        let dateStr = rev.date && rev.date.includes("T") ? rev.date.split("T")[0] : (rev.date || "Bugun");
        
        let card = document.createElement("div");
        card.className = "comment-card";
        card.innerHTML = `
            <div class="comment-user-header">
                <div class="user-info">
                    <div class="user-avatar">${initial}</div>
                    <div class="user-details">
                        <h4>${rev.reviewerName || "Foydalanuvchi"}</h4>
                        <span class="comment-date"><i class="bi bi-calendar3"></i> ${dateStr}</span>
                    </div>
                </div>
                <div class="comment-stars" title="${stars} - yulduz">${starSymbols}</div>
            </div>
            <div class="comment-body">
                ${rev.comment || ""}
            </div>
        `;
        $commentsList.appendChild(card);
    });
    
    let avg = (totalStar / allReviews.length).toFixed(1);
    if ($commentsBadge) $commentsBadge.textContent = allReviews.length;
    if ($avgRating) $avgRating.textContent = `⭐️ ${avg} / 5`;
    if (rating) rating.innerHTML = `⭐️ Rating: ${avg} / 5 (${allReviews.length} ta sharh)`;
}

if ($commentForm) {
    $commentForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        let nameVal = $commentName ? $commentName.value.trim() : "Foydalanuvchi";
        let rateVal = $commentRating ? Number($commentRating.value) : 5;
        let textVal = $commentText ? $commentText.value.trim() : "";
        
        if (!textVal) return;
        
        let newReview = {
            reviewerName: nameVal,
            rating: rateVal,
            comment: textVal,
            date: new Date().toLocaleDateString("uz-UZ")
        };
        
        let stored = getStoredReviews();
        stored.unshift(newReview);
        localStorage.setItem(`product_reviews_${id}`, JSON.stringify(stored));
        
        if ($commentText) $commentText.value = "";
        
        renderComments(currentProduct && currentProduct.reviews ? currentProduct.reviews : []);
        alert("✅ Izohingiz va fikringiz muvaffaqiyatli qo'shildi!");
    });
}

// Delete product from Uzum dataset
if (delet) {
    delet.addEventListener("click", ()=>{
        if (confirm("Ushbu mahsulotni o'chirishni tasdiqlaysizmi?")) {
            let list = typeof getStoredUzumProducts === "function" ? getStoredUzumProducts() : (JSON.parse(localStorage.getItem("uzum_products")) || []);
            list = list.filter(p => p.id != id);
            if (typeof saveUzumProducts === "function") {
                saveUzumProducts(list);
            } else {
                localStorage.setItem("uzum_products", JSON.stringify(list));
            }
            alert("✅ Mahsulot o'chirildi");
            window.location.href = "../html/index.html";
        }
    });
}

if (update && closeModal) {
    update.addEventListener("click", ()=>{
        closeModal.className = "modal";  
        if (editI && img) editI.value = img.src;
        if (editN && nomi) editN.value = nomi.textContent;
        if (editP && narxi) editP.value = currentProduct ? currentProduct.price : "";
        if (editD && tarifi) editD.value = tarifi.textContent;
    });
}

if (btnEdit && closeModal) {
    btnEdit.addEventListener("click", ()=>{
        let uPicture = editI ? editI.value : "";
        let uName = editN ? editN.value : "";
        let uPrice = editP ? Number(editP.value) : (currentProduct ? currentProduct.price : 100000);
        let uDescription = editD ? editD.value : "";

        let list = typeof getStoredUzumProducts === "function" ? getStoredUzumProducts() : (JSON.parse(localStorage.getItem("uzum_products")) || []);
        let idx = list.findIndex(p => p.id == id);
        
        if (idx !== -1) {
            list[idx].title = uName;
            list[idx].price = uPrice;
            list[idx].monthlyPrice = Math.round(uPrice / 12);
            list[idx].thumbnail = uPicture;
            if(!list[idx].images) list[idx].images = [uPicture];
            else list[idx].images[0] = uPicture;
            list[idx].description = uDescription;

            if (typeof saveUzumProducts === "function") {
                saveUzumProducts(list);
            } else {
                localStorage.setItem("uzum_products", JSON.stringify(list));
            }

            currentProduct = list[idx];
            getsingle(currentProduct);
            alert("✅ Mahsulot tahrirlandi!");
        }

        closeModal.className = "modal-close";  
    });
}

if (backBtn) {
    backBtn.addEventListener("click", ()=>{
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = window.location.pathname.includes("/html/") ? "index.html" : "./index.html";
        }
    });
}