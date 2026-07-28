let userId = location.search;
let id = new URLSearchParams(userId).get("user-id");

let img = document.querySelector(".single_img");
let nomi = document.querySelector(".single_title");
let yosh = document.querySelector(".single_price");
let email = document.querySelector(".single_text");
let tarifi = document.querySelector(".single_desc");
let delet = document.querySelector(".singleDelet");
let update = document.querySelector(".singleUpdate");

let editI = document.querySelector(".editpicture");
let editN = document.querySelector(".editName");
let editE = document.querySelector(".editEmail");
let editA = document.querySelector(".editAge");
let btnEdit = document.querySelector(".editBtn");

let closeModal = document.querySelector(".modal-close");
let backBtn = document.querySelector(".backPage");

let currentItem = null;

// Avval localStoragedan izlaymiz (Admin tomondan qo'shilgan foydalanuvchilar uchun)
let customUsers = JSON.parse(localStorage.getItem("added_users")) || [];
let foundCustomUser = customUsers.find(u => u.id == id);

if (foundCustomUser) {
    currentItem = foundCustomUser;
    getsingle(foundCustomUser);
} else {
    fetch(`https://dummyjson.com/users/${id}`)
    .then(res => res.json())
    .then(data => {
        currentItem = data;
        getsingle(data);
    })
    .catch(() => {
        alert("Foydalanuvchi ma'lumotlari topilmadi");
    });
}

function getsingle(item){
    if(!item) return;

    let userPhoto = (item.image && !item.image.includes("dummyjson.com/icon")) ? item.image : `https://i.pravatar.cc/300?img=${(item.id % 70) || 1}`;

    if (img) img.src = userPhoto;
    if (nomi) nomi.innerHTML = `${item.firstName || 'Foydalanuvchi'} ${item.lastName || ''}`;
    if (yosh) yosh.innerHTML = `${item.age || 20} yosh`;
    if (email) email.innerHTML = `${item.email || 'email@example.com'}`;
    if (tarifi) tarifi.innerHTML = `${item.phone ? item.phone : "Tizim foydalanuvchisi"}`;
}

if (delet) {
    delet.addEventListener("click", ()=>{
        if(confirm("Ushbu foydalanuvchini o'chirishni tasdiqlaysizmi?")){
            let customUsersList = JSON.parse(localStorage.getItem("added_users")) || [];
            let isCustom = customUsersList.some(u => u.id == id);
            
            if (isCustom) {
                customUsersList = customUsersList.filter(u => u.id != id);
                localStorage.setItem("added_users", JSON.stringify(customUsersList));
                alert("Siz Foydalanuvchini o'chirdingiz");
                window.location.href = "../html/admin.html";
            } else {
                fetch(`https://dummyjson.com/users/${id}`, { method: "DELETE" })
                .then(res => res.json())
                .then(() => {
                    alert("Siz Foydalanuvchini o'chirdingiz");
                    window.location.href = "../html/admin.html";
                })
                .catch(() => {
                    alert("Siz Foydalanuvchini o'chirdingiz");
                    window.location.href = "../html/admin.html";
                });
            }
        }
    });
}

if (update && closeModal) {
    update.addEventListener("click", ()=>{
        closeModal.className = "modal";
        if (editI && img) editI.value = img.src;
        if (editN && currentItem) editN.value = `${currentItem.firstName || ''} ${currentItem.lastName || ''}`.trim();
        if (editE && currentItem) editE.value = currentItem.email || '';
        if (editA && currentItem) editA.value = currentItem.age || '';
    });
}

if (btnEdit) {
    btnEdit.addEventListener("click", ()=>{
        let uPicture = editI ? editI.value : "";
        let uName = editN ? editN.value : "";
        let uEmail = editE ? editE.value : "";
        let uAge = editA ? editA.value : "";

        let customUsersList = JSON.parse(localStorage.getItem("added_users")) || [];
        let customIndex = customUsersList.findIndex(u => u.id == id);

        if (customIndex !== -1) {
            customUsersList[customIndex].image = uPicture || customUsersList[customIndex].image;
            customUsersList[customIndex].firstName = uName;
            customUsersList[customIndex].email = uEmail;
            customUsersList[customIndex].age = uAge;
            localStorage.setItem("added_users", JSON.stringify(customUsersList));
            currentItem = customUsersList[customIndex];
            getsingle(currentItem);
        } else {
            let editObj = { image: uPicture, firstName: uName, email: uEmail, age: uAge };
            fetch(`https://dummyjson.com/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editObj)
            })
            .then(res => res.json())
            .then(data => {
                currentItem = data;
                getsingle(data);
            });
        }
        if (closeModal) closeModal.className = "modal-close";
    });
}

if (backBtn) {
    backBtn.addEventListener("click", ()=>{
        window.location.href = "../html/admin.html";
    });
}