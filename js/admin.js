let savedUser = JSON.parse(localStorage.getItem("admin"));
let allUser = document.querySelector("#container");

// Dashboard Stat Elements
let $statUsersCount = document.getElementById("statUsersCount");
let $statProductsCount = document.getElementById("statProductsCount");
let $adminUserSearch = document.getElementById("adminUserSearch");
let $adminLogoutBtn = document.getElementById("adminLogoutBtn");

// Modal Elements
let imgModal = document.querySelector("#imgModal");
let imgModalPic = document.querySelector("#imgModalPic");
let imgModalClose = document.querySelector("#imgModalClose");

if(!savedUser){
    window.location.href = "../html/login.html";
} else {
    loadAdminData();
}

let loadedUsersList = [];

function loadAdminData(){
    fetch("https://dummyjson.com/users")
    .then(res=>res.json())
    .then(data=>{
        let customUsers = JSON.parse(localStorage.getItem("added_users")) || [];
        loadedUsersList = [...customUsers, ...data.users];
        
        if($statUsersCount) $statUsersCount.textContent = `${loadedUsersList.length} ta`;
        
        let customProds = JSON.parse(localStorage.getItem("added_products")) || [];
        if($statProductsCount) $statProductsCount.textContent = `${customProds.length + 30} ta`;

        renderUsers(loadedUsersList);
    });
}

function renderUsers(users){
    if(!allUser) return;
    allUser.innerHTML = "";

    if(users.length === 0){
        allUser.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #94a3b8;">
                <i class="bi bi-person-x" style="font-size: 48px; display: block; margin-bottom: 12px; color: #64748b;"></i>
                Hech qanday foydalanuvchi topilmadi
            </div>
        `;
        return;
    }

    users.forEach(i => {
        let userPhoto = (i.image && !i.image.includes("dummyjson.com/icon")) ? i.image : `https://i.pravatar.cc/300?img=${(i.id % 70) || 1}`;
        
        let newDiv = document.createElement("div");
        newDiv.innerHTML = `
            <img src="${userPhoto}" alt="${i.firstName}" title="Kattalashtirish uchun bosing">
            <div class="body">
                <h1>${i.firstName} ${i.lastName || ''}</h1>
                <p>${i.email}</p>
                <strong>${i.age}</strong>
                <div class="card-actions-bar">
                    <a href="../html/asingle.html?user-id=${i.id}" class="btn-card-view">
                        <i class="bi bi-eye"></i> Batafsil
                    </a>
                    <button class="btn-card-del" onclick="deleteUser(${i.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;

        let cardImg = newDiv.querySelector("img");
        if (cardImg) {
            cardImg.style.cursor = "pointer";
            cardImg.addEventListener("click", ()=>{
                if (imgModalPic) imgModalPic.src = userPhoto;
                if (imgModal) imgModal.classList.add("open");
            });
        }

        allUser.appendChild(newDiv);
    });
}

function deleteUser(userId){
    if(confirm("Ushbu foydalanuvchini ro'yxatdan o'chirmoqchimisiz?")){
        let customUsers = JSON.parse(localStorage.getItem("added_users")) || [];
        customUsers = customUsers.filter(u => u.id != userId);
        localStorage.setItem("added_users", JSON.stringify(customUsers));

        loadedUsersList = loadedUsersList.filter(u => u.id != userId);
        renderUsers(loadedUsersList);
        if($statUsersCount) $statUsersCount.textContent = `${loadedUsersList.length} ta`;
    }
}

// Live Search Filter
if($adminUserSearch){
    $adminUserSearch.addEventListener("keyup", ()=>{
        let query = $adminUserSearch.value.toLowerCase().trim();
        let filtered = loadedUsersList.filter(u => {
            let fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
            return fullName.includes(query) || (u.email && u.email.toLowerCase().includes(query));
        });
        renderUsers(filtered);
    });
}

// Admin Logout
if($adminLogoutBtn){
    $adminLogoutBtn.addEventListener("click", ()=>{
        localStorage.removeItem("admin");
        window.location.href = "../html/login.html";
    });
}

// Modal handling
if (imgModalClose) {
    imgModalClose.addEventListener("click", ()=>{
        if (imgModal) imgModal.classList.remove("open");
    });
}
if (imgModal) {
    imgModal.addEventListener("click", (e)=>{
        if(e.target === imgModal){
            imgModal.classList.remove("open");
        }
    });
}

// Add User Modal handling
let $addUserModal = document.getElementById("addUserModal");
let $openAddUserBtn = document.getElementById("openAddUserBtn");
let $closeAddUserModal = document.getElementById("closeAddUserModal");
let $addUserForm = document.getElementById("addUserForm");

if ($openAddUserBtn) {
    $openAddUserBtn.addEventListener("click", ()=>{
        if ($addUserModal) $addUserModal.classList.add("open");
    });
}
if ($closeAddUserModal) {
    $closeAddUserModal.addEventListener("click", ()=>{
        if ($addUserModal) $addUserModal.classList.remove("open");
    });
}

if ($addUserForm) {
    $addUserForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        let name = document.getElementById("uNameInp").value.trim();
        let email = document.getElementById("uEmailInp").value.trim();
        let age = document.getElementById("uAgeInp").value.trim();
        let imgUrl = document.getElementById("uImgInp").value.trim();

        let newUser = {
            id: Date.now(),
            firstName: name,
            email: email,
            age: age,
            image: imgUrl || `https://i.pravatar.cc/300?img=${Math.floor(Math.random()*70)+1}`
        };

        let customUsers = JSON.parse(localStorage.getItem("added_users")) || [];
        customUsers.unshift(newUser);
        localStorage.setItem("added_users", JSON.stringify(customUsers));

        loadAdminData();

        if ($addUserModal) $addUserModal.classList.remove("open");
        $addUserForm.reset();
        alert(`✅ "${name}" admin panelga muvaffaqiyatli qo'shildi!`);
    });
}