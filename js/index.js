let $box = document.querySelector("#container")
let $search = document.querySelector(".searchInp")
let $sort = document.querySelector("#tanlov")
let lout = document.querySelector("#logout")

let savedUser = JSON.parse(localStorage.getItem("user"))
if(savedUser){
fetch("https://dummyjson.com/products")
.then(res=>res.json())
.then(data=>{
    allProducts = data.products
    getdata(allProducts)
    })
}
else{
    alert("Siz ro'yxatdan o'tishingiz kerak")
    setTimeout(()=>{
window.location.href = "../html/login.html"
    },1500)
}
let allProducts = []

function getdata(item){
    $box.innerHTML = ""
    item.map(i=>{

let $newDiv =  document.createElement("div")
$newDiv.innerHTML = `    <div>
<a href="../html/single.html?product-id=${i.id}">

        <img src="${i.thumbnail}" alt="">
        </a>
        <div class="body">
            <h1>${i.title}</h1>
            <strong>$${i.price}</strong>
            <p>${i.description}</p>
            <button>sotib olish</button>
        </div>
    </div>`
    console.log($newDiv);

$box.appendChild($newDiv)
    })
}

function searchandSort(){

let searchWords = $search.value.toLowerCase().trim()
let sortValue = $sort.value
console.log(sortValue,searchWords);
let filtered  = allProducts.filter(product=>{
    return  product.title.toLowerCase().includes(searchWords)
})

if(sortValue == "new"){
    filtered.sort((a,b)=>b.price- a.price)
}else if(sortValue == "old"){
    filtered.sort((a,b)=>a.price- b.price)

}
console.log(filtered);

getdata(filtered)
}
$search.addEventListener("keyup",searchandSort)
$sort.addEventListener("change",searchandSort)

lout.addEventListener("click",()=>{
    console.log("working");
    localStorage.removeItem("user")

})