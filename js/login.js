let ism = document.querySelector(".inpName");
let parol = document.querySelector(".inpParol");
let send = document.querySelector("#sendUser");
let closeLoading = document.querySelector(".loading_close");

let modal = document.querySelector(".modal");
let modalTitle = document.querySelector(".modal_title");
let modalText = document.querySelector(".modal-text");
let modalIcon = document.querySelector(".modal-icon");
let modalClose = document.querySelector(".modal-close");

// Toggle password visibility (ko'zcha tugmasi)
let togglePasswordBtn = document.querySelector("#togglePasswordBtn");
let eyeIcon = document.querySelector("#eyeIcon");

if (togglePasswordBtn && parol && eyeIcon) {
    togglePasswordBtn.addEventListener("click", () => {
        let isPassword = parol.type === "password";
        parol.type = isPassword ? "text" : "password";
        eyeIcon.className = isPassword ? "bi bi-eye-fill" : "bi bi-eye-slash";
    });
}

// Kun / Tun (Dark / Light Theme) Rejimi
let themeToggleBtn = document.querySelector("#themeToggleBtn");
let themeIcon = document.querySelector("#themeIcon");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    if (themeIcon) themeIcon.className = "bi bi-sun-fill";
} else if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme");
    if (themeIcon) themeIcon.className = "bi bi-moon-stars-fill";
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        let isDark = document.body.classList.contains("dark-theme");
        if (isDark) {
            document.body.classList.remove("dark-theme");
            document.body.classList.add("light-theme");
            localStorage.setItem("theme", "light");
            if (themeIcon) themeIcon.className = "bi bi-moon-stars-fill";
        } else {
            document.body.classList.remove("light-theme");
            document.body.classList.add("dark-theme");
            localStorage.setItem("theme", "dark");
            if (themeIcon) themeIcon.className = "bi bi-sun-fill";
        }
    });
}

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
        let activeToken = localStorage.getItem("active_admin_session_token");
        let activeAdmin = localStorage.getItem("admin");

        if (activeToken && activeAdmin) {
            showModal("⛔ Kirish taqiqlangan", typeof t === "function" ? t("singleAdminAlert") : "⛔ Diqqat: Tizimda allaqachon boshqa Admin faol! Bitta saytda 2 ta admin yurishi mumkin emas. Oldingi admin chiqish qilishi va sahifani yangilashi lozim.", "error");
            return;
        }

        closeLoading.className = "loading_parent";
        setTimeout(() => {
            closeLoading.className = "loading_close";
            showModal("Xush kelibsiz", "Siz Admin panelga kirdingiz", "admin");
            
            let newToken = "admin-session-" + Date.now();
            localStorage.setItem("active_admin_session_token", newToken);
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

            if (data.accessToken || user.username === "emilys" || user.username === "odiljon") {
                showModal("Tabriklaymiz", "Siz tizimga muvaffaqiyatli kirdingiz", "success");
                localStorage.setItem("user", JSON.stringify(user));
                setTimeout(() => {
                    window.location.href = "../html/index.html";
                }, 1500);
            } else {
                // Fallback login for any username/password entered
                showModal("Tabriklaymiz", `Xush kelibsiz, ${user.username}!`, "success");
                localStorage.setItem("user", JSON.stringify(user));
                setTimeout(() => {
                    window.location.href = "../html/index.html";
                }, 1500);
            }
        })
        .catch(() => {
            closeLoading.className = "loading_close";
            // Local fallback login if API is unreachable
            showModal("Tabriklaymiz", `Xush kelibsiz, ${user.username}!`, "success");
            localStorage.setItem("user", JSON.stringify(user));
            setTimeout(() => {
                window.location.href = "../html/index.html";
            }, 1500);
        });
});