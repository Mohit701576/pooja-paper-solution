/* =====================================================
   POOJA PAPER SOLUTION
   CUSTOMER WEBSITE - SCRIPT.JS
   SUPABASE VERSION
===================================================== */


/* =====================================================
   SUPABASE CONNECTION
===================================================== */

const SUPABASE_URL =
    "https://dkcrlqdglieywlfjjrbu.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_ejQtonBde30T72gX6hfwjg_U0xsZOUL";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =====================================================
   BACKEND CONNECTION
===================================================== */

const BACKEND_URL =
    "https://pooja-paper-solution-backend.onrender.com";


/* =====================================================
   CUSTOM HTML NOTIFICATION
===================================================== */

let notificationTimer = null;


function showNotification(
    message,
    type = "success",
    title = ""
) {

    const notification =
        document.getElementById(
            "customNotification"
        );

    const icon =
        document.getElementById(
            "customNotificationIcon"
        );

    const notificationTitle =
        document.getElementById(
            "customNotificationTitle"
        );

    const notificationMessage =
        document.getElementById(
            "customNotificationMessage"
        );


    if (
        !notification ||
        !icon ||
        !notificationTitle ||
        !notificationMessage
    ) {

        console.warn(
            "Custom notification HTML not found."
        );

        return;

    }


    /* =================================================
       CLEAR OLD TIMER
    ================================================= */

    if (notificationTimer) {

        clearTimeout(
            notificationTimer
        );

    }


    /* =================================================
       REMOVE OLD TYPES
    ================================================= */

    notification.classList.remove(
        "error",
        "warning",
        "info",
        "show"
    );


    /* =================================================
       SET TYPE
    ================================================= */

    if (type === "error") {

        icon.textContent = "✕";

        notification.classList.add(
            "error"
        );

        notificationTitle.textContent =
            title || "Error";

    }

    else if (type === "warning") {

        icon.textContent = "⚠";

        notification.classList.add(
            "warning"
        );

        notificationTitle.textContent =
            title || "Warning";

    }

    else if (type === "info") {

        icon.textContent = "ℹ";

        notification.classList.add(
            "info"
        );

        notificationTitle.textContent =
            title || "Information";

    }

    else {

        icon.textContent = "✓";

        notificationTitle.textContent =
            title || "Success";

    }


    /* =================================================
       MESSAGE
    ================================================= */

    notificationMessage.textContent =
        message;


    /* =================================================
       SHOW
    ================================================= */

    requestAnimationFrame(
        function () {

            notification.classList.add(
                "show"
            );

        }
    );


    /* =================================================
       AUTO HIDE
    ================================================= */

    notificationTimer =
        setTimeout(
            function () {

                hideNotification();

            },
            3500
        );

}


/* =====================================================
   HIDE NOTIFICATION
===================================================== */

function hideNotification() {

    const notification =
        document.getElementById(
            "customNotification"
        );

    if (!notification) {
        return;
    }

    notification.classList.remove(
        "show"
    );

}

/* =====================================================
   REPLACE ALL NATIVE ALERTS
   CHROME ALERT WILL NOT APPEAR
===================================================== */

window.alert = function (message) {

    let text = String(message || "");

    let type = "success";
    let title = "Success";

    if (
        text.toLowerCase().includes("error") ||
        text.toLowerCase().includes("unable") ||
        text.toLowerCase().includes("could not") ||
        text.toLowerCase().includes("failed") ||
        text.toLowerCase().includes("wrong") ||
        text.toLowerCase().includes("invalid") ||
        text.toLowerCase().includes("not available") ||
        text.toLowerCase().includes("out of stock")
    ) {

        type = "error";
        title = "Error";

    }

    else if (
        text.toLowerCase().includes("please") ||
        text.toLowerCase().includes("only") ||
        text.toLowerCase().includes("empty") ||
        text.toLowerCase().includes("cannot") ||
        text.toLowerCase().includes("no longer") ||
        text.toLowerCase().includes("expired")
    ) {

        type = "warning";
        title = "Notice";

    }

    else if (
        text.toLowerCase().includes("login")
    ) {

        type = "info";
        title = "Login Required";

    }

    showNotification(
        text.replace(/\n+/g, " "),
        type,
        title
    );

};

/* =====================================================
   FORGOT PASSWORD TOKEN
===================================================== */

let forgotPasswordResetToken = null;


/* =====================================================
   PRODUCT DATA
===================================================== */

let products = [];


/* =====================================================
   LOCAL STORAGE
===================================================== */

const CART_KEY =
    "Pooja Paper Solution Cart";

const LOGGED_USER_KEY =
    "Pooja Paper Solution LoggedUser";


/* =====================================================
   CART
===================================================== */

let cart = [];


/* =====================================================
   LOAD CART
===================================================== */

function loadCart() {

    try {

        const savedCart =
            localStorage.getItem(
                CART_KEY
            );

        if (savedCart) {

            cart =
                JSON.parse(
                    savedCart
                );

        } else {

            cart = [];

        }

    } catch (error) {

        console.error(
            "Cart loading error:",
            error
        );

        cart = [];

    }

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


/* =====================================================
   UPDATE CART COUNT
===================================================== */

function updateCartCount() {

    const quantity =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );


    /* ================================================
       DESKTOP CART COUNT
    ================================================ */

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    if (cartCount) {

        cartCount.textContent =
            quantity;

    }


    /* ================================================
       MOBILE CART COUNT
    ================================================ */

    const mobileCartCount =
        document.getElementById(
            "mobileCartCount"
        );

    if (mobileCartCount) {

        mobileCartCount.textContent =
            quantity;

    }

}

/* =====================================================
   FORGOT PASSWORD
===================================================== */

function showForgotPassword() {

    const modal =
        document.getElementById(
            "forgotPasswordModal"
        );

    const loginEmail =
        document.getElementById(
            "loginEmail"
        );

    const forgotEmail =
        document.getElementById(
            "forgotPasswordEmail"
        );

    if (!modal) {

        console.error(
            "Forgot Password modal not found."
        );

        return;
    }

    if (
        loginEmail &&
        forgotEmail &&
        loginEmail.value.trim()
    ) {

        forgotEmail.value =
            loginEmail.value.trim();

    }

    modal.style.display =
        "flex";

    setTimeout(
        function () {

            if (forgotEmail) {
                forgotEmail.focus();
            }

        },
        100
    );

}


/* =====================================================
   CLOSE FORGOT PASSWORD
===================================================== */

function closeForgotPassword() {

    const modal =
        document.getElementById(
            "forgotPasswordModal"
        );

    if (modal) {

        modal.style.display =
            "none";

    }

}


/* =====================================================
   COMPATIBILITY CLOSE FUNCTION
===================================================== */

function closeForgotPasswordModal() {

    closeForgotPassword();

}


/* =====================================================
   VERIFY FORGOT PASSWORD
   EMAIL + PHONE
===================================================== */

async function verifyForgotPassword(event) {

    event.preventDefault();

    const emailInput =
        document.getElementById(
            "forgotPasswordEmail"
        );

    const phoneInput =
        document.getElementById(
            "forgotPasswordPhone"
        );

    const submitButton =
        document.querySelector(
            "#forgotPasswordForm .forgot-submit-btn"
        );

    if (!emailInput) {

        alert(
            "Email field is missing."
        );

        return;

    }

    if (!phoneInput) {

        alert(
            "Phone number field is missing."
        );

        return;

    }

    const email =
        emailInput.value
            .trim()
            .toLowerCase();

    const phone =
        phoneInput.value.trim();

    if (!email) {

        alert(
            "Please enter your registered email address."
        );

        emailInput.focus();

        return;

    }

    if (!phone) {

        alert(
            "Please enter your registered phone number."
        );

        phoneInput.focus();

        return;

    }

    try {

        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Verifying...";

        }

        const response =
            await fetch(
                `${BACKEND_URL}/api/auth/forgot-password/verify`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        phone: phone
                    })
                }
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Email and phone number could not be verified."
            );

        }

        forgotPasswordResetToken =
            result.resetToken;

        closeForgotPassword();

        showNewPasswordPopup();

    } catch (error) {

        console.error(
            "VERIFY FORGOT PASSWORD ERROR:",
            error
        );

        alert(
            error.message ||
            "Email and phone number do not match our records."
        );

    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Continue";

        }

    }

}


/* =====================================================
   NEW PASSWORD POPUP
===================================================== */

function showNewPasswordPopup() {

    const modal =
        document.getElementById(
            "newPasswordModal"
        );

    if (!modal) {

        console.error(
            "New Password modal not found."
        );

        alert(
            "New Password popup is not available yet."
        );

        return;

    }

    modal.style.display =
        "flex";

    const passwordInput =
        document.getElementById(
            "newPassword"
        );

    const confirmPasswordInput =
        document.getElementById(
            "confirmNewPassword"
        );

    if (passwordInput) {
        passwordInput.value = "";
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.value = "";
    }

    setTimeout(
        function () {

            if (passwordInput) {
                passwordInput.focus();
            }

        },
        100
    );

}


/* =====================================================
   CLOSE NEW PASSWORD POPUP
===================================================== */

function closeNewPasswordPopup() {

    const modal =
        document.getElementById(
            "newPasswordModal"
        );

    if (modal) {

        modal.style.display =
            "none";

    }

}


/* =====================================================
   COMPATIBILITY CLOSE FUNCTION
===================================================== */

