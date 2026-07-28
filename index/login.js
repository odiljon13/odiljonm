let ism = document.querySelector(".inpName");
let parol = document.querySelector(".inpParol");
let send = document.querySelector("#sendUser");
let closeLoading = document.querySelector(".loading_close");

let modal = document.querySelector(".modal");
let modalTitle = document.querySelector(".modal_title");
let modalText = document.querySelector(".modal-text");
let modalIcon = document.querySelector(".modal-icon");
let modalClose = document.querySelector(".modal-close");

function showModal(title, text, type = "error") {
    modalTitle.textContent = title;
    modalText.textContent = text;

    modalIcon.classList.remove("success", "error", "admin");
    modalIcon.classList.add(type);
    modalIcon.textContent = type === "success" ? "✓" : type === "admin" ? "★" : "!";

    modal.classList.add("active");
}

function hideModal() {
    modal.classList.remove("active");
}

modalClose.addEventListener("click", hideModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) hideModal();
});

send.addEventListener("click", (e) => {
    e.preventDefault();

    let user = {
        username: ism.value.toLowerCase().trim(),
        password: parol.value.trim(),
    };

    if (!user.username || !user.password) {
        showModal("Xatolik", "Iltimos barcha maydonlarni to'ldiring", "error");
        return;
    }

    if (user.username === "odiljon" && user.password === "odiljon13") {
        closeLoading.className = "loading_parent";
        setTimeout(() => {
            closeLoading.className = "loading_close";
            showModal("Xush kelibsiz", "Siz Admin panelga kirdingiz", "admin");
            localStorage.setItem("admin", JSON.stringify(user));
            setTimeout(() => {
                window.location.href = "../html/admin.html";
            }, 1500);
        }, 800);
        return;
    }

    closeLoading.className = "loading_parent";

    fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: user.username,
            password: user.password,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            closeLoading.className = "loading_close";

            if (data.accessToken) {
                showModal("Tabriklaymiz", "Siz tizimga muvaffaqiyatli kirdingiz", "success");
                localStorage.setItem("user", JSON.stringify(user));
                setTimeout(() => {
                    window.location.href = "../html/index.html";
                }, 1500);
            } else {
                showModal("Xatolik", "Login yoki parol noto'g'ri kiritildi", "error");
            }
        })
        .catch(() => {
            closeLoading.className = "loading_close";
            showModal("Xatolik", "Server bilan bog'lanishda muammo yuz berdi", "error");
        });
});