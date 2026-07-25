let savedUser = JSON.parse(localStorage.getItem("admin"))
let allUser = document.querySelector("#container")

// Rasmni katta ko'rsatish uchun modal elementlari
let imgModal = document.querySelector("#imgModal")
let imgModalPic = document.querySelector("#imgModalPic")
let imgModalClose = document.querySelector("#imgModalClose")

if(!savedUser){
 window.location.href = "../html/login.html"
}
else{
    fetch("https://dummyjson.com/users")
    .then(res=>res.json())
    .then(data=>{
        getUser(data.users);

    })
}
function getUser(item){
item.map(i=>{
    console.log(i);

let newDiv =  document.createElement("div")
newDiv.innerHTML  = `<img src="${i.image}" alt="">
<a href="../html/asingle.html?user-id=${i.id}">
<div class="body">
    <h1>${i.firstName}</h1>
    <p>${i.email}</p>
    <strong>${i.age}</strong>
</div>
</a>`

// Kartadagi rasmni bosganda, uni katta oynada ochish
let cardImg = newDiv.querySelector("img")
cardImg.style.cursor = "pointer"
cardImg.addEventListener("click", ()=>{
    imgModalPic.src = i.image
    imgModal.classList.add("open")
})

    allUser.appendChild(newDiv)
})

}

// Modalni yopish (X tugmasi yoki fondan tashqariga bosilganda)
imgModalClose.addEventListener("click", ()=>{
    imgModal.classList.remove("open")
})
imgModal.addEventListener("click", (e)=>{
    if(e.target === imgModal){
        imgModal.classList.remove("open")
    }
})