function closeNewPasswordModal() {

    closeNewPasswordPopup();

}


/* =====================================================
   RESET PASSWORD
===================================================== */

async function resetForgotPassword(event) {

    event.preventDefault();

    const passwordInput =
        document.getElementById(
            "newPassword"
        );

    const confirmPasswordInput =
        document.getElementById(
            "confirmNewPassword"
        );

    const submitButton =
        document.getElementById(
            "resetPasswordBtn"
        );

    if (
        !passwordInput ||
        !confirmPasswordInput
    ) {

        alert(
            "Password fields are missing."
        );

        return;

    }

    const newPassword =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;

    if (!newPassword) {

        alert(
            "Please enter your new password."
        );

        passwordInput.focus();

        return;

    }

    if (
        newPassword.length < 6
    ) {

        alert(
            "Password must be at least 6 characters."
        );

        passwordInput.focus();

        return;

    }

    if (!confirmPassword) {

        alert(
            "Please confirm your new password."
        );

        confirmPasswordInput.focus();

        return;

    }

    if (
        newPassword !==
        confirmPassword
    ) {

        alert(
            "New password and confirm password do not match."
        );

        confirmPasswordInput.focus();

        return;

    }

    if (!forgotPasswordResetToken) {

        alert(
            "Password reset session has expired. Please try again."
        );

        closeNewPasswordPopup();

        return;

    }

    try {

        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Resetting...";

        }

        const response =
            await fetch(
                `${BACKEND_URL}/api/auth/forgot-password/reset`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        resetToken:
                            forgotPasswordResetToken,

                        newPassword:
                            newPassword

                    })
                }
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Password could not be reset."
            );

        }

        alert(
            "Password reset successfully. Please login with your new password."
        );

        forgotPasswordResetToken =
            null;

        closeNewPasswordPopup();

        const form =
            document.getElementById(
                "newPasswordForm"
            );

        if (form) {
            form.reset();
        }

        const loginPassword =
            document.getElementById(
                "loginPassword"
            );

        if (loginPassword) {
            loginPassword.value = "";
        }

        showLogin();

    } catch (error) {

        console.error(
            "RESET PASSWORD ERROR:",
            error
        );

        alert(
            error.message ||
            "Password could not be reset."
        );

    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Reset Password";

        }

    }

}


/* =====================================================
   OLD FUNCTION COMPATIBILITY
===================================================== */

async function resetPassword(event) {

    return resetForgotPassword(event);

}


/* =====================================================
   LOAD PRODUCTS FROM SUPABASE
===================================================== */

async function loadProducts() {

    const container =
        document.getElementById(
            "productContainer"
        );

    if (container) {

        container.innerHTML = `

            <div class="no-products">

                ⏳ Loading products...

            </div>

        `;

    }

    try {

        const {
            data,
            error
        } =
            await supabaseClient

                .from("products")

                .select(`
                    id,
                    name,
                    pack,
                    price,
                    icon,
                    image_url,
                    stock,
                    is_active
                `)

                .eq(
                    "is_active",
                    true
                )

                .order(
                    "id",
                    {
                        ascending: true
                    }
                );

        if (error) {

            console.error(
                "Products loading error:",
                error
            );

            products = [];

            if (container) {

                container.innerHTML = `

                    <div class="no-products">

                        ⚠️ Unable to load products.

                    </div>

                `;

            }

            return;

        }

        products =
            data || [];

        products =
            products.filter(
                product =>
                    product.is_active === true
            );

        displayProducts(
            products
        );

        cleanCartAgainstProducts();

    } catch (error) {

        console.error(
            "LOAD PRODUCTS ERROR:",
            error
        );

        products = [];

        if (container) {

            container.innerHTML = `

                <div class="no-products">

                    ⚠️ Unable to load products.

                </div>

            `;

        }

    }

}


/* =====================================================
   CLEAN CART AGAINST PRODUCTS
===================================================== */

function cleanCartAgainstProducts() {

    if (!cart.length) {
        return;
    }

    const validProductIds =
        products.map(
            product =>
                Number(product.id)
        );

    cart =
        cart.filter(
            item =>
                validProductIds.includes(
                    Number(item.id)
                )
        );

    saveCart();

    updateCartCount();

}


/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function displayProducts(
    productList = products
) {

    const container =
        document.getElementById(
            "productContainer"
        );

    if (!container) {
        return;
    }

    if (!productList.length) {

        container.innerHTML = `

            <div class="no-products">

                No products available.

            </div>

        `;

        return;

    }

    container.innerHTML =
        productList.map(
            product => {

                const stock =
                    Number(
                        product.stock || 0
                    );

                const outOfStock =
                    stock <= 0;

                let productVisual =
                    "";

                if (
                    product.image_url &&
                    product.image_url.trim()
                ) {

                    productVisual = `

                        <img
                            src="${escapeHtml(
                                product.image_url
                            )}"
                            alt="${escapeHtml(
                                product.name
                            )}"
                            class="product-image"
                            onerror="
                                this.style.display='none';
                                this.nextElementSibling.style.display='flex';
                            "
                        >

                        <div
                            class="product-icon"
                            style="display:none;"
                        >
                            ${
                                product.icon ||
                                "📦"
                            }
                        </div>

                    `;

                } else {

                    productVisual = `

                        <div class="product-icon">

                            ${
                                product.icon ||
                                "📦"
                            }

                        </div>

                    `;

                }

                return `

                    <div
                        class="product-card ${
                            outOfStock
                                ? "product-out-of-stock"
                                : ""
                        }"
                    >

                        <div class="product-visual">

                            ${productVisual}

                        </div>

                        <h3>

                            ${escapeHtml(
                                product.name
                            )}

                        </h3>

                        <p>

                            ${escapeHtml(
                                product.pack || ""
                            )}

                        </p>

                        <div class="product-price">

                            ₹${Number(
                                product.price || 0
                            )}

                        </div>

                        ${
                            outOfStock
                                ? `
                                    <div class="out-of-stock">
                                        ❌ Out of Stock
                                    </div>
                                `
                                : `
                                    <div class="stock-available">
                                        ✅ Available
                                    </div>
                                `
                        }

                        ${
                            outOfStock
                                ? `
                                    <button
                                        class="add-to-cart-btn"
                                        disabled
                                    >
                                        Out of Stock
                                    </button>
                                `
                                : `
                                    <button
                                        class="add-to-cart-btn"
                                        onclick="addToCart(${Number(
                                            product.id
                                        )})"
                                    >
                                        🛒 Add to Cart
                                    </button>
                                `
                        }

                    </div>

                `;

            }
        ).join("");

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(productId) {

    const numericProductId =
        Number(productId);

    const product =
        products.find(
            item =>
                Number(item.id) ===
                numericProductId
        );

    if (!product) {

        alert(
            "Product is no longer available."
        );

        return;

    }

    if (
        product.is_active !== true
    ) {

        alert(
            "This product is currently unavailable."
        );

        loadProducts();

        return;

    }

    const stock =
        Number(
            product.stock || 0
        );

    if (stock <= 0) {

        alert(
            "This product is out of stock."
        );

        return;

    }

    const existing =
        cart.find(
            item =>
                Number(item.id) ===
                numericProductId
        );

    if (existing) {

        if (
            existing.quantity >=
            stock
        ) {

            alert(
                `Only ${stock} item(s) available in stock.`
            );

            return;

        }

        existing.quantity++;

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            pack:
                product.pack,

            price:
                Number(product.price),

            icon:
                product.icon || "📦",

            image_url:
                product.image_url || "",

            quantity:
                1

        });

    }

    saveCart();

    updateCartCount();

    renderCart();

    showNotification(
    `${product.name} added to cart.`,
    "success",
    "Added to Cart"
);

}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    const modal =
        document.getElementById(
            "cartModal"
        );

    if (!modal) {
        return;
    }

    renderCart();

    modal.classList.add(
        "active"
    );

}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    const modal =
        document.getElementById(
            "cartModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "active"
    );

}


/* =====================================================
   CALCULATE CART TOTALS
===================================================== */

function calculateCartTotals() {

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );

    /* =================================================
       DELIVERY CHARGE IS ALWAYS FREE
    ================================================= */

    const deliveryCharge = 0;

    const total =
        subtotal +
        deliveryCharge;

    return {

        subtotal:
            subtotal,

        deliveryCharge:
            deliveryCharge,

        total:
            total

    };

}

/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );

    if (!container) {
        return;
    }

    if (!cart.length) {

        container.innerHTML = `

            <div class="empty-cart">

                Your cart is empty.

            </div>

        `;

        setCartPrice(
            "cartSubtotal",
            0
        );

        setCartPrice(
            "cartDelivery",
            0
        );

        setCartPrice(
            "cartTotal",
            0
        );

        return;

    }

    container.innerHTML =
        cart.map(
            item => `

                <div class="cart-item">

                    <div class="cart-item-info">

                        <div class="cart-item-icon">

                            ${
                                item.icon ||
                                "📦"
                            }

                        </div>

                        <div>

                            <h4>

                                ${escapeHtml(
                                    item.name
                                )}

                            </h4>

                            <p>

                                ${escapeHtml(
                                    item.pack || ""
                                )}

                            </p>

                            <strong>

                                ₹${Number(
                                    item.price
                                )}

                            </strong>

                        </div>

                    </div>

                    <div class="cart-controls">

                        <button
                            type="button"
                            onclick="decreaseQuantity(${Number(
                                item.id
                            )})"
                        >
                            −
                        </button>

                        <span>

                            ${item.quantity}

                        </span>

                        <button
                            type="button"
                            onclick="increaseQuantity(${Number(
                                item.id
                            )})"
                        >
                            +
                        </button>

                        <button
                            type="button"
                            onclick="removeFromCart(${Number(
                                item.id
                            )})"
                        >
                            🗑️
                        </button>

                    </div>

                </div>

            `
        ).join("");

    const totals =
        calculateCartTotals();

    setCartPrice(
        "cartSubtotal",
        totals.subtotal
    );

    setCartPrice(
        "cartDelivery",
        totals.deliveryCharge
    );

    setCartPrice(
        "cartTotal",
        totals.total
    );

}


