// Admin Panel Security Guard (Foydalanuvchilar kirishini taqiqlash)
let savedAdmin = JSON.parse(localStorage.getItem("admin"));
let $adminProdContainer = document.getElementById("adminProdContainer");

// Stats & Search Elements
let $statProductsCount = document.getElementById("statProductsCount");
let $statCategoriesCount = document.getElementById("statCategoriesCount");
let $adminProdSearch = document.getElementById("adminProdSearch");
let $adminCatSelect = document.getElementById("adminCatSelect");
let $adminLogoutBtn = document.getElementById("adminLogoutBtn");

let loadedProductsList = [];

if (!savedAdmin) {
    alert("⛔ Kirish taqiqlangan! Ushbu Admin paneliga faqat avtorizatsiyadan o'tgan Admin kirishi mumkin.");
    window.location.href = "../html/index.html";
} else {
    initAdmin();
}

function initAdmin(){
    loadedProductsList = typeof getStoredUzumProducts === "function" ? getStoredUzumProducts() : [];
    updateAdminStats();
    renderAdminProducts(loadedProductsList);
}

function updateAdminStats(){
    if($statProductsCount) $statProductsCount.textContent = `${loadedProductsList.length} ta`;
    
    if($statCategoriesCount){
        let categories = new Set(loadedProductsList.map(p => p.category).filter(Boolean));
        $statCategoriesCount.textContent = `${categories.size} ta`;
    }
}

function renderAdminProducts(products){
    if(!$adminProdContainer) return;
    $adminProdContainer.innerHTML = "";

    if(products.length === 0){
        $adminProdContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #94a3b8;">
                <i class="bi bi-box-seam" style="font-size: 48px; display: block; margin-bottom: 12px; color: #64748b;"></i>
                Hech qanday mahsulot topilmadi
            </div>
        `;
        return;
    }

    products.forEach(p => {
        let mainImg = (p.images && p.images[0]) ? p.images[0] : (p.thumbnail || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80");
        let priceStr = typeof formatSum === "function" ? formatSum(p.price) : `${p.price} so'm`;
        let monthlyStr = p.monthlyPrice ? (typeof formatSum === "function" ? formatSum(p.monthlyPrice) : `${p.monthlyPrice} so'm`) : `${Math.round(p.price / 12)} so'm`;

        let card = document.createElement("div");
        card.className = "admin-prod-card";
        card.style.cssText = "background: #161b22; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px; position: relative;";
        
        card.innerHTML = `
            <div style="width: 100%; aspect-ratio: 1/1; background: #0d1117; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative;">
                <img src="${mainImg}" alt="${p.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                <span style="position: absolute; top: 10px; left: 10px; background: #7000ff; color: white; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">${p.category || 'Mahsulot'}</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px; flex: 1;">
                <h3 style="font-size: 14px; font-weight: 600; color: #fff; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${p.title}</h3>
                <span style="font-size: 12px; color: #a855f7; font-weight: 600;">${monthlyStr} / oy</span>
                <strong style="font-size: 16px; color: #34d399; font-weight: 800;">${priceStr}</strong>
                <span style="font-size: 12px; color: #94a3b8;">⭐️ ${p.rating || 4.9} (${p.reviewsCount || 10} ta sharh)</span>
            </div>
            <div style="display: flex; gap: 8px; margin-top: auto; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08);">
                <button class="btn-admin-edit" onclick="openEditModal(${p.id})" style="flex: 1; padding: 9px; background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <i class="bi bi-pencil-square"></i> Tahrirlash
                </button>
                <button class="btn-admin-del" onclick="deleteAdminProd(${p.id})" style="padding: 9px 14px; background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer;">
                    <i class="bi bi-trash-fill"></i>
                </button>
            </div>
        `;
        $adminProdContainer.appendChild(card);
    });
}

// Delete Product
function deleteAdminProd(prodId){
    let prod = loadedProductsList.find(p => p.id == prodId);
    let titleStr = prod ? `"${prod.title}"` : "Ushbu mahsulot";
    
    if(confirm(`${titleStr}ni bazadan o'chirib tashlamoqchimisiz?`)){
        loadedProductsList = loadedProductsList.filter(p => p.id != prodId);
        if (typeof saveUzumProducts === "function") {
            saveUzumProducts(loadedProductsList);
        } else {
            localStorage.setItem("uzum_products", JSON.stringify(loadedProductsList));
        }
        updateAdminStats();
        renderAdminProducts(loadedProductsList);
        alert("✅ Mahsulot o'chirildi!");
    }
}

// Live Search & Category Filter
function filterAdminProds(){
    let query = $adminProdSearch ? $adminProdSearch.value.toLowerCase().trim() : "";
    let catVal = $adminCatSelect ? $adminCatSelect.value : "all";

    let filtered = loadedProductsList.filter(p => {
        let matchesSearch = p.title.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query));
        let matchesCat = catVal === "all" || (p.category && p.category.toLowerCase() === catVal.toLowerCase());
        return matchesSearch && matchesCat;
    });

    renderAdminProducts(filtered);
}

