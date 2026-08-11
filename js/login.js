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

            if (data.accessToken || (user.username === "emilys" && user.password === "emilyspass") || (user.username === "odiljon" && user.password === "odiljon13")) {
                showModal("Tabriklaymiz", "Siz tizimga muvaffaqiyatli kirdingiz", "success");
                localStorage.setItem("user", JSON.stringify(user));
                setTimeout(() => {
                    window.location.href = "../html/index.html";
                }, 1500);
            } else {
                showModal("Xatolik", "Login yoki parol noto'g'ri kiritildi!", "error");
            }
        })
        .catch(() => {
            closeLoading.className = "loading_close";
            showModal("Xatolik", "Tarmoq bilan aloqa yo'q yoki server xatoligi!", "error");
        });
});

// ===== NEW AUTHENTICATION LOGIC =====

let tabLogin = document.getElementById("tabLogin");
let tabRegister = document.getElementById("tabRegister");
let loginForm = document.getElementById("loginForm");
let registerForm = document.getElementById("registerForm");
let authTitle = document.getElementById("authTitle");
let authSubtitle = document.getElementById("authSubtitle");

if (tabLogin && tabRegister) {
    tabLogin.addEventListener("click", () => {
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
        loginForm.style.display = "flex";
        registerForm.style.display = "none";
        authTitle.textContent = "Xush kelibsiz!";
        authSubtitle.textContent = "Hisobingizga kiring";
    });

    tabRegister.addEventListener("click", () => {
        tabRegister.classList.add("active");
        tabLogin.classList.remove("active");
        registerForm.style.display = "flex";
        loginForm.style.display = "none";
        authTitle.textContent = "Ro'yxatdan o'tish";
        authSubtitle.textContent = "Yangi hisob yarating";
    });
}

// Toggle password for register
let toggleRegPasswordBtn = document.querySelector("#toggleRegPasswordBtn");
let regPass = document.querySelector("#regPass");
let eyeRegIcon = document.querySelector("#eyeRegIcon");

if (toggleRegPasswordBtn && regPass && eyeRegIcon) {
    toggleRegPasswordBtn.addEventListener("click", () => {
        let isPassword = regPass.type === "password";
        regPass.type = isPassword ? "text" : "password";
        eyeRegIcon.className = isPassword ? "bi bi-eye-fill" : "bi bi-eye-slash";
    });
}

// Register Logic
let sendRegister = document.getElementById("sendRegister");
if (sendRegister) {
    sendRegister.addEventListener("click", (e) => {
        e.preventDefault();
        let regName = document.getElementById("regName").value.trim();
        let regEmail = document.getElementById("regEmail").value.trim();
        let regPassword = regPass.value.trim();

        if (!regName || !regEmail || !regPassword) {
            showModal("Xatolik", "Iltimos, barcha maydonlarni to'ldiring", "error");
            return;
        }

        closeLoading.className = "loading_parent";
        
        setTimeout(() => {
            closeLoading.className = "loading_close";
            let newUser = {
                firstName: regName,
                email: regEmail,
                username: regEmail.split("@")[0],
                avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(regName) + "&background=random"
            };
            
            showModal("Tabriklaymiz", "Muvaffaqiyatli ro'yxatdan o'tdingiz!", "success");
            localStorage.setItem("user", JSON.stringify(newUser));
            
            setTimeout(() => {
                window.location.href = "../html/index.html";
            }, 1500);
        }, 1200);
    });
}

// Social Login Simulation
function simulateSocialLogin(providerName, defaultUser) {
    closeLoading.className = "loading_parent";
    setTimeout(() => {
        closeLoading.className = "loading_close";
        showModal("Tasdiqlandi", `Siz ${providerName} orqali muvaffaqiyatli kirdingiz!`, "success");
        localStorage.setItem("user", JSON.stringify(defaultUser));
        
        setTimeout(() => {
            window.location.href = "../html/index.html";
        }, 1500);
    }, 1500);
}

let googleLoginBtn = document.getElementById("googleLoginBtn");
if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        simulateSocialLogin("Google", {
            firstName: "Odilxon",
            email: "odilxon@gmail.com",
            avatar: "https://lh3.googleusercontent.com/a/ACg8ocIx2GfX25U4bLp1rE2xVv9uH6M2Gv5hD1uX4F0T7bN9=s96-c"
        });
    });
}

let microsoftLoginBtn = document.getElementById("microsoftLoginBtn");
if (microsoftLoginBtn) {
    microsoftLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        simulateSocialLogin("Microsoft", {
            firstName: "Odilxon (MS)",
            email: "odilxon@outlook.com",
            avatar: "https://ui-avatars.com/api/?name=Odilxon+MS&background=00a4ef&color=fff"
        });
    });
}