/* =====================================================
   CART PRICE
===================================================== */

function setCartPrice(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return;
    }

    element.textContent =
        `₹${value}`;

}


/* =====================================================
   INCREASE QUANTITY
===================================================== */

function increaseQuantity(productId) {

    const numericProductId =
        Number(productId);

    const item =
        cart.find(
            item =>
                Number(item.id) ===
                numericProductId
        );

    if (!item) {
        return;
    }

    const product =
        products.find(
            product =>
                Number(product.id) ===
                numericProductId
        );

    if (
        !product ||
        product.is_active !== true
    ) {

        alert(
            "This product is no longer available."
        );

        removeFromCart(
            numericProductId
        );

        loadProducts();

        return;

    }

    const stock =
        Number(
            product.stock || 0
        );

    if (stock <= 0) {

        alert(
            "This product is out of stock."
        );

        removeFromCart(
            numericProductId
        );

        loadProducts();

        return;

    }

    if (
        item.quantity >=
        stock
    ) {

        alert(
            `Only ${stock} item(s) available in stock.`
        );

        return;

    }

    item.quantity++;

    saveCart();

    updateCartCount();

    renderCart();

}


/* =====================================================
   DECREASE QUANTITY
===================================================== */

function decreaseQuantity(productId) {

    const numericProductId =
        Number(productId);

    const item =
        cart.find(
            item =>
                Number(item.id) ===
                numericProductId
        );

    if (!item) {
        return;
    }

    item.quantity--;

    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(
                item =>
                    Number(item.id) !==
                    numericProductId
            );

    }

    saveCart();

    updateCartCount();

    renderCart();

}


/* =====================================================
   REMOVE FROM CART
===================================================== */

function removeFromCart(productId) {

    const numericProductId =
        Number(productId);

    cart =
        cart.filter(
            item =>
                Number(item.id) !==
                numericProductId
        );

    saveCart();

    updateCartCount();

    renderCart();

}


/* =====================================================
   AUTH MODAL
===================================================== */

function openAuthModal() {

    const modal =
        document.getElementById(
            "authModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.add(
        "active"
    );

    showLogin();

}


/* =====================================================
   CLOSE AUTH MODAL
===================================================== */

function closeAuthModal() {

    const modal =
        document.getElementById(
            "authModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "active"
    );

}


/* =====================================================
   SHOW LOGIN
===================================================== */

function showLogin() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    const title =
        document.getElementById(
            "authTitle"
        );

    if (loginForm) {

        loginForm.style.display =
            "block";

    }

    if (registerForm) {

        registerForm.style.display =
            "none";

    }

    if (title) {

        title.textContent =
            "Login";

    }

}


/* =====================================================
   SHOW REGISTER
===================================================== */

function showRegister() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    const title =
        document.getElementById(
            "authTitle"
        );

    if (loginForm) {

        loginForm.style.display =
            "none";

    }

    if (registerForm) {

        registerForm.style.display =
            "block";

    }

    if (title) {

        title.textContent =
            "Create Account";

    }

}


/* =====================================================
   REGISTER USER
===================================================== */

async function registerUser(event) {

    event.preventDefault();

    const name =
        document.getElementById(
            "registerName"
        )?.value.trim();

    const phone =
        document.getElementById(
            "registerPhone"
        )?.value.trim();

    const email =
        document.getElementById(
            "registerEmail"
        )?.value.trim()
        .toLowerCase();

    const password =
        document.getElementById(
            "registerPassword"
        )?.value;

    if (
        !name ||
        !phone ||
        !email ||
        !password
    ) {

        alert(
            "Please fill all fields."
        );

        return;

    }

    if (
        password.length < 6
    ) {

        alert(
            "Password must contain at least 6 characters."
        );

        return;

    }

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.signUp({

                email:
                    email,

                password:
                    password,

                options: {

                    data: {

                        full_name:
                            name,

                        phone:
                            phone

                    }

                }

            });

        if (error) {

            console.error(
                "Registration error:",
                error
            );

            if (
                error.message
                    .toLowerCase()
                    .includes("already")
            ) {

                alert(
                    "You have already registered. Please login."
                );

            } else {

                alert(
                    error.message
                );

            }

            return;

        }

        if (!data.user) {

            alert(
                "Registration failed."
            );

            return;

        }

        alert(
            "Registration successful. Please login."
        );

        showLogin();

        const emailInput =
            document.getElementById(
                "loginEmail"
            );

        if (emailInput) {

            emailInput.value =
                email;

        }

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        alert(
            "Something went wrong during registration."
        );

    }

}


/* =====================================================
   LOGIN USER
===================================================== */

async function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById(
            "loginEmail"
        )?.value.trim()
        .toLowerCase();

    const password =
        document.getElementById(
            "loginPassword"
        )?.value;

    if (
        !email ||
        !password
    ) {

        alert(
            "Please enter email and password."
        );

        return;

    }

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .signInWithPassword({

                    email:
                        email,

                    password:
                        password

                });

        if (error) {

            console.error(
                "Login error:",
                error
            );

            alert(
                error.message
            );

            return;

        }

        if (!data.user) {

            alert(
                "Login failed."
            );

            return;

        }

        let profile =
            null;

        const {
            data: profileData,
            error: profileError
        } =
            await supabaseClient

                .from("profiles")

                .select(
                    "id, full_name, phone, role"
                )

                .eq(
                    "id",
                    data.user.id
                )

                .maybeSingle();

        if (!profileError) {

            profile =
                profileData;

        }

        const loggedUser = {

            id:
                data.user.id,

            name:
                profile?.full_name ||
                data.user.user_metadata?.full_name ||
                "",

            email:
                data.user.email,

            phone:
                profile?.phone ||
                data.user.user_metadata?.phone ||
                "",

            role:
                profile?.role ||
                "customer"

        };

        localStorage.setItem(
            LOGGED_USER_KEY,
            JSON.stringify(
                loggedUser
            )
        );

        updateProfileVisibility();

        updateAuthArea();

        updateMyOrdersVisibility();

        closeAuthModal();

        showNotification(
    `Welcome ${loggedUser.name || "Customer"}!`,
    "success",
    "Welcome"
);

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        alert(
            "Something went wrong during login."
        );

    }

}


/* =====================================================
   GET LOGGED USER
===================================================== */

function getLoggedUser() {

    try {

        const saved =
            localStorage.getItem(
                LOGGED_USER_KEY
            );

        if (!saved) {
            return null;
        }

        return JSON.parse(
            saved
        );

    } catch (error) {

        console.error(
            "GET LOGGED USER ERROR:",
            error
        );

        return null;

    }

}


/* =====================================================
   LOGOUT
===================================================== */

async function logoutUser() {

    try {

        const {
            error
        } =
            await supabaseClient.auth.signOut();

        if (error) {

            console.error(
                "Supabase logout error:",
                error
            );

        }

        localStorage.removeItem(
            LOGGED_USER_KEY
        );

        /* =============================================
           CLEAR CURRENT PAGE
        ============================================= */

        sessionStorage.removeItem(
            "poojaCurrentPage"
        );

        updateAuthArea();

        updateProfileVisibility();

        updateMyOrdersVisibility();

        closeProfile();

        showNormalPage(
            null,
            "home"
        );

showNotification(
    "You have been logged out successfully.",
    "success",
    "Logged Out"
);

        window.scrollTo({

            top:
                0,

            behavior:
                "smooth"

        });

    } catch (error) {

        console.error(
            "LOGOUT ERROR:",
            error
        );

        localStorage.removeItem(
            LOGGED_USER_KEY
        );

        sessionStorage.removeItem(
            "poojaCurrentPage"
        );

        updateAuthArea();

        updateProfileVisibility();

        updateMyOrdersVisibility();

        closeProfile();

        showNormalPage(
            null,
            "home"
        );

    }

}

/* =====================================================
   UPDATE MOBILE NAVBAR
===================================================== */

function updateMobileNavbar() {

    const user =
        getLoggedUser();


    const greeting =
        document.getElementById(
            "mobileUserGreeting"
        );

    const loginItem =
        document.getElementById(
            "mobileLoginItem"
        );

    const logoutItem =
        document.getElementById(
            "mobileLogoutItem"
        );


    /* =================================================
       LOGGED IN
    ================================================= */

    if (user && user.id) {

        if (greeting) {

            greeting.textContent =
                `Hi ${user.name || "Customer"}`;

            greeting.style.display =
                "block";

        }


        if (loginItem) {

            loginItem.style.display =
                "none";

        }


        if (logoutItem) {

            logoutItem.style.display =
                "block";

        }

    }


    /* =================================================
       LOGGED OUT
    ================================================= */

    else {

        if (greeting) {

            greeting.textContent =
                "";

            greeting.style.display =
                "none";

        }


        if (loginItem) {

            loginItem.style.display =
                "block";

        }


        if (logoutItem) {

            logoutItem.style.display =
                "none";

        }

    }

}

