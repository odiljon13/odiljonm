let userId = location.search
let id = new URLSearchParams(userId).get("user-id")

let img = document.querySelector(".single_img")
let nomi = document.querySelector(".single_title")
let yosh = document.querySelector(".single_price")
let email = document.querySelector(".single_text")
let tarifi = document.querySelector(".single_desc")
let delet = document.querySelector(".singleDelet")
let update = document.querySelector(".singleUpdate")

let editI = document.querySelector(".editpicture")
let editN = document.querySelector(".editName")
let editE = document.querySelector(".editEmail")
let editA = document.querySelector(".editAge")
let btnEdit = document.querySelector(".editBtn")

let closeModal = document.querySelector(".modal-close")
let backBtn = document.querySelector(".backPage")

fetch(`https://dummyjson.com/users/${id}`)
.then(res => res.json())
.then(data => {
    getsingle(data);
})

function getsingle(item){
    console.log(item);

    img.src = `${item.image}`
    nomi.innerHTML = `${item.firstName} ${item.lastName}`
    yosh.innerHTML = `${item.age} yosh`
    email.innerHTML = `${item.email}`
    tarifi.innerHTML = `${item.phone ? item.phone : ""}`

    delet.addEventListener("click",()=>{
        fetch(`https://dummyjson.com/users/${id}`,{
            method:"DELETE"
        })
        .then(res=>res.json())
        .then(data=>{
            if(data){
                alert("Siz Foydalanuvchini o'chirdingiz ")
                setTimeout(()=>{
                    window.location.href = "../html/admin.html"
                },1500)
            }
        })
    })

    update.addEventListener("click",()=>{
        closeModal.className = "modal"
    })
}

btnEdit.addEventListener("click",()=>{
    let uPicture = editI.value
    let uName = editN.value
    let uEmail = editE.value
    let uAge = editA.value
    let editObj = {
        image:uPicture,
        firstName:uName,
        email:uEmail,
        age:uAge
    }
    fetch(`https://dummyjson.com/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editObj)
    })
    .then(res => res.json())
    .then(data=>{
        getsingle(data);
    });
    closeModal.className = "modal-close"
})

backBtn.addEventListener("click",()=>{
    window.location.href= "../html/admin.html"
})