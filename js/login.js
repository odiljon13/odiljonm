let ism =  document.querySelector(".inpName")

let parol =  document.querySelector(".inpParol")
let send =  document.querySelector("#sendUser")
send.addEventListener("click",(e)=>{
e.preventDefault()
let user = {
    username:ism.value.toLowerCase().trim(),
    password:parol.value.trim(),
}
console.log(user);
fetch('https://dummyjson.com/auth/login',{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify(user)
})
.then(res=>res.json())
.then(data=>{
    if(data.accessToken){
        alert("Siz tizimga kirdingiz")
        localStorage.setItem("user",JSON.stringify(user))
       setTimeout(()=>{
        window.location.href = "../html/index.html"
       },1500)
    }
    else if(user.username.toLowerCase().trim() === "odiljon".toLowerCase().trim() && user.password === "odiljon13"){
        localStorage.setItem("admin",JSON.stringify(user))

    window.location.href = "../html/admin.html"

    }

    else{
        alert("Qanday dur xatolik bor")
    }
})
})