/* =====================================================
   AUTH AREA
===================================================== */

function updateAuthArea() {

    const authArea =
        document.getElementById(
            "authArea"
        );

    if (!authArea) {
        return;
    }

    const user =
        getLoggedUser();

    if (user) {

        authArea.innerHTML = `

            <div class="logged-user-area">

                <span class="user-greeting">

                    Hi, ${escapeHtml(
                        user.name ||
                        "Customer"
                    )}

                </span>

                <button
                    type="button"
                    class="login-btn"
                    onclick="logoutUser()"
                >

                    Logout

                </button>

            </div>

        `;

    } else {

        authArea.innerHTML = `

            <button
                type="button"
                class="login-btn"
                onclick="openAuthModal()"
            >

                Login

            </button>

        `;

    }

    updateMobileNavbar();

}


/* =====================================================
   PROFILE VISIBILITY
   ONLY AFTER LOGIN
===================================================== */

function updateProfileVisibility() {

    const profileNavItem =
        document.getElementById(
            "profileNavItem"
        );

    const user =
        getLoggedUser();

    if (!profileNavItem) {
        return;
    }

    if (
        user &&
        user.id
    ) {

        profileNavItem.style.display =
            "block";

    } else {

        profileNavItem.style.display =
            "none";

    }

}


/* =====================================================
   SHOW PROFILE
===================================================== */

function showProfile() {

    const user =
        getLoggedUser();

    if (
        !user ||
        !user.id
    ) {

        alert(
            "Please login first."
        );

        openAuthModal();

        return;

    }

    const modal =
        document.getElementById(
            "profileModal"
        );

    if (!modal) {

        alert(
            "Profile popup is not available."
        );

        return;

    }

    const nameInput =
        document.getElementById(
            "profileName"
        );

    const emailInput =
        document.getElementById(
            "profileEmail"
        );

    const phoneInput =
        document.getElementById(
            "profilePhone"
        );

    if (nameInput) {

        nameInput.value =
            user.name || "";

    }

    if (emailInput) {

        emailInput.value =
            user.email || "";

    }

    if (phoneInput) {

        phoneInput.value =
            user.phone || "";

    }

    modal.style.display =
        "flex";

    closeMobileMenu();

}


/* =====================================================
   CLOSE PROFILE
===================================================== */

function closeProfile() {

    const modal =
        document.getElementById(
            "profileModal"
        );

    if (modal) {

        modal.style.display =
            "none";

    }

}


/* =====================================================
   UPDATE PROFILE
===================================================== */

async function updateProfile(event) {

    event.preventDefault();

    const user =
        getLoggedUser();

    if (
        !user ||
        !user.id
    ) {

        alert(
            "Please login first."
        );

        return;

    }

    const nameInput =
        document.getElementById(
            "profileName"
        );

    const emailInput =
        document.getElementById(
            "profileEmail"
        );

    const phoneInput =
        document.getElementById(
            "profilePhone"
        );

    const saveButton =
        document.getElementById(
            "profileSaveBtn"
        );

    const name =
        nameInput?.value.trim();

    const email =
        emailInput?.value.trim()
            .toLowerCase();

    const phone =
        phoneInput?.value.trim();

    if (
        !name ||
        !email ||
        !phone
    ) {

        alert(
            "Please fill all profile fields."
        );

        return;

    }

    try {

        if (saveButton) {

            saveButton.disabled =
                true;

            saveButton.textContent =
                "Saving...";

        }

        const {
            error: profileError
        } =
            await supabaseClient

                .from("profiles")

                .update({

                    full_name:
                        name,

                    phone:
                        phone

                })

                .eq(
                    "id",
                    user.id
                );

        if (profileError) {

            console.error(
                "Profile update error:",
                profileError
            );

            throw new Error(
                "Name and phone number could not be updated."
            );

        }

        let emailChanged =
            email !==
            String(
                user.email || ""
            )
                .trim()
                .toLowerCase();

        if (emailChanged) {

            const {
                error: emailError
            } =
                await supabaseClient.auth.updateUser({

                    email:
                        email

                });

            if (emailError) {

                console.error(
                    "Email update error:",
                    emailError
                );

                throw new Error(
                    emailError.message
                );

            }

        }

        const updatedUser = {

            id:
                user.id,

            name:
                name,

            email:
                email,

            phone:
                phone,

            role:
                user.role ||
                "customer"

        };

        localStorage.setItem(

            LOGGED_USER_KEY,

            JSON.stringify(
                updatedUser
            )

        );

        updateAuthArea();

        updateProfileVisibility();

        closeProfile();

        if (emailChanged) {

            alert(
                "Profile updated successfully.\n\nIf Supabase email confirmation is enabled, please confirm your new email address from your inbox."
            );

        } else {

            alert(
                "Profile updated successfully."
            );

        }

    } catch (error) {

        console.error(
            "UPDATE PROFILE ERROR:",
            error
        );

        alert(
            error.message ||
            "Profile could not be updated."
        );

    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "💾 Save Changes";

        }

    }

}


/* =====================================================
   MY ORDERS VISIBILITY
   FIXED PAGE STATE
===================================================== */

function updateMyOrdersVisibility() {

    const navLink =
        document.getElementById(
            "myOrdersNavLink"
        );

    const section =
        document.getElementById(
            "my-orders"
        );

    const user =
        getLoggedUser();

    const currentPage =
        sessionStorage.getItem(
            "poojaCurrentPage"
        );


    /* =================================================
       NAV LINK
    ================================================= */

    if (navLink) {

        if (
            user &&
            user.id
        ) {

            navLink.style.display =
                "inline-block";

        } else {

            navLink.style.display =
                "none";

        }

    }


    /* =================================================
       SECTION
    ================================================= */

    if (!section) {
        return;
    }


    /* =================================================
       NOT LOGGED IN
    ================================================= */

    if (
        !user ||
        !user.id
    ) {

        section.style.display =
            "none";

        return;

    }


    /* =================================================
       MY ORDERS IS CURRENT PAGE
    ================================================= */

    if (
        currentPage ===
        "my-orders"
    ) {

        section.style.display =
            "block";

    } else {

        section.style.display =
            "none";

    }

}


/* =====================================================
   MY ORDERS PAGE
===================================================== */

function showMyOrdersPage(event) {

    if (event) {

        event.preventDefault();

    }

    const user =
        getLoggedUser();

    if (
        !user ||
        !user.id
    ) {

        alert(
            "Please login to view your orders."
        );

        openAuthModal();

        return;

    }


    /* =================================================
       SAVE CURRENT PAGE
    ================================================= */

    sessionStorage.setItem(
        "poojaCurrentPage",
        "my-orders"
    );


    /* =================================================
       HIDE ALL NORMAL SECTIONS
    ================================================= */

    const sections =
        document.querySelectorAll(
            "body > section"
        );

    sections.forEach(
        section => {

            section.style.display =
                "none";

        }
    );


    /* =================================================
       SHOW MY ORDERS
    ================================================= */

    const myOrdersSection =
        document.getElementById(
            "my-orders"
        );

    if (myOrdersSection) {

        myOrdersSection.style.display =
            "block";

        myOrdersSection.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }


    /* =================================================
       LOAD ORDERS
    ================================================= */

    loadMyOrders();

    closeMobileMenu();

}


/* =====================================================
   NORMAL WEBSITE VIEW
   FIXED PAGE STATE
===================================================== */

function showNormalPage(
    event,
    targetId
) {

    if (event) {

        event.preventDefault();

    }


    /* =================================================
       SAVE CURRENT NORMAL PAGE
    ================================================= */

    sessionStorage.setItem(
        "poojaCurrentPage",
        targetId
    );


    /* =================================================
       SHOW NORMAL SECTIONS
    ================================================= */

    const sections =
        document.querySelectorAll(
            "body > section"
        );

    sections.forEach(
        section => {

            if (
                section.id ===
                "my-orders"
            ) {

                section.style.display =
                    "none";

            } else {

                section.style.display =
                    "";

            }

        }
    );


    /* =================================================
       SCROLL TARGET
    ================================================= */

    const target =
        document.getElementById(
            targetId
        );

    if (target) {

        target.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }

    closeMobileMenu();

}


/* =====================================================
   GO TO ADMIN LOGIN
===================================================== */

function goToAdminLogin() {

    window.location.href =
        "admin/login.html";

}


/* =====================================================
   CHECKOUT
===================================================== */

function checkout() {

    if (!cart.length) {

        alert(
            "Your cart is empty."
        );

        return;

    }

    const user =
        getLoggedUser();

    if (!user) {

        alert(
            "Please login before checkout."
        );

        openAuthModal();

        return;

    }

    closeCart();

    fillCheckoutUser();

    renderCheckoutSummary();

    const modal =
        document.getElementById(
            "checkoutModal"
        );

    if (modal) {

        modal.classList.add(
            "active"
        );

    }

}


/* =====================================================
   FILL CHECKOUT USER
===================================================== */

function fillCheckoutUser() {

    const user =
        getLoggedUser();

    if (!user) {
        return;
    }

    const nameInput =
        document.getElementById(
            "checkoutName"
        );

    const phoneInput =
        document.getElementById(
            "checkoutPhone"
        );

    if (nameInput) {

        nameInput.value =
            user.name || "";

    }

    if (phoneInput) {

        phoneInput.value =
            user.phone || "";

    }

}


