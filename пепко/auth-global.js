(function () {
    function parseJson(value, fallback) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return fallback;
        }
    }

    function ensureAuthStyles() {
        if (document.getElementById("auth-global-style")) return;

        var style = document.createElement("style");
        style.id = "auth-global-style";
        style.textContent = [
            "#auth-modal .auth-body{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px;}",
            "#auth-modal .auth-col{background:#fff;border:1px solid #eee;border-radius:12px;padding:14px;}",
            "#auth-modal h3{margin:0 0 10px 0;}",
            "#auth-modal input{width:100%;padding:10px;margin:6px 0;border:1px solid #ddd;border-radius:8px;}",
            "#auth-modal .auth-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;}",
            "#auth-modal .auth-summary{font-size:14px;color:#444;line-height:1.5;}",
            "@media (max-width: 800px){#auth-modal .auth-body{grid-template-columns:1fr;}}"
        ].join("");
        document.head.appendChild(style);
    }

    function ensureAuthModal() {
        var modal = document.getElementById("auth-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "auth-modal";
            modal.className = "cart-modal";
            document.body.appendChild(modal);
        }

        if (modal.getAttribute("data-auth-ready") === "1") return;

        modal.innerHTML = [
            '<div class="cart-content" style="max-width:860px;margin:30px auto;">',
            '  <div class="cart-header">',
            '    <h2 id="auth-title" style="margin:0;">Вход</h2>',
            '    <span class="close-cart" onclick="toggleAuth()">&times;</span>',
            '  </div>',
            '  <div class="auth-body">',
            '    <div class="auth-col">',
            '      <h3>Профил</h3>',
            '      <div id="login-form">',
            '        <input id="login-username" type="text" placeholder="Потребителско име">',
            '        <input id="login-password" type="password" placeholder="Парола">',
            '        <div class="auth-row">',
            '          <button class="cta-button" onclick="loginUser()">Вход</button>',
            '          <button class="cta-button" style="background:#777;" onclick="showRegister()">Регистрация</button>',
            '        </div>',
            '      </div>',
            '      <div id="register-form" style="display:none;">',
            '        <input id="reg-username" type="text" placeholder="Потребителско име">',
            '        <input id="reg-password" type="password" placeholder="Парола">',
            '        <div class="auth-row">',
            '          <button class="cta-button" onclick="registerUser()">Създай профил</button>',
            '          <button class="cta-button" style="background:#777;" onclick="showLogin()">Назад</button>',
            '        </div>',
            '      </div>',
            '    </div>',
            '    <div class="auth-col">',
            '      <h3>Вашият акаунт</h3>',
            '      <div id="auth-summary" class="auth-summary"></div>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join("");

        modal.setAttribute("data-auth-ready", "1");
        ensureAuthStyles();
    }

    function updateUserDisplay() {
        var user = localStorage.getItem("currentUser") || "";
        var nameEl = document.getElementById("user-name");
        if (nameEl) nameEl.textContent = user ? user + " " : "";
    }

    function renderSummary() {
        var summary = document.getElementById("auth-summary");
        if (!summary) return;

        var user = localStorage.getItem("currentUser");
        if (!user) {
            summary.innerHTML = "Влезте или се регистрирайте, за да ползвате профила.";
            return;
        }

        var cart = parseJson(localStorage.getItem("cart") || "[]", []);
        var count = cart.reduce(function (sum, item) { return sum + (item.quantity || 0); }, 0);
        var total = cart.reduce(function (sum, item) { return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0); }, 0);

        summary.innerHTML = [
            '<p><strong>Потребител:</strong> ' + user + '</p>',
            '<p><strong>В количката:</strong> ' + count + ' бр.</p>',
            '<p><strong>Сума:</strong> ' + total.toFixed(2) + ' лв</p>',
            '<div class="auth-row">',
            '<a href="profile.html" class="cta-button" style="text-decoration:none;">Моят профил</a>',
            '<button class="cta-button" style="background:#777;" onclick="logoutUser()">Изход</button>',
            '</div>'
        ].join("");
    }

    window.toggleAuth = function () {
        ensureAuthModal();
        var modal = document.getElementById("auth-modal");
        if (!modal) return;
        var opened = modal.style.display === "block";
        modal.style.display = opened ? "none" : "block";
        if (!opened) {
            updateUserDisplay();
            renderSummary();
        }
    };

    if (typeof window.showRegister !== "function") {
        window.showRegister = function () {
            var login = document.getElementById("login-form");
            var register = document.getElementById("register-form");
            var title = document.getElementById("auth-title");
            if (login) login.style.display = "none";
            if (register) register.style.display = "block";
            if (title) title.textContent = "Регистрация";
        };
    }

    if (typeof window.showLogin !== "function") {
        window.showLogin = function () {
            var login = document.getElementById("login-form");
            var register = document.getElementById("register-form");
            var title = document.getElementById("auth-title");
            if (login) login.style.display = "block";
            if (register) register.style.display = "none";
            if (title) title.textContent = "Вход";
        };
    }

    if (typeof window.registerUser !== "function") {
        window.registerUser = function () {
            var u = (document.getElementById("reg-username") || {}).value || "";
            var p = (document.getElementById("reg-password") || {}).value || "";
            u = u.trim();
            p = p.trim();
            if (!u || !p) {
                alert("Попълнете всички полета");
                return;
            }

            var users = parseJson(localStorage.getItem("users") || "{}", {});
            if (users[u]) {
                alert("Потребителят вече съществува");
                return;
            }

            users[u] = p;
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentUser", u);
            updateUserDisplay();
            renderSummary();
            alert("Регистрация успешна");
            showLogin();
        };
    }

    if (typeof window.loginUser !== "function") {
        window.loginUser = function () {
            var u = (document.getElementById("login-username") || {}).value || "";
            var p = (document.getElementById("login-password") || {}).value || "";
            u = u.trim();
            p = p.trim();

            var users = parseJson(localStorage.getItem("users") || "{}", {});
            if (users[u] === p) {
                localStorage.setItem("currentUser", u);
                updateUserDisplay();
                renderSummary();
                alert("Влязохте като " + u);
                return;
            }
            alert("Невалидни данни");
        };
    }

    if (typeof window.logoutUser !== "function") {
        window.logoutUser = function () {
            localStorage.removeItem("currentUser");
            updateUserDisplay();
            renderSummary();
            alert("Излязохте от профила");
        };
    }

    window.recordOrder = function (items) {
        var user = localStorage.getItem("currentUser");
        if (!user || !items || !items.length) return;
        var key = "ordersHistory_" + user;
        var history = parseJson(localStorage.getItem(key) || "[]", []);
        var total = items.reduce(function (sum, item) {
            return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
        }, 0);
        history.unshift({
            createdAt: new Date().toISOString(),
            total: total,
            items: items.map(function (item) {
                return { name: item.name || "Продукт", quantity: Number(item.quantity) || 1, price: Number(item.price) || 0 };
            })
        });
        history = history.slice(0, 30);
        localStorage.setItem(key, JSON.stringify(history));
    };

    function bindAuthIconClick() {
        var icons = document.querySelectorAll(".auth-icon");
        icons.forEach(function (icon) {
            icon.style.cursor = "pointer";
            icon.onclick = window.toggleAuth;
        });
    }

    function closeOnBackdrop() {
        window.addEventListener("click", function (event) {
            var modal = document.getElementById("auth-modal");
            if (modal && event.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    function init() {
        ensureAuthModal();
        bindAuthIconClick();
        closeOnBackdrop();
        updateUserDisplay();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