if($adminProdSearch) $adminProdSearch.addEventListener("keyup", filterAdminProds);
if($adminCatSelect) $adminCatSelect.addEventListener("change", filterAdminProds);

// Admin Logout
if($adminLogoutBtn){
    $adminLogoutBtn.addEventListener("click", ()=>{
        localStorage.removeItem("admin");
        window.location.href = "../html/login.html";
    });
}

// Modal Elements: Add Product
let $addProdModal = document.getElementById("addProdModal");
let $openAddProdBtn = document.getElementById("openAddProdBtn");
let $closeAddProdModal = document.getElementById("closeAddProdModal");
let $addProdForm = document.getElementById("addProdForm");

if($openAddProdBtn){
    $openAddProdBtn.addEventListener("click", ()=>{
        if($addProdModal) $addProdModal.classList.add("open");
    });
}
if($closeAddProdModal){
    $closeAddProdModal.addEventListener("click", ()=>{
        if($addProdModal) $addProdModal.classList.remove("open");
    });
}

if($addProdForm){
    $addProdForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        let title = document.getElementById("apTitle").value.trim();
        let price = Number(document.getElementById("apPrice").value);
        let category = document.getElementById("apCategory").value;
        let badge = document.getElementById("apBadge").value.trim();
        let img1 = document.getElementById("apImg1").value.trim();
        let img2 = document.getElementById("apImg2") ? document.getElementById("apImg2").value.trim() : "";
        let desc = document.getElementById("apDesc").value.trim();

        let imgList = [img1];
        if(img2) imgList.push(img2);

        let newProd = {
            id: Date.now(),
            title: title,
            price: price,
            oldPrice: Math.round(price * 1.25),
            monthlyPrice: Math.round(price / 12),
            rating: 5.0,
            reviewsCount: 1,
            badge: badge || "Yangi",
            category: category,
            thumbnail: img1,
            images: imgList,
            description: desc
        };

        loadedProductsList.unshift(newProd);
        if (typeof saveUzumProducts === "function") {
            saveUzumProducts(loadedProductsList);
        } else {
            localStorage.setItem("uzum_products", JSON.stringify(loadedProductsList));
        }

        updateAdminStats();
        renderAdminProducts(loadedProductsList);
        
        if($addProdModal) $addProdModal.classList.remove("open");
        $addProdForm.reset();
        alert(`✅ Yangi Uzum mahsuloti "${title}" muvaffaqiyatli saqlandi!`);
    });
}

// Modal Elements: Edit Product
let $editProdModal = document.getElementById("editProdModal");
let $closeEditProdModal = document.getElementById("closeEditProdModal");
let $editProdForm = document.getElementById("editProdForm");

function openEditModal(prodId){
    let prod = loadedProductsList.find(p => p.id == prodId);
    if(!prod) return;

    document.getElementById("epId").value = prod.id;
    document.getElementById("epTitle").value = prod.title || "";
    document.getElementById("epPrice").value = prod.price || "";
    document.getElementById("epCategory").value = prod.category || "Elektronika";
    document.getElementById("epBadge").value = prod.badge || "";
    document.getElementById("epImg1").value = (prod.images && prod.images[0]) ? prod.images[0] : (prod.thumbnail || "");
    document.getElementById("epDesc").value = prod.description || "";

    if($editProdModal) $editProdModal.classList.add("open");
}

if($closeEditProdModal){
    $closeEditProdModal.addEventListener("click", ()=>{
        if($editProdModal) $editProdModal.classList.remove("open");
    });
}

if($editProdForm){
    $editProdForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        let prodId = document.getElementById("epId").value;
        let index = loadedProductsList.findIndex(p => p.id == prodId);
        if(index === -1) return;

        let title = document.getElementById("epTitle").value.trim();
        let price = Number(document.getElementById("epPrice").value);
        let category = document.getElementById("epCategory").value;
        let badge = document.getElementById("epBadge").value.trim();
        let img1 = document.getElementById("epImg1").value.trim();
        let desc = document.getElementById("epDesc").value.trim();

        loadedProductsList[index].title = title;
        loadedProductsList[index].price = price;
        loadedProductsList[index].monthlyPrice = Math.round(price / 12);
        loadedProductsList[index].category = category;
        loadedProductsList[index].badge = badge;
        loadedProductsList[index].thumbnail = img1;
        if(!loadedProductsList[index].images) loadedProductsList[index].images = [img1];
        else loadedProductsList[index].images[0] = img1;
        loadedProductsList[index].description = desc;

        if (typeof saveUzumProducts === "function") {
            saveUzumProducts(loadedProductsList);
        } else {
            localStorage.setItem("uzum_products", JSON.stringify(loadedProductsList));
        }

        updateAdminStats();
        renderAdminProducts(loadedProductsList);

        if($editProdModal) $editProdModal.classList.remove("open");
        alert(`✅ Mahsulot "${title}" muvaffaqiyatli yangilandi!`);
    });
}