/* =====================================================
   CHECKOUT SUMMARY
===================================================== */

function renderCheckoutSummary() {

    const container =
        document.getElementById(
            "checkoutItems"
        );

    if (!container) {
        return;
    }

    const totals =
        calculateCartTotals();

    container.innerHTML =
        cart.map(
            item => `

                <div class="checkout-item">

                    <span>

                        ${escapeHtml(
                            item.name
                        )}

                        × ${item.quantity}

                    </span>

                    <strong>

                        ₹${
                            Number(item.price) *
                            Number(item.quantity)
                        }

                    </strong>

                </div>

            `
        ).join("");

    const subtotal =
        document.getElementById(
            "checkoutSubtotal"
        );

    const delivery =
        document.getElementById(
            "checkoutDelivery"
        );

    const total =
        document.getElementById(
            "checkoutTotal"
        );

    if (subtotal) {

        subtotal.textContent =
            `₹${totals.subtotal}`;

    }

    if (delivery) {

        delivery.textContent =
            totals.deliveryCharge === 0
                ? "FREE"
                : `₹${totals.deliveryCharge}`;

    }

    if (total) {

        total.textContent =
            `₹${totals.total}`;

    }

}


/* =====================================================
   CLOSE CHECKOUT
===================================================== */

function closeCheckout() {

    const modal =
        document.getElementById(
            "checkoutModal"
        );

    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


/* =====================================================
   GET CURRENT SUPABASE USER
===================================================== */

async function getCurrentSupabaseUser() {

    const {
        data,
        error
    } =
        await supabaseClient.auth.getUser();

    if (error) {

        console.error(
            "User error:",
            error
        );

        return null;

    }

    return data.user || null;

}


/* =====================================================
   GENERATE ORDER NUMBER
===================================================== */

function generateOrderNumber() {

    const year =
        new Date().getFullYear();

    const random =
        Math.floor(
            10000 +
            Math.random() * 90000
        );

    return `PPS-${year}-${random}`;

}


/* =====================================================
   VERIFY CART BEFORE ORDER
===================================================== */

async function verifyCartBeforeOrder() {

    try {

        if (!cart.length) {
            return false;
        }

        const {
            data,
            error
        } =
            await supabaseClient

                .from("products")

                .select(`
                    id,
                    name,
                    pack,
                    price,
                    icon,
                    image_url,
                    stock,
                    is_active
                `)

                .in(
                    "id",
                    cart.map(
                        item =>
                            Number(item.id)
                    )
                );

        if (error) {

            console.error(
                "Cart verification error:",
                error
            );

            return false;

        }

        const latestProducts =
            data || [];

        for (
            const item of cart
        ) {

            const product =
                latestProducts.find(
                    product =>
                        Number(product.id) ===
                        Number(item.id)
                );

            if (
                !product ||
                product.is_active !== true
            ) {

                alert(
                    `${item.name} is no longer available.`
                );

                return false;

            }

            const stock =
                Number(
                    product.stock || 0
                );

            if (stock <= 0) {

                alert(
                    `${item.name} is out of stock.`
                );

                return false;

            }

            if (
                Number(item.quantity) >
                stock
            ) {

                alert(
                    `Only ${stock} item(s) of ${item.name} are available.`
                );

                return false;

            }

        }

        return true;

    } catch (error) {

        console.error(
            "VERIFY CART ERROR:",
            error
        );

        return false;

    }

}


/* =====================================================
   PLACE ORDER
===================================================== */

async function placeOrder() {

    if (!cart.length) {

        alert(
            "Your cart is empty."
        );

        return;

    }

    const cartValid =
        await verifyCartBeforeOrder();

    if (!cartValid) {

        await loadProducts();

        return;

    }

    const authUser =
        await getCurrentSupabaseUser();

    if (!authUser) {

        alert(
            "Please login first."
        );

        closeCheckout();

        openAuthModal();

        return;

    }

    const name =
        document.getElementById(
            "checkoutName"
        )?.value.trim();

    const phone =
        document.getElementById(
            "checkoutPhone"
        )?.value.trim();

    const addressLine =
        document.getElementById(
            "checkoutAddress"
        )?.value.trim();

    const city =
        document.getElementById(
            "checkoutCity"
        )?.value.trim();

    const state =
        document.getElementById(
            "checkoutState"
        )?.value.trim();

    const pincode =
        document.getElementById(
            "checkoutPincode"
        )?.value.trim();

    if (
        !name ||
        !phone ||
        !addressLine ||
        !city ||
        !state ||
        !pincode
    ) {

        alert(
            "Please fill all delivery details."
        );

        return;

    }

    if (
        pincode.length !== 6
    ) {

        alert(
            "Please enter a valid 6 digit pincode."
        );

        return;

    }

    const totals =
        calculateCartTotals();

    const button =
        document.querySelector(
            "#checkoutModal .primary-btn.full-btn"
        );

    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Placing Order...";

    }

    try {

        /* =============================================
           STEP 1 - ADDRESS
        ============================================= */

        const {
            data: addressData,
            error: addressError
        } =
            await supabaseClient

                .from("addresses")

                .insert({

                    user_id:
                        authUser.id,

                    address_line:
                        addressLine,

                    city:
                        city,

                    state:
                        state,

                    pincode:
                        pincode

                })

                .select()

                .single();

        if (addressError) {

            console.error(
                "Address Error:",
                addressError
            );

            throw new Error(
                "Address could not be saved."
            );

        }

        /* =============================================
           STEP 2 - ORDER
        ============================================= */

        const orderNo =
            generateOrderNumber();

        const {
            data: orderData,
            error: orderError
        } =
            await supabaseClient

                .from("orders")

                .insert({

                    order_no:
                        orderNo,

                    customer_id:
                        authUser.id,

                    address_id:
                        addressData.id,

                    subtotal:
                        totals.subtotal,

                    delivery_charge:
                        totals.deliveryCharge,

                    total:
                        totals.total,

                    payment_method:
                        "COD",

                    status:
                        "pending",

                    admin_accepted:
                        false,

                    bill_generated:
                        false,

                    otp_verified:
                        false

                })

                .select()

                .single();

        if (orderError) {

            console.error(
                "Order Error:",
                orderError
            );

            throw new Error(
                "Order could not be created."
            );

        }

        /* =============================================
           STEP 3 - ORDER ITEMS
        ============================================= */

        const orderItems =
            cart.map(
                item => ({

                    order_id:
                        orderData.id,

                    product_id:
                        item.id,

                    product_name:
                        item.name,

                    pack:
                        item.pack,

                    price:
                        item.price,

                    quantity:
                        item.quantity,

                    line_total:
                        Number(item.price) *
                        Number(item.quantity)

                })
            );

        const {
            error: itemError
        } =
            await supabaseClient

                .from("order_items")

                .insert(
                    orderItems
                );

        if (itemError) {

            console.error(
                "Order Items Error:",
                itemError
            );

            throw new Error(
                "Order items could not be saved."
            );

        }

        /* =============================================
           STEP 4 - SAVE USER
        ============================================= */

        const currentUser =
            getLoggedUser();

        localStorage.setItem(

            LOGGED_USER_KEY,

            JSON.stringify({

                id:
                    authUser.id,

                name:
                    name,

                email:
                    authUser.email,

                phone:
                    phone,

                role:
                    currentUser?.role ||
                    "customer"

            })

        );

        /* =============================================
           STEP 5 - CLEAR CART
        ============================================= */

        cart = [];

        saveCart();

        updateCartCount();

        renderCart();

        /* =============================================
           STEP 6 - CLOSE CHECKOUT
        ============================================= */

        closeCheckout();

        /* =============================================
           STEP 7 - SUCCESS
        ============================================= */

        showOrderSuccess(
            orderNo
        );

        /* =============================================
           STEP 8 - LOAD ORDERS
        ============================================= */

        await loadMyOrders();

        await loadProducts();

    } catch (error) {

        console.error(
            "PLACE ORDER ERROR:",
            error
        );

        alert(
            error.message ||
            "Order could not be placed."
        );

    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "✅ Place Order";

        }

    }

}


/* =====================================================
   ORDER SUCCESS
===================================================== */

function showOrderSuccess(orderNo) {

    const modal =
        document.getElementById(
            "orderSuccessModal"
        );

    const orderId =
        document.getElementById(
            "successOrderId"
        );

    if (orderId) {

        orderId.textContent =
            orderNo;

    }

    if (modal) {

        modal.classList.add(
            "active"
        );

    } else {

        alert(
            `Order placed successfully!\nOrder ID: ${orderNo}`
        );

    }

}


/* =====================================================
   CLOSE ORDER SUCCESS
===================================================== */

function closeOrderSuccess() {

    const modal =
        document.getElementById(
            "orderSuccessModal"
        );

    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

    showMyOrdersPage();

}


/* =====================================================
   LOAD MY ORDERS
===================================================== */

