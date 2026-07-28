let div = document.querySelector("#container")
fetch("https://dummyjson.com/products")
.then(res=>res.json())
.then(data=>{
    getdata (data.products);
})
function getdata(item){
    item.map(i=>{
        let newDiv = document.createElement("div")
        newDiv.innerHTML=`
         <img src="${i.thumbnail}" alt="">
        <div class="body">
            <h1 class="products_title">${i.title}</h1>
            <p class="products_text">${i.description}</p>
            <strong class="products_price">${i.price}</strong>
        </div>
        `
        div.appendChild(newDiv)
    })
}