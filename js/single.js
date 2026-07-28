let productId = location.search;
let id = new URLSearchParams(productId).get("product-id");

let img = document.querySelector(".single_img");
let nomi = document.querySelector(".single_title");
let narxi = document.querySelector(".single_price");
let rating = document.querySelector(".single_text");
let tarifi = document.querySelector(".single_desc");
let delet = document.querySelector(".singleDelet");
let update = document.querySelector(".singleUpdate");

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
    $commentName.value = "Odiljon";
}

fetch(`https://dummyjson.com/products/${id}`)
.then(res=>res.json())
.then(data=>{
    currentProduct = data;
    getsingle(data);
    renderComments(data.reviews || []);
    if (closeLoading) closeLoading.className = "loading_close";
});

function getsingle(item){
    if (img) img.src = `${item.thumbnail}`;
    if (nomi) nomi.innerHTML = `${item.title}`;
    if (narxi) narxi.innerHTML = `$${item.price}`;
    if (rating) rating.innerHTML = `⭐️ Rating: ${item.rating} / 5`;
    if (tarifi) tarifi.innerHTML = `${item.description}`;
}

// ================= COMMENTS & REVIEWS LOGIC =================
function getStoredReviews(){
    return JSON.parse(localStorage.getItem(`product_reviews_${id}`)) || [];
}

function renderComments(apiReviews){
    if (!$commentsList) return;
    
    let storedReviews = getStoredReviews();
    let allReviews = [...storedReviews, ...apiReviews];
    
    $commentsList.innerHTML = "";
    if (allReviews.length === 0) {
        $commentsList.innerHTML = `
            <div class="empty-comments">
                <i class="bi bi-chat-dots" style="font-size: 2rem; display: block; margin-bottom: 10px; color: #94a3b8;"></i>
                Hozircha izohlar mavjud emas. Birinchi bo'lib o'z fikringizni bildiring! ✨
            </div>
        `;
        if ($commentsBadge) $commentsBadge.textContent = "0";
        if ($avgRating) $avgRating.textContent = "⭐️ 0 / 5";
        return;
    }
    
    let totalStar = 0;
    allReviews.forEach(rev => {
        let stars = Number(rev.rating) || 5;
        totalStar += stars;
        let starSymbols = "⭐️".repeat(stars);
        
        let initial = rev.reviewerName ? rev.reviewerName.charAt(0).toUpperCase() : "O";
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
    if (rating) rating.innerHTML = `⭐️ Rating: ${avg} / 5 (${allReviews.length} izoh)`;
}

if ($commentForm) {
    $commentForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        let nameVal = $commentName ? $commentName.value.trim() : "Odiljon";
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
        stored.unshift(newReview); // yangi izoh tepada chiqishi uchun
        localStorage.setItem(`product_reviews_${id}`, JSON.stringify(stored));
        
        if ($commentText) $commentText.value = "";
        
        renderComments(currentProduct && currentProduct.reviews ? currentProduct.reviews : []);
        alert("✅ Izohingiz va fikringiz muvaffaqiyatli qo'shildi!");
    });
}
// =============================================================

if (delet) {
    delet.addEventListener("click", ()=>{
        fetch(`https://dummyjson.com/products/${id}`,{
            method:"DELETE"
        })
        .then(res=>res.json())
        .then(data=>{
            if(data){
                alert("Siz Mahsulotni o'chirdingiz");
                setTimeout(()=>{
                    window.location.href = "../html/index.html";
                },1500);
            }
        });
    });
}

if (update && closeModal) {
    update.addEventListener("click", ()=>{
        closeModal.className = "modal";  
        if (editI && img) editI.value = img.src;
        if (editN && nomi) editN.value = nomi.textContent;
        if (editP && narxi) editP.value = narxi.textContent.replace("$","");
        if (editD && tarifi) editD.value = tarifi.textContent;
    });
}

if (btnEdit && closeModal) {
    btnEdit.addEventListener("click", ()=>{
        let uPicture = editI ? editI.value : "";
        let uName = editN ? editN.value : "";
        let uPrice = editP ? editP.value : "";
        let uDesciription = editD ? editD.value : "";
        let editObj = {
            thumbnail: uPicture,
            title: uName,
            price: uPrice,
            description: uDesciription
        }; 
        fetch(`https://dummyjson.com/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editObj)
        })
        .then(res => res.json())
        .then(data=>{
            getsingle(data);
        });
        closeModal.className = "modal-close";  
    });
}

if (backBtn) {
    backBtn.addEventListener("click", ()=>{
        window.location.href = "../html/index.html";
    });
}