async function loadMyOrders() {

    const user =
        getLoggedUser();

    const container =
        document.getElementById(
            "myOrdersContainer"
        );

    if (!container) {
        return;
    }


    /* =================================================
       MAKE SURE MY ORDERS REMAINS VISIBLE
       ONLY WHEN IT IS THE CURRENT PAGE
    ================================================= */

    const myOrdersSection =
        document.getElementById(
            "my-orders"
        );

    const currentPage =
        sessionStorage.getItem(
            "poojaCurrentPage"
        );

    if (
        currentPage ===
        "my-orders"
    ) {

        if (myOrdersSection) {

            myOrdersSection.style.display =
                "block";

        }

    }


    /* =================================================
       LOGIN CHECK
    ================================================= */

    if (
        !user ||
        !user.id
    ) {

        container.innerHTML = `

            <div class="empty-orders">

                <div class="empty-orders-icon">
                    🔐
                </div>

                <h3>
                    Please Login
                </h3>

                <p>
                    Login to view your orders.
                </p>

            </div>

        `;

        return;

    }

    container.innerHTML = `

        <div class="orders-loading">

            ⏳ Loading your orders...

        </div>

    `;

    try {

        const {
            data: orders,
            error: ordersError
        } =
            await supabaseClient

                .from("orders")

                .select(`
                    id,
                    order_no,
                    subtotal,
                    delivery_charge,
                    total,
                    payment_method,
                    status,
                    admin_accepted,
                    bill_generated,
                    otp_verified,
                    created_at,
                    accepted_at,
                    completed_at,
                    rejection_reason,
                    cancelled_reason,
                    rejected_at,
                    cancelled_at
                `)

                .eq(
                    "customer_id",
                    user.id
                )

                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );

        if (ordersError) {

            console.error(
                "My Orders Error:",
                ordersError
            );

            throw ordersError;

        }

        if (
            !orders ||
            !orders.length
        ) {

            container.innerHTML = `

                <div class="empty-orders">

                    <div class="empty-orders-icon">
                        📦
                    </div>

                    <h3>
                        No Orders Yet
                    </h3>

                    <p>
                        You have not placed any orders yet.
                    </p>

                    <button
                        type="button"
                        class="primary-btn"
                        onclick="showNormalPage(null, 'products')"
                    >
                        🛍️ Shop Products
                    </button>

                </div>

            `;

            return;

        }

        let ordersHtml =
            "";

        for (
            const order of orders
        ) {

            let items =
                [];

            const {
                data: itemData,
                error: itemError
            } =
                await supabaseClient

                    .from("order_items")

                    .select(`
                        product_name,
                        pack,
                        price,
                        quantity,
                        line_total
                    `)

                    .eq(
                        "order_id",
                        order.id
                    )

                    .order(
                        "id",
                        {
                            ascending: true
                        }
                    );

            if (itemError) {

                console.error(
                    "Order Items Error:",
                    itemError
                );

            } else {

                items =
                    itemData || [];

            }

            ordersHtml +=
                createOrderCard(
                    order,
                    items
                );

        }

        container.innerHTML =
            ordersHtml;

    } catch (error) {

        console.error(
            "LOAD MY ORDERS ERROR:",
            error
        );

        container.innerHTML = `

            <div class="empty-orders">

                <div class="empty-orders-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to Load Orders
                </h3>

                <p>
                    Please try again.
                </p>

                <button
                    type="button"
                    class="primary-btn"
                    onclick="loadMyOrders()"
                >
                    🔄 Try Again
                </button>

            </div>

        `;

    }

}


/* =====================================================
   CREATE ORDER CARD
===================================================== */

function createOrderCard(
    order,
    items
) {

    const statusInfo =
        getOrderStatusInfo(
            order.status
        );

    const date =
        formatOrderDate(
            order.created_at
        );

    const itemsHtml =
        items.length

            ? items.map(
                item => `

                    <div class="my-order-item">

                        <div class="my-order-product">

                            <div class="my-order-product-icon">
                                📦
                            </div>

                            <div>

                                <strong>
                                    ${escapeHtml(
                                        item.product_name
                                    )}
                                </strong>

                                <small>
                                    ${escapeHtml(
                                        item.pack || ""
                                    )}
                                </small>

                            </div>

                        </div>

                        <div class="my-order-quantity">
                            × ${item.quantity}
                        </div>

                        <div class="my-order-item-price">
                            ₹${item.line_total}
                        </div>

                    </div>

                `
            ).join("")

            : `

                <div class="my-order-item">

                    <div>
                        Order items unavailable
                    </div>

                </div>

            `;


    /* =================================================
       REJECTION / CANCELLATION
    ================================================= */

    let reasonHtml =
        "";

    if (
        order.status ===
        "rejected"
    ) {

        reasonHtml = `

            <div class="order-reason-box rejected-reason">

                <div class="order-reason-title">
                    ❌ Order Rejected
                </div>

                <div class="order-reason-text">

                    <strong>
                        Reason:
                    </strong>

                    ${escapeHtml(
                        order.rejection_reason ||
                        "No reason provided."
                    )}

                </div>

            </div>

        `;

    }

    if (
        order.status ===
        "cancelled"
    ) {

        reasonHtml = `

            <div class="order-reason-box cancelled-reason">

                <div class="order-reason-title">
                    🚫 Order Cancelled
                </div>

                <div class="order-reason-text">

                    <strong>
                        Reason:
                    </strong>

                    ${escapeHtml(
                        order.cancelled_reason ||
                        "No reason provided."
                    )}

                </div>

            </div>

        `;

    }


    /* =================================================
       CANCEL BUTTON
    ================================================= */

    let actionHtml =
        "";

    if (
        order.status ===
        "pending"
    ) {

        actionHtml = `

            <div class="my-order-actions">

                <button
                    class="cancel-order-btn"
                    onclick="cancelOrder('${order.id}')"
                    type="button"
                >

                    <span class="cancel-icon">
                        ×
                    </span>

                    <span>
                        Cancel Order
                    </span>

                </button>

            </div>

        `;

    }


    /* =================================================
       BILL BUTTONS
    ================================================= */

    let billActionHtml =
        "";

    if (
        order.bill_generated === true
    ) {

        billActionHtml = `

            <div class="my-order-bill-actions">

                <button
                    type="button"
                    class="customer-view-bill-btn"
                    onclick="viewCustomerBill('${order.id}', this)"
                >

                    📄 View Bill

                </button>

                <button
                    type="button"
                    class="customer-download-bill-btn"
                    onclick="downloadCustomerBill('${order.id}', this)"
                >

                    ⬇️ Download Bill

                </button>

            </div>

        `;

    }


    return `

        <div class="my-order-card">

            <div class="my-order-header">

                <div class="my-order-header-left">

                    <span class="my-order-label">
                        ORDER ID
                    </span>

                    <strong class="my-order-number">

                        ${escapeHtml(
                            order.order_no
                        )}

                    </strong>

                    <span class="my-order-date">

                        📅 ${date}

                    </span>

                </div>

                <div
                    class="order-status ${statusInfo.className}"
                >

                    ${statusInfo.icon}

                    ${statusInfo.label}

                </div>

            </div>

            <div class="my-order-items-section">

                <div class="my-order-section-title">
                    🛍️ Ordered Items
                </div>

                <div class="my-order-items">

                    ${itemsHtml}

                </div>

            </div>

            <div class="my-order-summary">

                <div class="my-order-price-row">

                    <span>
                        Subtotal
                    </span>

                    <strong>
                        ₹${order.subtotal}
                    </strong>

                </div>

                <div class="my-order-price-row">

                    <span>
                        Delivery
                    </span>

                    <strong>

                        ${
                            Number(
                                order.delivery_charge
                            ) === 0
                                ? "FREE"
                                : `₹${order.delivery_charge}`
                        }

                    </strong>

                </div>

                <div
                    class="my-order-price-row my-order-total"
                >

                    <span>
                        Total
                    </span>

                    <strong>
                        ₹${order.total}
                    </strong>

                </div>

            </div>

            <div class="my-order-payment">

                💳 Payment:

                <strong>

                    ${escapeHtml(
                        order.payment_method ||
                        "COD"
                    )}

                </strong>

            </div>

            <div class="order-tracker">

                ${createOrderTracker(
                    order.status
                )}

            </div>

            <div class="order-status-message">

                ${getOrderStatusMessage(
                    order.status
                )}

            </div>

            ${reasonHtml}

            ${actionHtml}

            ${billActionHtml}

        </div>

    `;

}


/* =====================================================
   CUSTOMER VIEW BILL
===================================================== */

async function viewCustomerBill(
    orderId,
    button
) {

    try {

        if (button) {

            button.disabled =
                true;

            button.textContent =
                "⏳ Opening...";

        }

        const user =
            getLoggedUser();

        if (
            !user ||
            !user.id
        ) {

            alert(
                "Please login first."
            );

            return;

        }

        const {
            data: order,
            error: orderError
        } =
            await supabaseClient

                .from("orders")

                .select(`
                    id,
                    order_no,
                    customer_id,
                    bill_generated
                `)

                .eq(
                    "id",
                    orderId
                )

                .eq(
                    "customer_id",
                    user.id
                )

                .maybeSingle();

        if (orderError) {

            console.error(
                "Customer bill order check error:",
                orderError
            );

            throw new Error(
                "Unable to verify this order."
            );

        }

        if (!order) {

            throw new Error(
                "This bill does not belong to your order."
            );

        }

        if (
            order.bill_generated !== true
        ) {

            throw new Error(
                "Bill has not been generated yet."
            );

        }

        const response =
            await fetch(
                `${BACKEND_URL}/api/customer/bill/${encodeURIComponent(orderId)}`
            );

        if (!response.ok) {

            throw new Error(
                "Bill could not be loaded."
            );

        }

        const result =
            await response.json();

        if (
            !result ||
            !result.pdfUrl
        ) {

            throw new Error(
                "Bill PDF is not available yet."
            );

        }

        window.open(
            result.pdfUrl,
            "_blank",
            "noopener,noreferrer"
        );

    } catch (error) {

        console.error(
            "VIEW CUSTOMER BILL ERROR:",
            error
        );

        alert(
            error.message ||
            "Bill could not be opened."
        );

    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "📄 View Bill";

        }

    }

}


