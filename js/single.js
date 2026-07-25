let productId = location.search
let id = new URLSearchParams(productId).get("product-id")

let img = document.querySelector(".single_img")
let nomi = document.querySelector(".single_title")
let narxi = document.querySelector(".single_price")
let rating = document.querySelector(".single_text")
let tarifi = document.querySelector(".single_desc")
let delet = document.querySelector(".singleDelet")
let update = document.querySelector(".singleUpdate")

let editI = document.querySelector(".editpicture")
let editN = document.querySelector(".editTitle")
let editP = document.querySelector(".editPrice")
let editD = document.querySelector(".editDesc")
let btnEdit = document.querySelector(".editBtn")

let closeModal = document.querySelector(".modal-close")
let backBtn = document.querySelector(".backPage")

fetch(`https://dummyjson.com/products/${id}`)
.then(res => res.json())
.then(data => {
    getsingle(data);
})

function getsingle(item){
    console.log(item);

    img.src = `${item.thumbnail}`
    nomi.innerHTML = `${item.title}`
    narxi.innerHTML = `$${item.price}`
    rating.innerHTML = `${item.rating}`
    tarifi.innerHTML = `${item.description}`

    delet.addEventListener("click",()=>{
        fetch(`https://dummyjson.com/products/${id}`,{
            method:"DELETE"
        })
        .then(res=>res.json())
        .then(data=>{
            if(data){
                alert("Siz Mahsulotni o'chirdingiz ")
                setTimeout(()=>{
                    window.location.href = "../html/index.html"
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
    let uPrice = editP.value
    let uDesciription = editD.value
    let editObj = {
        thumbnail:uPicture,
        title:uName,
        price:uPrice,
        description:uDesciription
    }
    fetch(`https://dummyjson.com/products/${id}`, {
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
    window.location.href= "../html/index.html"
})