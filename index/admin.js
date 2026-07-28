let savedUser = JSON.parse(localStorage.getItem("admin"))
let allUser = document.querySelector("#container")
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
newDiv.innerHTML  =  `<img src="${i.image}" alt="">
<div class="body">
    <h1>${i.firstName}</h1>
    <p>${i.email}</p>
    <strong>${i.age}</strong>
</div>`
    allUser.appendChild(newDiv)
})

    
}