/* =====================================================
   CUSTOMER DOWNLOAD BILL
===================================================== */

async function downloadCustomerBill(
    orderId,
    button
) {

    try {

        if (button) {

            button.disabled =
                true;

            button.textContent =
                "⏳ Downloading...";

        }

        const user =
            getLoggedUser();

        if (
            !user ||
            !user.id
        ) {

            alert(
                "Please login first."
            );

            return;

        }

        const {
            data: order,
            error: orderError
        } =
            await supabaseClient

                .from("orders")

                .select(`
                    id,
                    order_no,
                    customer_id,
                    bill_generated
                `)

                .eq(
                    "id",
                    orderId
                )

                .eq(
                    "customer_id",
                    user.id
                )

                .maybeSingle();

        if (orderError) {

            console.error(
                "Customer download order check error:",
                orderError
            );

            throw new Error(
                "Unable to verify this order."
            );

        }

        if (!order) {

            throw new Error(
                "This bill does not belong to your order."
            );

        }

        if (
            order.bill_generated !== true
        ) {

            throw new Error(
                "Bill has not been generated yet."
            );

        }

        const response =
            await fetch(
                `${BACKEND_URL}/api/customer/bill/${encodeURIComponent(orderId)}`
            );

        if (!response.ok) {

            throw new Error(
                "Bill could not be loaded."
            );

        }

        const result =
            await response.json();

        if (
            !result ||
            !result.pdfUrl
        ) {

            throw new Error(
                "Bill PDF is not available yet."
            );

        }

        const link =
            document.createElement(
                "a"
            );

        link.href =
            result.pdfUrl;

        link.target =
            "_blank";

        link.rel =
            "noopener";

        link.download =
            `PPS-Bill-${order.order_no || order.id}.pdf`;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

    } catch (error) {

        console.error(
            "DOWNLOAD CUSTOMER BILL ERROR:",
            error
        );

        alert(
            error.message ||
            "Bill could not be downloaded."
        );

    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "⬇️ Download Bill";

        }

    }

}

/* =====================================================
   CUSTOM CANCEL REASON POPUP
===================================================== */

let cancelReasonResolver = null;
let cancelConfirmResolver = null;


/* =====================================================
   SHOW CANCEL REASON POPUP
===================================================== */

function showCancelReasonPopup() {

    return new Promise(function (resolve) {

        cancelReasonResolver = resolve;

        const modal =
            document.getElementById(
                "cancelReasonModal"
            );

        const input =
            document.getElementById(
                "cancelReasonInput"
            );

        if (!modal) {

            resolve(null);

            return;

        }

        if (input) {

            input.value = "";

        }

        modal.classList.add("show");

        setTimeout(function () {

            if (input) {

                input.focus();

            }

        }, 100);

    });

}


/* =====================================================
   SUBMIT CANCEL REASON
===================================================== */

function submitCancelReason() {

    const input =
        document.getElementById(
            "cancelReasonInput"
        );

    const reason =
        input
            ? input.value.trim()
            : "";

    if (!reason) {

        showNotification(
            "Please enter a cancellation reason.",
            "warning",
            "Reason Required"
        );

        if (input) {

            input.focus();

        }

        return;

    }

    closeCancelReasonPopup(
        reason
    );

}


/* =====================================================
   CLOSE CANCEL REASON POPUP
===================================================== */

function closeCancelReasonPopup(
    result
) {

    const modal =
        document.getElementById(
            "cancelReasonModal"
        );

    if (modal) {

        modal.classList.remove("show");

    }

    if (cancelReasonResolver) {

        const resolve =
            cancelReasonResolver;

        cancelReasonResolver = null;

        resolve(result);

    }

}


/* =====================================================
   SHOW CANCEL CONFIRMATION
===================================================== */

function showCancelConfirmPopup(
    reason
) {

    return new Promise(function (resolve) {

        cancelConfirmResolver = resolve;

        const modal =
            document.getElementById(
                "cancelConfirmModal"
            );

        const reasonBox =
            document.getElementById(
                "cancelConfirmReason"
            );

        if (!modal) {

            resolve(false);

            return;

        }

        if (reasonBox) {

            reasonBox.textContent =
                "Reason: " + reason;

        }

        modal.classList.add("show");

    });

}


/* =====================================================
   CLOSE CANCEL CONFIRMATION
===================================================== */

function closeCancelConfirmPopup(
    result
) {

    const modal =
        document.getElementById(
            "cancelConfirmModal"
        );

    if (modal) {

        modal.classList.remove("show");

    }

    if (cancelConfirmResolver) {

        const resolve =
            cancelConfirmResolver;

        cancelConfirmResolver = null;

        resolve(result);

    }

}

/* =====================================================
   CANCEL ORDER
   CUSTOM HTML POPUP VERSION
===================================================== */

async function cancelOrder(orderId) {

    const user = getLoggedUser();

    if (!user || !user.id) {

        alert(
            "Please login first."
        );

        return;

    }

    /* =================================================
       ASK CANCELLATION REASON
    ================================================= */

    const reason = await showCancelReasonPopup();

    if (reason === null) {
        return;
    }

    if (reason.trim() === "") {

        alert(
            "Please enter a cancellation reason."
        );

        return;

    }

    /* =================================================
       CUSTOM CONFIRMATION
    ================================================= */

    const confirmed =
        await showCancelConfirmPopup(
            reason.trim()
        );

    if (!confirmed) {
        return;
    }

    try {

        const {
            data,
            error
        } =
            await supabaseClient

                .from("orders")

                .update({

                    status:
                        "cancelled",

                    cancelled_reason:
                        reason.trim(),

                    cancelled_at:
                        new Date().toISOString()

                })

                .eq(
                    "id",
                    orderId
                )

                .eq(
                    "customer_id",
                    user.id
                )

                .eq(
                    "status",
                    "pending"
                )

                .select()
                .maybeSingle();

        if (error) {

            console.error(
                "Cancel Order Error:",
                error
            );

            alert(
                "Order could not be cancelled.\n\n" +
                error.message
            );

            return;

        }

        if (!data) {

            alert(
                "This order can no longer be cancelled. It may already have been accepted or updated."
            );

            await loadMyOrders();

            return;

        }

        alert(
            "🚫 Order cancelled successfully."
        );

        await loadMyOrders();

    }

    catch (error) {

        console.error(
            "CANCEL ORDER ERROR:",
            error
        );

        alert(
            "Something went wrong while cancelling the order.\n\n" +
            error.message
        );

    }

}

/* =====================================================
   ORDER STATUS INFO
===================================================== */

function getOrderStatusInfo(status) {

    const statusMap = {

        pending: {

            label:
                "Pending",

            icon:
                "⏳",

            className:
                "status-pending"

        },

        accepted: {

            label:
                "Accepted",

            icon:
                "✅",

            className:
                "status-accepted"

        },

        bill_generated: {

            label:
                "Bill Generated",

            icon:
                "🧾",

            className:
                "status-bill"

        },

        assigned: {

            label:
                "Delivery Assigned",

            icon:
                "👤",

            className:
                "status-assigned"

        },

        out_for_delivery: {

            label:
                "Out for Delivery",

            icon:
                "🚚",

            className:
                "status-delivery"

        },

        completed: {

            label:
                "Completed",

            icon:
                "🎉",

            className:
                "status-completed"

        },

        cancelled: {

            label:
                "Cancelled",

            icon:
                "❌",

            className:
                "status-cancelled"

        },

        rejected: {

            label:
                "Rejected",

            icon:
                "🚫",

            className:
                "status-rejected"

        }

    };

    return (

        statusMap[status]

        ||

        {

            label:
                status ||
                "Unknown",

            icon:
                "ℹ️",

            className:
                "status-unknown"

        }

    );

}


/* =====================================================
   ORDER STATUS MESSAGE
===================================================== */

function getOrderStatusMessage(status) {

    const messages = {

        pending:
            "⏳ Your order is waiting for admin confirmation.",

        accepted:
            "✅ Your order has been accepted by the admin.",

        bill_generated:
            "🧾 Your bill has been generated. Your order is being prepared.",

        assigned:
            "👤 A delivery boy has been assigned to your order.",

        out_for_delivery:
            "🚚 Your order is out for delivery.",

        completed:
            "🎉 Your order has been completed successfully.",

        cancelled:
            "🚫 This order has been cancelled by the customer.",

        rejected:
            "❌ This order was rejected by the admin. Please check the reason below."

    };

    return (

        messages[status]

        ||

        "ℹ️ Order status updated."

    );

}


/* =====================================================
   ORDER TRACKER
===================================================== */

function createOrderTracker(
    currentStatus
) {

    if (
        currentStatus ===
        "rejected"
    ) {

        return `

            <div class="tracker-step tracker-cancelled">

                <div class="tracker-dot">
                    ✓
                </div>

                <span>
                    Placed
                </span>

            </div>

            <div class="tracker-step tracker-cancelled">

                <div class="tracker-dot">
                    ❌
                </div>

                <span>
                    Rejected
                </span>

            </div>

        `;

    }

    if (
        currentStatus ===
        "cancelled"
    ) {

        return `

            <div class="tracker-step tracker-cancelled">

                <div class="tracker-dot">
                    ✓
                </div>

                <span>
                    Placed
                </span>

            </div>

            <div class="tracker-step tracker-cancelled">

                <div class="tracker-dot">
                    ❌
                </div>

                <span>
                    Cancelled
                </span>

            </div>

        `;

    }

    const steps = [

        {
            key:
                "pending",

            label:
                "Placed"
        },

        {
            key:
                "accepted",

            label:
                "Accepted"
        },

        {
            key:
                "bill_generated",

            label:
                "Bill"
        },

        {
            key:
                "assigned",

            label:
                "Assigned"
        },

        {
            key:
                "out_for_delivery",

            label:
                "On Way"
        },

        {
            key:
                "completed",

            label:
                "Completed"
        }

    ];

    const currentIndex =
        steps.findIndex(
            step =>
                step.key ===
                currentStatus
        );

    return steps.map(
        (
            step,
            index
        ) => {

            let className =
                "tracker-step";

            if (
                index <
                currentIndex
            ) {

                className +=
                    " tracker-completed";

            } else if (
                index ===
                currentIndex
            ) {

                className +=
                    " tracker-current";

            }

            return `

                <div
                    class="${className}"
                >

                    <div class="tracker-dot">

                        ${
                            index <
                            currentIndex
                                ? "✓"
                                : index + 1
                        }

                    </div>

                    <span>

                        ${step.label}

                    </span>

                </div>

            `;

        }
    ).join("");

}


/* =====================================================
   FORMAT ORDER DATE
===================================================== */

function formatOrderDate(
    dateString
) {

    if (!dateString) {
        return "-";
    }

    try {

        return new Date(
            dateString
        ).toLocaleString(
            "en-IN",
            {

                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric",

                hour:
                    "2-digit",

                minute:
                    "2-digit"

            }
        );

    } catch (error) {

        return "-";

    }

}


/* =====================================================
   SCROLL TO PRODUCTS
===================================================== */

function scrollToProducts() {

    showNormalPage(
        null,
        "products"
    );

}


/* =====================================================
   MOBILE NAVBAR
===================================================== */

function toggleMenu() {

    const navLinks =
        document.getElementById(
            "navLinks"
        );

    if (!navLinks) {
        return;
    }

    navLinks.classList.toggle(
        "active"
    );

}


/* =====================================================
   CLOSE MOBILE MENU
===================================================== */

function closeMobileMenu() {

    const navLinks =
        document.getElementById(
            "navLinks"
        );

    if (!navLinks) {
        return;
    }

    navLinks.classList.remove(
        "active"
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   NAVBAR CLICK HANDLER
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const links =
            document.querySelectorAll(
                "#navLinks a"
            );

        links.forEach(
            link => {

                link.addEventListener(
                    "click",
                    function (event) {

                        const href =
                            link.getAttribute(
                                "href"
                            );


                        /* =========================================
                           MY ORDERS
                        ========================================= */

                        if (
                            link.id ===
                            "myOrdersNavLink"
                        ) {

                            showMyOrdersPage(
                                event
                            );

                            return;

                        }


                        /* =========================================
                           PROFILE
                        ========================================= */

                        if (
                            link.id ===
                            "profileNavLink"
                        ) {

                            event.preventDefault();

                            showProfile();

                            return;

                        }


                        /* =========================================
                           NORMAL NAVIGATION
                        ========================================= */

                        if (
                            href &&
                            href.startsWith("#")
                        ) {

                            const targetId =
                                href.substring(1);

                            showNormalPage(
                                event,
                                targetId
                            );

                        }

                    }
                );

            }
        );


        /* =====================================================
           RESTORE SAVED PAGE AFTER REFRESH
        ===================================================== */

        const savedPage =
            sessionStorage.getItem(
                "poojaCurrentPage"
            );

        const user =
            getLoggedUser();


        if (
            savedPage ===
            "my-orders" &&
            user &&
            user.id
        ) {

            showMyOrdersPage();

        }

    }
);


/* =====================================================
   MODAL OUTSIDE CLICK
===================================================== */

window.addEventListener(
    "click",
    function (event) {

        const authModal =
            document.getElementById(
                "authModal"
            );

        const cartModal =
            document.getElementById(
                "cartModal"
            );

        const checkoutModal =
            document.getElementById(
                "checkoutModal"
            );

        const successModal =
            document.getElementById(
                "orderSuccessModal"
            );

        const forgotModal =
            document.getElementById(
                "forgotPasswordModal"
            );

        const newPasswordModal =
            document.getElementById(
                "newPasswordModal"
            );

        const profileModal =
            document.getElementById(
                "profileModal"
            );

        if (
            authModal &&
            event.target ===
            authModal
        ) {

            closeAuthModal();

        }

        if (
            cartModal &&
            event.target ===
            cartModal
        ) {

            closeCart();

        }

        if (
            checkoutModal &&
            event.target ===
            checkoutModal
        ) {

            closeCheckout();

        }

        if (
            successModal &&
            event.target ===
            successModal
        ) {

            closeOrderSuccess();

        }

        if (
            forgotModal &&
            event.target ===
            forgotModal
        ) {

            closeForgotPassword();

        }

        if (
            newPasswordModal &&
            event.target ===
            newPasswordModal
        ) {

            closeNewPasswordPopup();

        }

        if (
            profileModal &&
            event.target ===
            profileModal
        ) {

            closeProfile();

        }

    }
);


/* =====================================================
   SUPABASE SESSION
===================================================== */

async function checkSupabaseSession() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();

        if (error) {

            console.error(
                "Session error:",
                error
            );

            return;

        }

        const session =
            data.session;

        if (!session) {

            localStorage.removeItem(
                LOGGED_USER_KEY
            );

            updateAuthArea();

            updateProfileVisibility();

            updateMyOrdersVisibility();

            return;

        }

        const user =
            session.user;

        let profile =
            null;

        const {
            data: profileData,
            error: profileError
        } =
            await supabaseClient

                .from("profiles")

                .select(
                    "id, full_name, phone, role"
                )

                .eq(
                    "id",
                    user.id
                )

                .maybeSingle();

        if (!profileError) {

            profile =
                profileData;

        }

        const loggedUser = {

            id:
                user.id,

            name:
                profile?.full_name ||
                user.user_metadata?.full_name ||
                "",

            email:
                user.email,

            phone:
                profile?.phone ||
                user.user_metadata?.phone ||
                "",

            role:
                profile?.role ||
                "customer"

        };

        localStorage.setItem(

            LOGGED_USER_KEY,

            JSON.stringify(
                loggedUser
            )

        );

        updateAuthArea();

        updateProfileVisibility();

        updateMyOrdersVisibility();


        /* =================================================
           RESTORE MY ORDERS AFTER SESSION CHECK
        ================================================= */

        const savedPage =
            sessionStorage.getItem(
                "poojaCurrentPage"
            );

        if (
            savedPage ===
            "my-orders"
        ) {

            showMyOrdersPage();

        }

    } catch (error) {

        console.error(
            "SESSION CHECK ERROR:",
            error
        );

    }

}

/* =====================================================
   BACK TO TOP
===================================================== */

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


window.addEventListener(
    "scroll",
    function() {

        const backToTopBtn =
            document.getElementById("backToTopBtn");

        if (!backToTopBtn) {
            return;
        }

        if (window.scrollY > 300) {

            backToTopBtn.classList.add("show");

        } else {

            backToTopBtn.classList.remove("show");

        }

    }
);


/* =====================================================
   SUPABASE AUTH STATE CHANGE
===================================================== */

supabaseClient.auth.onAuthStateChange(
    function (
        event,
        session
    ) {

        console.log(
            "Auth event:",
            event
        );

        if (!session) {

            localStorage.removeItem(
                LOGGED_USER_KEY
            );

        }

        updateAuthArea();

        updateProfileVisibility();

        updateMyOrdersVisibility();

    }
);

/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

function togglePassword(inputId, button) {

    const input =
        document.getElementById(inputId);

    /* Input nahi mila to kuch mat karo */
    if (!input) {
        return;
    }

    /* Eye icon find karo */
    const eye =
        button.querySelector(".eye-icon");

    if (!eye) {
        return;
    }


    /* =================================================
       PASSWORD HIDDEN HAI
       → PASSWORD DIKHAO
       → EYE PAR TEDHI LINE LAGAO
    ================================================= */

    if (input.type === "password") {

        input.type = "text";

        eye.classList.add("eye-hidden");

        button.setAttribute(
            "aria-label",
            "Hide password"
        );

        button.setAttribute(
            "title",
            "Hide password"
        );

    }


    /* =================================================
       PASSWORD VISIBLE HAI
       → PASSWORD HIDE KARO
       → TEDHI LINE HATAO
    ================================================= */

    else {

        input.type = "password";

        eye.classList.remove("eye-hidden");

        button.setAttribute(
            "aria-label",
            "Show password"
        );

        button.setAttribute(
            "title",
            "Show password"
        );

    }

}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Pooja Paper Solution started."
        );

        loadCart();

        updateCartCount();

        loadProducts();

        renderCart();

        updateAuthArea();

        updateProfileVisibility();

        updateMyOrdersVisibility();

        checkSupabaseSession();

    }
);

