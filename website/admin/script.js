/* =====================================================
   POOJA PAPER SOLUTION
   ADMIN PANEL JAVASCRIPT
===================================================== */


/* =====================================================
   SUPABASE
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
   BACKEND URL
===================================================== */

const BACKEND_URL =
    "https://pooja-paper-solution-backend.onrender.com";


/* =====================================================
   CUSTOM NOTIFICATION SYSTEM
   REPLACES BROWSER alert()
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


    /* SAFETY CHECK */

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


    /* CLEAR OLD TIMER */

    if (notificationTimer) {

        clearTimeout(
            notificationTimer
        );

    }


    /* REMOVE OLD TYPES */

    notification.classList.remove(
        "error",
        "warning",
        "info",
        "show"
    );


    const text =
        String(message || "");


    const lowerText =
        text.toLowerCase();


    /* DEFAULT */

    let notificationType =
        type;

    let notificationTitleText =
        title || "Success";


    /* ERROR */

    if (
        lowerText.includes("error") ||
        lowerText.includes("failed") ||
        lowerText.includes("failure") ||
        lowerText.includes("could not") ||
        lowerText.includes("unable") ||
        lowerText.includes("invalid") ||
        lowerText.includes("wrong") ||
        lowerText.includes("exception")
    ) {

        notificationType =
            "error";

        notificationTitleText =
            title || "Error";
    }


    /* WARNING */

    else if (
        lowerText.includes("please") ||
        lowerText.includes("required") ||
        lowerText.includes("cannot") ||
        lowerText.includes("must be") ||
        lowerText.includes("not found") ||
        lowerText.includes("no product") ||
        lowerText.includes("no order") ||
        lowerText.includes("out of stock")
    ) {

        notificationType =
            "warning";

        notificationTitleText =
            title || "Please Check";
    }


    /* SUCCESS */

    if (
        lowerText.includes("welcome")
    ) {

        notificationType =
            "success";

        notificationTitleText =
            "Welcome";
    }


    if (
        lowerText.includes("logged out") ||
        lowerText.includes("logout")
    ) {

        notificationType =
            "success";

        notificationTitleText =
            "Logged Out";
    }


    if (
        lowerText.includes("added to cart")
    ) {

        notificationType =
            "success";

        notificationTitleText =
            "Added to Cart";
    }


    if (
        lowerText.includes("order placed")
    ) {

        notificationType =
            "success";

        notificationTitleText =
            "Order Placed";
    }


    if (
        lowerText.includes("successfully")
    ) {

        notificationType =
            "success";
    }


    /* ICON */

    if (
        notificationType === "error"
    ) {

        icon.textContent = "✕";

        notification.classList.add(
            "error"
        );

    }

    else if (
        notificationType === "warning"
    ) {

        icon.textContent = "⚠";

        notification.classList.add(
            "warning"
        );

    }

    else if (
        notificationType === "info"
    ) {

        icon.textContent = "ℹ";

        notification.classList.add(
            "info"
        );

    }

    else {

        icon.textContent = "✓";

    }


    /* TEXT */

    notificationTitle.textContent =
        notificationTitleText;

    notificationMessage.textContent =
        text;


    /* SHOW */

    requestAnimationFrame(
        function() {

            notification.classList.add(
                "show"
            );

        }
    );


    /* AUTO HIDE */

    notificationTimer =
        setTimeout(
            function() {

                hideNotification();

            },
            4000
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


    if (notificationTimer) {

        clearTimeout(
            notificationTimer
        );

        notificationTimer =
            null;
    }

}



/* =====================================================
   REPLACE NATIVE alert()
===================================================== */

window.alert =
    function(message) {

        showNotification(
            message
        );

    };

/* =====================================================
   CUSTOM ADMIN DIALOG SYSTEM
   REPLACES prompt() / confirm()
===================================================== */

let adminDialogMode = "";

let adminDialogCallback = null;


/* =====================================================
   OPEN INPUT DIALOG
===================================================== */

function openAdminInputDialog(title, message, value, callback, buttonText = "Update") {

    const modal =
        document.getElementById("customAdminDialog");

    const titleElement =
        document.getElementById("customAdminDialogTitle");

    const messageElement =
        document.getElementById("customAdminDialogMessage");

    const input =
        document.getElementById("customAdminDialogInput");

    const button =
        document.getElementById("customAdminDialogConfirmBtn");

    const icon =
        document.getElementById("customAdminDialogIcon");


    if (
        !modal ||
        !titleElement ||
        !messageElement ||
        !input ||
        !button
    ) {

        console.warn(
            "Custom admin dialog HTML not found."
        );

        return;
    }


    adminDialogMode = "input";

    adminDialogCallback = callback;


    titleElement.textContent = title;

    messageElement.textContent = message;


    if (icon) {

        icon.textContent =
            title.toLowerCase().includes("reject")
                ? "❌"
                : "📦";

    }


    input.value = value || "";

    input.type =
        title.toLowerCase().includes("reject")
            ? "text"
            : "number";

    input.style.display = "block";

    input.placeholder =
        title.toLowerCase().includes("reject")
            ? "Enter rejection reason..."
            : "Enter stock";


    button.textContent =
        buttonText;


    modal.style.display = "flex";


    setTimeout(function() {

        input.focus();

        input.select();

    }, 100);

}


/* =====================================================
   OPEN CONFIRM DIALOG
===================================================== */

function openAdminConfirmDialog(
    title,
    message,
    callback
) {

    const modal =
        document.getElementById(
            "customAdminDialog"
        );

    const titleElement =
        document.getElementById(
            "customAdminDialogTitle"
        );

    const messageElement =
        document.getElementById(
            "customAdminDialogMessage"
        );

    const input =
        document.getElementById(
            "customAdminDialogInput"
        );

    const button =
        document.getElementById(
            "customAdminDialogConfirmBtn"
        );

    const icon =
        document.getElementById(
            "customAdminDialogIcon"
        );


    if (
        !modal ||
        !titleElement ||
        !messageElement ||
        !input ||
        !button
    ) {

        console.warn(
            "Custom admin dialog HTML not found."
        );

        return;
    }


    adminDialogMode =
        "confirm";


    adminDialogCallback =
        callback;


    titleElement.textContent =
        title;


    messageElement.textContent =
        message;


    if (icon) {

        icon.textContent =
            "⚠️";

    }


    input.value =
        "";


    input.style.display =
        "none";


    button.textContent =
        "Yes, Continue";


    modal.style.display =
        "flex";

}



/* =====================================================
   CONFIRM CUSTOM DIALOG
===================================================== */

function confirmAdminDialog() {

    const input =
        document.getElementById(
            "customAdminDialogInput"
        );


    let value =
        "";


    if (
        adminDialogMode === "input" &&
        input
    ) {

        value =
            input.value;

    }


    const callback =
        adminDialogCallback;


    closeAdminDialog();


    if (
        typeof callback ===
        "function"
    ) {

        callback(value);

    }

}



/* =====================================================
   CLOSE CUSTOM DIALOG
===================================================== */

function closeAdminDialog() {

    const modal =
        document.getElementById(
            "customAdminDialog"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    adminDialogMode =
        "";


    adminDialogCallback =
        null;

}



/* =====================================================
   CLICK OUTSIDE DIALOG TO CLOSE
===================================================== */

document.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "customAdminDialog"
            );


        if (
            !modal ||
            modal.style.display !==
                "flex"
        ) {

            return;

        }


        if (
            event.target === modal
        ) {

            closeAdminDialog();

        }

    }
);



/* =====================================================
   ESC KEY CLOSE
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        const modal =
            document.getElementById(
                "customAdminDialog"
            );


        if (
            modal &&
            modal.style.display ===
                "flex"
        ) {

            closeAdminDialog();

        }

    }
);

/* =====================================================
   CUSTOMER CANCEL ORDER DIALOG
===================================================== */

let cancelOrderIdForDialog = null;

let cancelOrderReasonForDialog = "";


/* =====================================================
   OPEN CANCEL REASON MODAL
===================================================== */

function openCancelOrderModal(orderId) {

    cancelOrderIdForDialog =
        orderId;

    cancelOrderReasonForDialog =
        "";


    const modal =
        document.getElementById(
            "cancelOrderModal"
        );

    const textarea =
        document.getElementById(
            "cancelOrderReason"
        );


    if (!modal || !textarea) {
        return;
    }


    textarea.value = "";


    modal.style.display =
        "flex";


    setTimeout(
        function() {

            textarea.focus();

        },
        100
    );

}



/* =====================================================
   CLOSE REASON MODAL
===================================================== */

function closeCancelOrderModal() {

    const modal =
        document.getElementById(
            "cancelOrderModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}



/* =====================================================
   SUBMIT REASON
===================================================== */

function submitCancelOrderReason() {

    const textarea =
        document.getElementById(
            "cancelOrderReason"
        );


    if (!textarea) {
        return;
    }


    const reason =
        textarea.value.trim();


    if (!reason) {

        alert(
            "Please enter a cancellation reason."
        );

        textarea.focus();

        return;
    }


    cancelOrderReasonForDialog =
        reason;


    closeCancelOrderModal();


    const confirmModal =
        document.getElementById(
            "cancelConfirmModal"
        );

    const reasonBox =
        document.getElementById(
            "cancelConfirmReason"
        );


    if (!confirmModal) {
        return;
    }


    if (reasonBox) {

        reasonBox.textContent =
            "Reason: " +
            reason;

    }


    confirmModal.style.display =
        "flex";

}



/* =====================================================
   CLOSE CONFIRM MODAL
===================================================== */

function closeCancelConfirmModal() {

    const modal =
        document.getElementById(
            "cancelConfirmModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}



/* =====================================================
   FINAL CANCEL
===================================================== */

async function confirmCancelOrder() {

    const orderId =
        cancelOrderIdForDialog;

    const reason =
        cancelOrderReasonForDialog;


    closeCancelConfirmModal();


    if (!orderId) {

        alert(
            "Order ID not found."
        );

        return;
    }


    if (!reason) {

        alert(
            "Cancellation reason is required."
        );

        return;
    }


    /*
       IMPORTANT:
       Yahan tumhare existing cancelOrder()
       ke backend/database cancellation code
       ko use karna hai.
    */


    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("orders")

            .update({
                status: "cancelled",
                cancellation_reason: reason
            })

            .eq(
                "id",
                orderId
            )

            .select()
            .maybeSingle();


        if (error) {

            console.error(
                "Cancel order error:",
                error
            );


            alert(
                "Order cancellation failed.\n\n" +
                error.message
            );

            return;
        }


        if (!data) {

            alert(
                "Order could not be cancelled."
            );

            return;
        }


        alert(
            "Order cancelled successfully."
        );


        /*
           Existing order reload function
           agar tumhare script me hai to yahan
           automatically use kar sakte ho.
        */

        if (
            typeof loadOrders ===
            "function"
        ) {

            await loadOrders();

        }


        if (
            typeof loadCustomerOrders ===
            "function"
        ) {

            await loadCustomerOrders();

        }


    } catch (error) {

        console.error(
            "Cancel order exception:",
            error
        );


        alert(
            "Something went wrong.\n\n" +
            error.message
        );

    }


    cancelOrderIdForDialog =
        null;

    cancelOrderReasonForDialog =
        "";

}



/* =====================================================
   MAIN CANCEL BUTTON FUNCTION
===================================================== */

function cancelOrder(orderId) {

    openCancelOrderModal(
        orderId
    );

}

/* =====================================================
   GLOBAL DATA
===================================================== */

let allOrders = [];

let selectedOrder = null;

let allProducts = [];

let selectedProductImageUrl = "";


/* =====================================================
   FORMAT STATUS
===================================================== */

function formatStatus(status) {

    if (!status) {
        return "Unknown";
    }

    return String(status)
        .replaceAll("_", " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );
}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(date) {

    if (!date) {
        return "-";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "-";
    }

    return parsedDate.toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

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
   MOBILE SIDEBAR
===================================================== */

function toggleAdminSidebar() {

    const sidebar =
        document.getElementById(
            "adminSidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );

    if (!sidebar) {
        return;
    }

    sidebar.classList.toggle(
        "mobile-open"
    );

    if (overlay) {

        overlay.classList.toggle(
            "active"
        );

    }
}


/* =====================================================
   CLOSE SIDEBAR
===================================================== */

function closeAdminSidebar() {

    const sidebar =
        document.getElementById(
            "adminSidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );

    if (sidebar) {

        sidebar.classList.remove(
            "mobile-open"
        );

    }

    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }
}


/* =====================================================
   SHOW ADMIN SECTION
===================================================== */

function showAdminSection(
    sectionId,
    clickedButton
) {

    const sections =
        document.querySelectorAll(
            ".admin-section"
        );

    sections.forEach(
        section => {

            section.classList.remove(
                "active-section"
            );

        }
    );

    const section =
        document.getElementById(
            sectionId
        );

    if (section) {

        section.classList.add(
            "active-section"
        );

    }

    const buttons =
        document.querySelectorAll(
            ".sidebar-link"
        );

    buttons.forEach(
        button => {

            button.classList.remove(
                "active"
            );

        }
    );

    if (clickedButton) {

        clickedButton.classList.add(
            "active"
        );

    }


    /* =================================================
       LOAD SECTION DATA
    ================================================= */

    if (
        sectionId ===
        "pending-orders"
    ) {

        displayPendingOrders();

    }


    if (
        sectionId ===
        "products"
    ) {

        loadAdminProducts();

    }


    if (
        sectionId ===
        "stock"
    ) {

        loadAdminProducts();

    }


    if (
        sectionId ===
        "bills"
    ) {

        displayBills();

    }


    if (
        sectionId ===
        "delivery"
    ) {

        displayDeliveryOrders();

    }


    /* =================================================
       TOTAL EARNINGS
    ================================================= */

    if (
        sectionId ===
        "earnings"
    ) {

        calculateEarnings();

    }


    closeAdminSidebar();
}


/* =====================================================
   LOAD ORDERS
===================================================== */

/* =====================================================
   LOAD ORDERS
===================================================== */

async function loadOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    if (container) {

        container.innerHTML =
            `
            <div class="loading-box">
                ⏳ Loading orders...
            </div>
            `;

    }


    console.log(
        "================================="
    );

    console.log(
        "ADMIN: Loading orders..."
    );


    try {

        /* =========================================
           ADMIN TOKEN
        ========================================= */

        const adminToken =
            localStorage.getItem(
                "adminToken"
            );


        /* =========================================
           TOKEN CHECK
        ========================================= */

        if (!adminToken) {

            console.error(
                "❌ Admin token not found."
            );


            if (container) {

                container.innerHTML =
                    `
                    <div class="empty-box">

                        ❌ Admin session expired.

                        <br><br>

                        Please login again.

                    </div>
                    `;

            }


            setTimeout(
                function() {

                    window.location.href =
                        "login.html";

                },
                1200
            );


            return;
        }


        /* =========================================
           BACKEND REQUEST
        ========================================= */

        const response =
            await fetch(
                `${BACKEND_URL}/api/admin/orders`,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${adminToken}`,

                        "Content-Type":
                            "application/json"

                    }
                }
            );


        console.log(
            "Backend response status:",
            response.status
        );


        /* =========================================
           RESPONSE JSON
        ========================================= */

        const result =
            await response.json();


        console.log(
            "ADMIN ORDERS RESPONSE:",
            result
        );


        /* =========================================
           UNAUTHORIZED
        ========================================= */

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            console.error(
                "❌ Admin authentication failed."
            );


            localStorage.removeItem(
                "adminToken"
            );

            localStorage.removeItem(
                "adminUser"
            );


            if (container) {

                container.innerHTML =
                    `
                    <div class="empty-box">

                        ❌ Admin session expired.

                        <br><br>

                        Please login again.

                    </div>
                    `;

            }


            setTimeout(
                function() {

                    window.location.href =
                        "login.html";

                },
                1000
            );


            return;
        }


        /* =========================================
           BACKEND ERROR
        ========================================= */

        if (
            !response.ok ||
            !result.success
        ) {

            const errorMessage =
                result.message ||
                result.error ||
                "Could not load orders.";


            console.error(
                "❌ Backend orders error:",
                errorMessage
            );


            if (container) {

                container.innerHTML =
                    `
                    <div class="empty-box">

                        ❌ Could not load orders.

                        <br><br>

                        <strong>
                            Backend Error:
                        </strong>

                        <br>

                        ${escapeHtml(
                            errorMessage
                        )}

                    </div>
                    `;

            }


            return;
        }


        /* =========================================
           DATA
        ========================================= */

        allOrders =
            Array.isArray(
                result.orders
            )
                ? result.orders
                : Array.isArray(
                    result.data
                )
                    ? result.data
                    : [];


        console.log(
            "✅ Orders loaded:",
            allOrders.length
        );


        /* =========================================
           NO ORDERS
        ========================================= */

        if (
            allOrders.length ===
            0
        ) {

            console.warn(
                "⚠️ Backend returned 0 orders."
            );


            if (container) {

                container.innerHTML =
                    `
                    <div class="empty-box">

                        📦 No orders found.

                        <br><br>

                        <small>
                            Backend se 0 orders return hue.
                        </small>

                    </div>
                    `;

            }


            updateStats(
                []
            );

            displayPendingOrders();

            displayBills();

            displayDeliveryOrders();

            return;
        }


        /* =========================================
           UPDATE DASHBOARD
        ========================================= */

        updateStats(
            allOrders
        );


        /* =========================================
           DISPLAY ORDERS
        ========================================= */

        displayOrders(
            allOrders
        );


        /* =========================================
           OTHER ORDER SECTIONS
        ========================================= */

        displayPendingOrders();

        displayBills();

        displayDeliveryOrders();


        /* =========================================
           EARNINGS
        ========================================= */

        const earningsSection =
            document.getElementById(
                "earnings"
            );


        if (
            earningsSection &&
            earningsSection.classList.contains(
                "active-section"
            )
        ) {

            await calculateEarnings();

        }


        console.log(
            "✅ Orders displayed successfully."
        );


    } catch (error) {

        console.error(
            "❌ Load orders exception:",
            error
        );


        if (container) {

            container.innerHTML =
                `
                <div class="empty-box">

                    ❌ Something went wrong.

                    <br><br>

                    ${escapeHtml(
                        error.message ||
                        "Unknown error"
                    )}

                </div>
                `;

        }

    }

}

/* =====================================================
   UPDATE ORDER STATS
===================================================== */

function updateStats(orders) {

    const total =
        orders.length;


    const pending =
        orders.filter(
            order =>
                order.status ===
                "pending"
        ).length;


    const accepted =
        orders.filter(
            order =>
                [
                    "accepted",
                    "bill_generated",
                    "assigned",
                    "out_for_delivery"
                ].includes(
                    order.status
                )
        ).length;


    const completed =
        orders.filter(
            order =>
                order.status ===
                "completed"
        ).length;


    const totalElement =
        document.getElementById(
            "totalOrders"
        );


    const pendingElement =
        document.getElementById(
            "pendingOrders"
        );


    const acceptedElement =
        document.getElementById(
            "acceptedOrders"
        );


    const completedElement =
        document.getElementById(
            "completedOrders"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (acceptedElement) {

        acceptedElement.textContent =
            accepted;

    }


    if (completedElement) {

        completedElement.textContent =
            completed;

    }
}


/* =====================================================
   DISPLAY ALL ORDERS
===================================================== */

function displayOrders(orders) {

    const container =
        document.getElementById(
            "ordersContainer"
        );

    if (!container) {
        return;
    }


    const filterElement =
        document.getElementById(
            "statusFilter"
        );


    const filter =
        filterElement
            ? filterElement.value
            : "all";


    let filteredOrders =
        [...orders];


    if (
        filter !==
        "all"
    ) {

        filteredOrders =
            filteredOrders.filter(
                order =>
                    order.status ===
                    filter
            );

    }


    if (!filteredOrders.length) {

        container.innerHTML =
            `
            <div class="empty-box">

                📦 No orders found.

            </div>
            `;

        return;
    }


    container.innerHTML =
        filteredOrders
            .map(
                order =>
                    createOrderCard(
                        order
                    )
            )
            .join("");
}


/* =====================================================
   CREATE ORDER CARD
===================================================== */

function createOrderCard(order) {

    const status =
        formatStatus(
            order.status
        );


    let actionButtons = `

        <button
            type="button"
            class="view-btn"
            onclick="viewOrder('${escapeHtml(order.id)}')"
        >
            👁 View
        </button>

    `;


    /* =================================================
       PENDING ORDER ACTIONS
    ================================================= */

    if (
        order.status ===
        "pending"
    ) {

        actionButtons += `

            <button
                type="button"
                class="accept-btn"
                onclick="acceptOrder('${escapeHtml(order.id)}')"
            >
                ✅ Accept Order
            </button>

            <button
                type="button"
                class="reject-order-btn"
                onclick="rejectOrder('${escapeHtml(order.id)}')"
            >
                ❌ Reject Order
            </button>

        `;

    }


    /* =================================================
       ACCEPTED ORDER → GENERATE BILL
    ================================================= */

    if (
        order.status ===
        "accepted"
        &&
        !order.bill_generated
    ) {

        actionButtons += `

            <button
                type="button"
                class="bill-btn"
                onclick="generateBill('${escapeHtml(order.id)}')"
            >
                🧾 Generate Bill
            </button>

        `;

    }


    /* =================================================
       BILL AVAILABLE
    ================================================= */

    if (
        order.bill_generated ===
        true
    ) {

        actionButtons += `

            <button
                type="button"
                class="view-bill-btn"
                onclick="viewBill('${escapeHtml(order.id)}')"
            >
                👁️ View Bill
            </button>

        `;

    }


    /* =================================================
       REJECTION / CANCELLATION MESSAGE
    ================================================= */

    let reasonHTML = "";


    if (
        order.status ===
        "rejected" &&
        order.rejection_reason
    ) {

        reasonHTML = `

            <div
                class="order-reason-box rejected-reason"
            >

                <strong>
                    ❌ Rejection Reason
                </strong>

                <p>
                    ${escapeHtml(
                        order.rejection_reason
                    )}
                </p>

                ${
                    order.rejected_at
                        ? `
                            <small>
                                ${formatDate(
                                    order.rejected_at
                                )}
                            </small>
                          `
                        : ""
                }

            </div>

        `;

    }


    if (
        order.status ===
        "cancelled" &&
        order.cancelled_reason
    ) {

        reasonHTML = `

            <div
                class="order-reason-box cancelled-reason"
            >

                <strong>
                    🚫 Cancellation Reason
                </strong>

                <p>
                    ${escapeHtml(
                        order.cancelled_reason
                    )}
                </p>

                ${
                    order.cancelled_at
                        ? `
                            <small>
                                ${formatDate(
                                    order.cancelled_at
                                )}
                            </small>
                          `
                        : ""
                }

            </div>

        `;

    }


    return `

        <div class="order-card">

            <div class="order-top">

                <div>

                    <div class="order-number">
                        ${escapeHtml(
                            order.order_no
                        )}
                    </div>

                    <div class="order-date">
                        ${formatDate(
                            order.created_at
                        )}
                    </div>

                </div>

                <span
                    class="status-badge status-${escapeHtml(
                        order.status
                    )}"
                >
                    ${escapeHtml(
                        status
                    )}
                </span>

            </div>


            <div class="order-info-grid">

                <div class="info-item">

                    <span>
                        Customer ID
                    </span>

                    <strong>
                        ${escapeHtml(
                            order.customer_id
                        )}
                    </strong>

                </div>


                <div class="info-item">

                    <span>
                        Payment
                    </span>

                    <strong>
                        ${escapeHtml(
                            order.payment_method
                        )}
                    </strong>

                </div>


                <div class="info-item">

                    <span>
                        Status
                    </span>

                    <strong>
                        ${escapeHtml(
                            status
                        )}
                    </strong>

                </div>

            </div>


            ${reasonHTML}


            <div class="order-bottom">

                <div class="order-total">

                    ₹${Number(
                        order.total || 0
                    ).toFixed(2)}

                </div>


                <div class="order-buttons">

                    ${actionButtons}

                </div>

            </div>

        </div>

    `;
}


/* =====================================================
   PENDING ORDERS
===================================================== */

function displayPendingOrders() {

    const container =
        document.getElementById(
            "pendingOrdersContainer"
        );

    if (!container) {
        return;
    }


    const pendingOrders =
        allOrders.filter(
            order =>
                order.status ===
                "pending"
        );


    if (!pendingOrders.length) {

        container.innerHTML =
            `
            <div class="empty-box">

                <div style="font-size:45px;">
                    🎉
                </div>

                <h3>
                    No Pending Orders
                </h3>

                <p>
                    All customer orders have been processed.
                </p>

            </div>
            `;

        return;
    }


    container.innerHTML =
        pendingOrders
            .map(
                order =>
                    createOrderCard(
                        order
                    )
            )
            .join("");
}


/* =====================================================
   BILLS
===================================================== */

function displayBills() {

    const container =
        document.getElementById(
            "billsContainer"
        );

    if (!container) {
        return;
    }


    const billOrders =
        allOrders.filter(
            order =>
                order.bill_generated ===
                true
        );


    if (!billOrders.length) {

        container.innerHTML =
            `
            <div class="empty-product-box">

                <div>
                    🧾
                </div>

                <h3>
                    No Bills Generated
                </h3>

                <p>
                    Bills will appear here after generation.
                </p>

            </div>
            `;

        return;
    }


    container.innerHTML =
        billOrders
            .map(
                order => `

                    <div class="order-card">

                        <div class="order-top">

                            <div>

                                <div class="order-number">
                                    ${escapeHtml(
                                        order.order_no
                                    )}
                                </div>

                                <div class="order-date">
                                    ${formatDate(
                                        order.created_at
                                    )}
                                </div>

                            </div>

                            <span
                                class="status-badge status-${escapeHtml(
                                    order.status
                                )}"
                            >
                                ${escapeHtml(
                                    formatStatus(
                                        order.status
                                    )
                                )}
                            </span>

                        </div>


                        <div class="order-bottom">

                            <div class="order-total">
                                ₹${Number(
                                    order.total || 0
                                ).toFixed(2)}
                            </div>


                            <div class="order-buttons">

                                <button
                                    type="button"
                                    class="view-btn"
                                    onclick="viewOrder('${escapeHtml(order.id)}')"
                                >
                                    👁 View Order
                                </button>


                                <button
                                    type="button"
                                    class="view-bill-btn"
                                    onclick="viewBill('${escapeHtml(order.id)}')"
                                >
                                    🧾 View Bill
                                </button>

                            </div>

                        </div>

                    </div>

                `
            )
            .join("");
}


/* =====================================================
   DELIVERY
===================================================== */

function displayDeliveryOrders() {

    const container =
        document.getElementById(
            "deliveryContainer"
        );

    if (!container) {
        return;
    }


    const deliveryOrders =
        allOrders.filter(
            order =>
                [
                    "assigned",
                    "out_for_delivery",
                    "completed"
                ].includes(
                    order.status
                )
        );


    if (!deliveryOrders.length) {

        container.innerHTML =
            `
            <div class="empty-product-box">

                <div>
                    🚚
                </div>

                <h3>
                    No Delivery Orders
                </h3>

                <p>
                    Delivery orders will appear here.
                </p>

            </div>
            `;

        return;
    }


    container.innerHTML =
        deliveryOrders
            .map(
                order => `

                    <div class="order-card">

                        <div class="order-top">

                            <div>

                                <div class="order-number">
                                    ${escapeHtml(
                                        order.order_no
                                    )}
                                </div>

                                <div class="order-date">
                                    ${formatDate(
                                        order.created_at
                                    )}
                                </div>

                            </div>


                            <span
                                class="status-badge status-${escapeHtml(
                                    order.status
                                )}"
                            >
                                ${escapeHtml(
                                    formatStatus(
                                        order.status
                                    )
                                )}
                            </span>

                        </div>


                        <div class="order-info-grid">

                            <div class="info-item">

                                <span>
                                    Delivery Boy
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        order.delivery_boy_id ||
                                        "Not Assigned"
                                    )}
                                </strong>

                            </div>


                            <div class="info-item">

                                <span>
                                    OTP Status
                                </span>

                                <strong>
                                    ${
                                        order.otp_verified
                                            ? "✅ Verified"
                                            : "⏳ Not Verified"
                                    }
                                </strong>

                            </div>


                            <div class="info-item">

                                <span>
                                    Amount
                                </span>

                                <strong>
                                    ₹${Number(
                                        order.total || 0
                                    ).toFixed(2)}
                                </strong>

                            </div>

                        </div>


                        <div class="order-bottom">

                            <div>
                                🚚 Delivery
                            </div>


                            <div class="order-buttons">

                                <button
                                    type="button"
                                    class="view-btn"
                                    onclick="viewOrder('${escapeHtml(order.id)}')"
                                >
                                    👁 View
                                </button>

                            </div>

                        </div>

                    </div>

                `
            )
            .join("");
}


/* =====================================================
   VIEW ORDER
===================================================== */

async function viewOrder(orderId) {

    const order =
        allOrders.find(
            item =>
                String(item.id) ===
                String(orderId)
        );


    if (!order) {
        return;
    }


    selectedOrder =
        order;


    const details =
        document.getElementById(
            "orderDetails"
        );


    const modal =
        document.getElementById(
            "orderModal"
        );


    if (!details || !modal) {
        return;
    }


    details.innerHTML =
        `
        <div class="loading-box">
            Loading order details...
        </div>
        `;


    modal.classList.add(
        "active"
    );


    try {

        const {
            data: customer,
            error: customerError
        } = await supabaseClient

            .from("profiles")

            .select(
                "id, full_name, phone"
            )

            .eq(
                "id",
                order.customer_id
            )

            .maybeSingle();


        if (customerError) {

            console.error(
                "Customer error:",
                customerError
            );

        }


        let address = null;


        if (order.address_id) {

            const {
                data: addressData,
                error: addressError
            } = await supabaseClient

                .from("addresses")

                .select(`
                    address_line,
                    city,
                    state,
                    pincode
                `)

                .eq(
                    "id",
                    order.address_id
                )

                .maybeSingle();


            if (addressError) {

                console.error(
                    "Address error:",
                    addressError
                );

            } else {

                address =
                    addressData;

            }

        }


        const {
            data: items,
            error: itemsError
        } = await supabaseClient

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
            );


        if (itemsError) {

            console.error(
                "Items error:",
                itemsError
            );

        }


        /* =========================================
           STATUS MESSAGE
        ========================================= */

        let statusMessage = "";


        if (
            order.status ===
            "rejected"
        ) {

            statusMessage = `

                <div
                    class="order-reason-box rejected-reason"
                    style="
                        margin-bottom:20px;
                        padding:15px;
                        border-radius:10px;
                    "
                >

                    <h3>
                        ❌ Order Rejected
                    </h3>

                    <p>

                        <strong>
                            Reason:
                        </strong>

                        ${escapeHtml(
                            order.rejection_reason ||
                            "No reason provided."
                        )}

                    </p>

                    ${
                        order.rejected_at
                            ? `
                                <small>
                                    Rejected:
                                    ${formatDate(
                                        order.rejected_at
                                    )}
                                </small>
                              `
                            : ""
                    }

                </div>

            `;

        }


        if (
            order.status ===
            "cancelled"
        ) {

            statusMessage = `

                <div
                    class="order-reason-box cancelled-reason"
                    style="
                        margin-bottom:20px;
                        padding:15px;
                        border-radius:10px;
                    "
                >

                    <h3>
                        🚫 Order Cancelled
                    </h3>

                    <p>

                        <strong>
                            Reason:
                        </strong>

                        ${escapeHtml(
                            order.cancelled_reason ||
                            "No reason provided."
                        )}

                    </p>

                    ${
                        order.cancelled_at
                            ? `
                                <small>
                                    Cancelled:
                                    ${formatDate(
                                        order.cancelled_at
                                    )}
                                </small>
                              `
                            : ""
                    }

                </div>

            `;

        }


        details.innerHTML = `

            ${statusMessage}


            <div class="detail-section">

                <h3>
                    👤 Customer
                </h3>


                <div class="detail-row">

                    <span>
                        Name
                    </span>

                    <strong>
                        ${escapeHtml(
                            customer?.full_name ||
                            "-"
                        )}
                    </strong>

                </div>


                <div class="detail-row">

                    <span>
                        Phone
                    </span>

                    <strong>
                        ${escapeHtml(
                            customer?.phone ||
                            "-"
                        )}
                    </strong>

                </div>

            </div>


            <div class="detail-section">

                <h3>
                    🏠 Delivery Address
                </h3>


                <div>
                    ${escapeHtml(
                        address?.address_line ||
                        "-"
                    )}
                </div>


                <div>

                    ${escapeHtml(
                        address?.city ||
                        ""
                    )}

                    ,

                    ${escapeHtml(
                        address?.state ||
                        ""
                    )}

                    -

                    ${escapeHtml(
                        address?.pincode ||
                        ""
                    )}

                </div>

            </div>


            <div class="detail-section">

                <h3>
                    🛍️ Items
                </h3>


                ${
                    (items || [])
                        .map(
                            item => `

                                <div
                                    class="detail-item"
                                >

                                    <strong>
                                        ${escapeHtml(
                                            item.product_name
                                        )}
                                    </strong>


                                    <div>

                                        ${escapeHtml(
                                            item.pack ||
                                            ""
                                        )}

                                        ×

                                        ${Number(
                                            item.quantity ||
                                            0
                                        )}

                                        —

                                        ₹${Number(
                                            item.line_total ||
                                            0
                                        ).toFixed(2)}

                                    </div>

                                </div>

                            `
                        )
                        .join("")
                }

            </div>


            <div class="detail-section">

                <h3>
                    💰 Payment Summary
                </h3>


                <div class="detail-row">

                    <span>
                        Subtotal
                    </span>

                    <strong>
                        ₹${Number(
                            order.subtotal ||
                            0
                        ).toFixed(2)}
                    </strong>

                </div>


                <div class="detail-row">

                    <span>
                        Delivery
                    </span>

                    <strong>
                        ₹${Number(
                            order.delivery_charge ||
                            0
                        ).toFixed(2)}
                    </strong>

                </div>


                <div class="detail-row">

                    <strong>
                        Total
                    </strong>

                    <strong>
                        ₹${Number(
                            order.total ||
                            0
                        ).toFixed(2)}
                    </strong>

                </div>

            </div>

        `;


    } catch (error) {

        console.error(
            "View order error:",
            error
        );


        details.innerHTML =
            `
            <div class="empty-box">

                ❌ Could not load details.

                <br><br>

                ${escapeHtml(
                    error.message
                )}

            </div>
            `;

    }
}


/* =====================================================
   ACCEPT ORDER
   CUSTOM CONFIRM DIALOG
===================================================== */

/* =====================================================
   ACCEPT ORDER
   BACKEND API + CUSTOM CONFIRM DIALOG
===================================================== */

async function acceptOrder(orderId) {

    openAdminConfirmDialog(
        "Accept Order",
        "Are you sure you want to accept this order?",
        async function() {

            try {

                /* =========================================
                   ADMIN TOKEN
                ========================================= */

                const adminToken =
                    localStorage.getItem(
                        "adminToken"
                    );


                if (!adminToken) {

                    alert(
                        "Admin session expired. Please login again."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                /* =========================================
                   BACKEND REQUEST
                ========================================= */

                const response =
                    await fetch(
                        `${BACKEND_URL}/api/admin/orders/${encodeURIComponent(orderId)}/accept`,
                        {
                            method: "POST",

                            headers: {

                                "Authorization":
                                    `Bearer ${adminToken}`,

                                "Content-Type":
                                    "application/json"

                            }
                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Accept order response:",
                    result
                );


                /* =========================================
                   SESSION EXPIRED
                ========================================= */

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    localStorage.removeItem(
                        "adminToken"
                    );

                    localStorage.removeItem(
                        "adminUser"
                    );


                    alert(
                        "Admin session expired. Please login again."
                    );


                    window.location.href =
                        "login.html";

                    return;
                }


                /* =========================================
                   BACKEND ERROR
                ========================================= */

                if (
                    !response.ok ||
                    !result.success
                ) {

                    alert(
                        "Order could not be accepted.\n\n" +
                        (
                            result.message ||
                            result.error ||
                            "Unknown error"
                        )
                    );

                    return;
                }


                /* =========================================
                   SUCCESS
                ========================================= */

                alert(
                    "✅ Order accepted successfully."
                );


                await loadOrders();


            } catch (error) {

                console.error(
                    "Accept order error:",
                    error
                );


                alert(
                    "Something went wrong.\n\n" +
                    error.message
                );

            }

        }
    );

}


/* =====================================================
   REJECT ORDER
   BACKEND API + CUSTOM INPUT + CUSTOM CONFIRM
===================================================== */

async function rejectOrder(orderId) {

    openAdminInputDialog(
        "Reject Order",
        "Why do you want to reject this order?",
        "",
        function(reason) {

            const cleanReason =
                String(
                    reason || ""
                ).trim();


            /* =========================================
               CHECK REASON
            ========================================= */

            if (!cleanReason) {

                alert(
                    "Please enter a rejection reason."
                );

                return;
            }


            /* =========================================
               SECOND CONFIRMATION
            ========================================= */

            openAdminConfirmDialog(

                "Reject Order",

                "Are you sure you want to reject this order?\n\n" +
                "Reason: " +
                cleanReason,

                async function() {

                    try {

                        /* =================================
                           ADMIN TOKEN
                        ================================= */

                        const adminToken =
                            localStorage.getItem(
                                "adminToken"
                            );


                        if (!adminToken) {

                            alert(
                                "Admin session expired. Please login again."
                            );

                            window.location.href =
                                "login.html";

                            return;
                        }


                        /* =================================
                           BACKEND REQUEST
                        ================================= */

                        const response =
                            await fetch(
                                `${BACKEND_URL}/api/admin/orders/${encodeURIComponent(orderId)}/reject`,
                                {
                                    method: "POST",

                                    headers: {

                                        "Authorization":
                                            `Bearer ${adminToken}`,

                                        "Content-Type":
                                            "application/json"

                                    },

                                    body:
                                        JSON.stringify({

                                            reason:
                                                cleanReason

                                        })

                                }
                            );


                        const result =
                            await response.json();


                        console.log(
                            "Reject order response:",
                            result
                        );


                        /* =================================
                           SESSION EXPIRED
                        ================================= */

                        if (
                            response.status === 401 ||
                            response.status === 403
                        ) {

                            localStorage.removeItem(
                                "adminToken"
                            );

                            localStorage.removeItem(
                                "adminUser"
                            );


                            alert(
                                "Admin session expired. Please login again."
                            );


                            window.location.href =
                                "login.html";

                            return;
                        }


                        /* =================================
                           BACKEND ERROR
                        ================================= */

                        if (
                            !response.ok ||
                            !result.success
                        ) {

                            alert(
                                "Order could not be rejected.\n\n" +
                                (
                                    result.message ||
                                    result.error ||
                                    "Unknown error"
                                )
                            );

                            return;
                        }


                        /* =================================
                           SUCCESS
                        ================================= */

                        alert(
                            "❌ Order rejected successfully."
                        );


                        await loadOrders();


                    } catch (error) {

                        console.error(
                            "Reject order error:",
                            error
                        );


                        alert(
                            "Something went wrong.\n\n" +
                            error.message
                        );

                    }

                }

            );

        },

        "Reject"

    );

}
/* =====================================================
   GENERATE BILL
   CUSTOM CONFIRM DIALOG
===================================================== */

async function generateBill(orderId) {

    openAdminConfirmDialog(

        "Generate Bill",

        "Are you sure you want to generate the bill?",

        async function() {

            /* =========================================
               ADMIN TOKEN
            ========================================= */

            const adminToken =
                localStorage.getItem(
                    "adminToken"
                );


            if (!adminToken) {

                alert(
                    "Admin session missing. Please login again."
                );

                return;
            }


            try {

                /* =====================================
                   BILL GENERATING MESSAGE
                ===================================== */

                alert(
                    "Bill is being generated. Please wait..."
                );


                /* =====================================
                   BACKEND REQUEST
                ===================================== */

                const response =
                    await fetch(

                        `${BACKEND_URL}/api/admin/generate-bill`,

                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${adminToken}`

                            },

                            body:
                                JSON.stringify({

                                    orderId:
                                        orderId

                                })

                        }

                    );


                const result =
                    await response.json();


                /* =====================================
                   ERROR
                ===================================== */

                if (
                    !response.ok ||
                    !result.success
                ) {

                    console.error(
                        "Generate bill error:",
                        result
                    );


                    alert(
                        "Bill could not be generated.\n\n" +
                        (
                            result.message ||
                            "Unknown error"
                        )
                    );


                    return;
                }


                /* =====================================
                   SUCCESS
                ===================================== */

                alert(
                    "✅ Bill generated successfully."
                );


                await loadOrders();


                /* =====================================
                   PDF AVAILABLE
                ===================================== */

                if (result.pdfUrl) {

                    openAdminConfirmDialog(

                        "Bill Ready",

                        "Bill is ready.\n\n" +
                        "Do you want to open the PDF?",

                        function() {

                            window.open(
                                result.pdfUrl,
                                "_blank"
                            );

                        }

                    );

                }


            } catch (error) {

                console.error(
                    "Generate bill error:",
                    error
                );


                alert(
                    "❌ Backend server se connection nahi ho pa raha.\n\n" +
                    "Check karo ki backend CMD me node server.js running hai."
                );

            }

        }

    );

}

/* =====================================================
   VIEW BILL
===================================================== */

async function viewBill(orderId) {

    const order =
        allOrders.find(
            item =>
                String(item.id) ===
                String(orderId)
        );


    if (!order) {
        return;
    }


    selectedOrder =
        order;


    const details =
        document.getElementById(
            "orderDetails"
        );


    const modal =
        document.getElementById(
            "orderModal"
        );


    if (!details || !modal) {
        return;
    }


    details.innerHTML =
        `
        <div class="loading-box">
            Loading bill...
        </div>
        `;


    modal.classList.add(
        "active"
    );


    try {

        const adminToken =
    localStorage.getItem(
        "adminToken"
    );


if (!adminToken) {

    throw new Error(
        "Admin session missing. Please login again."
    );

}


const response =
    await fetch(
        `${BACKEND_URL}/api/admin/bill/${orderId}`,
        {
            method:
                "GET",

            headers: {

                "Authorization":
                    `Bearer ${adminToken}`

            }

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
                "Bill not found."
            );

        }


        const {
            data: customer
        } = await supabaseClient

            .from("profiles")

            .select(
                "full_name, phone"
            )

            .eq(
                "id",
                order.customer_id
            )

            .maybeSingle();


        let address = null;


        if (order.address_id) {

            const {
                data
            } = await supabaseClient

                .from("addresses")

                .select(`
                    address_line,
                    city,
                    state,
                    pincode
                `)

                .eq(
                    "id",
                    order.address_id
                )

                .maybeSingle();


            address =
                data;

        }


        const {
            data: items
        } = await supabaseClient

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
            );


        const billNumber =
            result.bill?.bill_no ||
            "PPS-BILL";


        details.innerHTML = `

            <div class="bill-container">

                <div class="bill-header">

                    <h2>
                        📦 Pooja Paper Solution
                    </h2>

                    <p>
                        TAX / SALES BILL
                    </p>

                </div>


                <div class="bill-info">

                    <div>

                        <strong>
                            Bill No:
                        </strong>

                        ${escapeHtml(
                            billNumber
                        )}

                    </div>


                    <div>

                        <strong>
                            Order No:
                        </strong>

                        ${escapeHtml(
                            order.order_no
                        )}

                    </div>


                    <div>

                        <strong>
                            Date:
                        </strong>

                        ${formatDate(
                            order.created_at
                        )}

                    </div>

                </div>


                <hr>


                <div class="bill-customer">

                    <h3>
                        Customer Details
                    </h3>


                    <p>

                        <strong>
                            Name:
                        </strong>

                        ${escapeHtml(
                            customer?.full_name ||
                            "-"
                        )}

                    </p>


                    <p>

                        <strong>
                            Phone:
                        </strong>

                        ${escapeHtml(
                            customer?.phone ||
                            "-"
                        )}

                    </p>

                </div>


                <div class="bill-address">

                    <h3>
                        Delivery Address
                    </h3>


                    <p>
                        ${escapeHtml(
                            address?.address_line ||
                            "-"
                        )}
                    </p>


                    <p>

                        ${escapeHtml(
                            address?.city ||
                            ""
                        )}

                        ,

                        ${escapeHtml(
                            address?.state ||
                            ""
                        )}

                        -

                        ${escapeHtml(
                            address?.pincode ||
                            ""
                        )}

                    </p>

                </div>


                <h3>
                    Order Items
                </h3>


                <div class="bill-items">

                    ${
                        (items || [])
                            .map(
                                (
                                    item,
                                    index
                                ) => `

                                    <div
                                        class="bill-item"
                                    >

                                        <div>

                                            <strong>

                                                ${index + 1}.

                                                ${escapeHtml(
                                                    item.product_name
                                                )}

                                            </strong>


                                            <small>

                                                ${escapeHtml(
                                                    item.pack ||
                                                    ""
                                                )}

                                            </small>

                                        </div>


                                        <div>

                                            ${Number(
                                                item.quantity ||
                                                0
                                            )}

                                            ×

                                            ₹${Number(
                                                item.price ||
                                                0
                                            ).toFixed(2)}

                                        </div>


                                        <strong>

                                            ₹${Number(
                                                item.line_total ||
                                                0
                                            ).toFixed(2)}

                                        </strong>

                                    </div>

                                `
                            )
                            .join("")
                    }

                </div>


                <hr>


                <div class="bill-total">

                    <div>

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹${Number(
                                order.subtotal ||
                                0
                            ).toFixed(2)}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Delivery
                        </span>

                        <strong>
                            ₹${Number(
                                order.delivery_charge ||
                                0
                            ).toFixed(2)}
                        </strong>

                    </div>


                    <div class="grand-total">

                        <span>
                            Grand Total
                        </span>

                        <strong>
                            ₹${Number(
                                order.total ||
                                0
                            ).toFixed(2)}
                        </strong>

                    </div>

                </div>


                <div class="bill-payment">

                    <strong>
                        Payment:
                    </strong>

                    ${escapeHtml(
                        order.payment_method ||
                        "COD"
                    )}

                </div>


                <div class="bill-qr-section">

                    <h3>
                        📱 Order QR
                    </h3>

                    <div id="billQRCode"></div>

                    <p>
                        Scan this QR to identify this order.
                    </p>

                </div>


                <div
                    class="bill-actions"
                    style="
                        display:flex;
                        gap:10px;
                        justify-content:center;
                        flex-wrap:wrap;
                        margin-top:20px;
                    "
                >

                    <button
                        type="button"
                        class="view-bill-btn"
                        onclick="openBillPDF(this.dataset.url)"
                        data-url="${escapeHtml(
                            result.pdfUrl ||
                            ""
                        )}"
                    >
                        📄 Open PDF
                    </button>


                    <button
                        type="button"
                        class="bill-btn"
                        onclick="downloadBillPDF(this.dataset.url)"
                        data-url="${escapeHtml(
                            result.pdfUrl ||
                            ""
                        )}"
                    >
                        ⬇️ Download Bill
                    </button>


                    <button
                        type="button"
                        class="sticker-print-btn"
                        onclick="printCartonSticker('${escapeHtml(order.id)}')"
                    >
                        🏷️ Print Carton Sticker
                    </button>

                </div>


                <div class="bill-footer">

                    <p>
                        Thank you for ordering!
                    </p>

                    <p>
                        Pooja Paper Solution
                    </p>

                </div>

            </div>

        `;


        setTimeout(
            function() {

                const qrContainer =
                    document.getElementById(
                        "billQRCode"
                    );


                if (!qrContainer) {
                    return;
                }


                if (
                    typeof QRCode ===
                    "undefined"
                ) {

                    qrContainer.innerHTML =
                        `
                        <p>
                            ❌ QR library not loaded.
                        </p>
                        `;

                    return;
                }


                qrContainer.innerHTML =
                    "";


                const qrData =
    JSON.stringify({

        orderId:
            order.id,

        orderNo:
            order.order_no,

        qrToken:
            result.bill.qr_token

    });


                new QRCode(
                    qrContainer,
                    {

                        text:
                            qrData,

                        width:
                            180,

                        height:
                            180,

                        correctLevel:
                            QRCode.CorrectLevel.H

                    }
                );


            },
            100
        );


    } catch (error) {

        console.error(
            "View bill error:",
            error
        );


        details.innerHTML =
            `
            <div class="empty-box">

                ❌ Could not load bill.

                <br><br>

                ${escapeHtml(
                    error.message
                )}

            </div>
            `;

    }
}


/* =====================================================
   OPEN BILL PDF
===================================================== */

function openBillPDF(pdfUrl) {

    if (!pdfUrl) {

        alert(
            "PDF link available nahi hai."
        );

        return;
    }


    window.open(
        pdfUrl,
        "_blank"
    );
}


/* =====================================================
   DOWNLOAD BILL PDF
===================================================== */

function downloadBillPDF(pdfUrl) {

    if (!pdfUrl) {

        alert(
            "PDF link available nahi hai."
        );

        return;
    }


    const link =
        document.createElement(
            "a"
        );


    link.href =
        pdfUrl;


    link.target =
        "_blank";


    link.download =
        "Pooja-Paper-Solution-Bill.pdf";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );
}


/* =====================================================
   CLOSE ORDER MODAL
===================================================== */

function closeOrderModal() {

    const modal =
        document.getElementById(
            "orderModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }
}


/* =====================================================
   PRODUCT MODAL
===================================================== */

function openProductModal(
    productId = null
) {

    const modal =
        document.getElementById(
            "productModal"
        );


    const form =
        document.getElementById(
            "productForm"
        );


    if (!modal || !form) {
        return;
    }


    form.reset();


    const idInput =
        document.getElementById(
            "productId"
        );


    const title =
        document.getElementById(
            "productModalTitle"
        );


    const activeCheckbox =
        document.getElementById(
            "productActive"
        );


    selectedProductImageUrl =
        "";


    if (productId !== null) {

        const product =
            allProducts.find(
                item =>
                    Number(item.id) ===
                    Number(productId)
            );


        if (!product) {

            alert(
                "Product not found."
            );


            return;
        }


        if (title) {

            title.textContent =
                "Update Product";

        }


        if (idInput) {

            idInput.value =
                String(product.id);

        }


        const nameInput =
            document.getElementById(
                "productName"
            );


        const packInput =
            document.getElementById(
                "productPack"
            );


        const priceInput =
            document.getElementById(
                "productPrice"
            );


        const stockInput =
            document.getElementById(
                "productStock"
            );


        const iconInput =
            document.getElementById(
                "productIcon"
            );


        if (nameInput) {

            nameInput.value =
                product.name ||
                "";

        }


        if (packInput) {

            packInput.value =
                product.pack ||
                "";

        }


        if (priceInput) {

            priceInput.value =
                Number(
                    product.price || 0
                );

        }


        if (stockInput) {

            stockInput.value =
                Number(
                    product.stock || 0
                );

        }


        if (iconInput) {

            iconInput.value =
                product.icon ||
                "";

        }


        if (activeCheckbox) {

            activeCheckbox.checked =
                product.is_active !==
                false;

        }


        selectedProductImageUrl =
            product.image_url ||
            "";


        showProductImagePreview(
            selectedProductImageUrl
        );


    } else {

        if (title) {

            title.textContent =
                "Add New Product";

        }


        if (idInput) {

            idInput.value =
                "";

        }


        if (activeCheckbox) {

            activeCheckbox.checked =
                true;

        }


        showProductImagePreview(
            ""
        );

    }


    modal.classList.add(
        "active"
    );
}


/* =====================================================
   CLOSE PRODUCT MODAL
===================================================== */

function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }


    selectedProductImageUrl =
        "";
}


/* =====================================================
   PRODUCT IMAGE PREVIEW
===================================================== */

function showProductImagePreview(
    imageUrl
) {

    const preview =
        document.getElementById(
            "productImagePreview"
        );


    if (!preview) {
        return;
    }


    if (!imageUrl) {

        preview.innerHTML =
            `
            <span>
                🖼️
            </span>

            <p>
                Image preview
            </p>
            `;


        return;
    }


    preview.innerHTML =
        `
        <img
            src="${escapeHtml(
                imageUrl
            )}"
            alt="Product Preview"
        >
        `;
}


/* =====================================================
   PRODUCT IMAGE PREVIEW SETUP
===================================================== */

function setupProductImagePreview() {

    const imageInput =
        document.getElementById(
            "productImage"
        );


    if (!imageInput) {
        return;
    }


    imageInput.addEventListener(
        "change",
        function() {

            const file =
                imageInput.files?.[0];


            if (!file) {

                showProductImagePreview(
                    selectedProductImageUrl
                );


                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select a valid image file."
                );


                imageInput.value =
                    "";


                return;
            }


            const maxSize =
                5 * 1024 * 1024;


            if (
                file.size >
                maxSize
            ) {

                alert(
                    "Image size must be less than 5 MB."
                );


                imageInput.value =
                    "";


                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    showProductImagePreview(
                        event.target.result
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );
}


/* =====================================================
   UPLOAD PRODUCT IMAGE
===================================================== */

async function uploadProductImage(
    file
) {

    if (!file) {

        return {
            success:
                true,

            url:
                selectedProductImageUrl ||
                ""
        };

    }


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        "product-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(
                2,
                10
            ) +
        "." +
        extension;


    try {

        const {
            error
        } = await supabaseClient

            .storage

            .from(
                "product-images"
            )

            .upload(
                fileName,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false,

                    contentType:
                        file.type
                }
            );


        if (error) {

            console.error(
                "Image upload error:",
                error
            );


            return {
                success:
                    false,

                message:
                    error.message
            };

        }


        const {
            data
        } =
            supabaseClient

                .storage

                .from(
                    "product-images"
                )

                .getPublicUrl(
                    fileName
                );


        return {

            success:
                true,

            url:
                data.publicUrl

        };


    } catch (error) {

        console.error(
            error
        );


        return {

            success:
                false,

            message:
                error.message

        };

    }
}


/* =====================================================
   SAVE PRODUCT
===================================================== */

async function saveProduct(event) {

    event.preventDefault();


    const productIdRaw =
        document.getElementById(
            "productId"
        )?.value.trim() ||
        "";


    const name =
        document.getElementById(
            "productName"
        )?.value.trim() ||
        "";


    const pack =
        document.getElementById(
            "productPack"
        )?.value.trim() ||
        "";


    const priceRaw =
        document.getElementById(
            "productPrice"
        )?.value;


    const stockRaw =
        document.getElementById(
            "productStock"
        )?.value;


    const price =
        Number(
            priceRaw
        );


    const stock =
        Number(
            stockRaw
        );


    const icon =
        document.getElementById(
            "productIcon"
        )?.value.trim() ||
        "";


    const activeElement =
        document.getElementById(
            "productActive"
        );


    const isActive =
        activeElement
            ? activeElement.checked
            : true;


    const imageInput =
        document.getElementById(
            "productImage"
        );


    const imageFile =
        imageInput?.files?.[0] ||
        null;


    /* =========================================
       VALIDATION
    ========================================= */

    if (!name) {

        alert(
            "Please enter product name."
        );


        return;
    }


    if (!pack) {

        alert(
            "Please enter pack details."
        );


        return;
    }


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        alert(
            "Please enter a valid price."
        );


        return;
    }


    if (
        !Number.isInteger(stock) ||
        stock < 0
    ) {

        alert(
            "Stock must be a whole number 0 or greater."
        );


        return;
    }


    /* =========================================
       PRODUCT ID
    ========================================= */

    let productId = null;


    if (productIdRaw !== "") {

        productId =
            Number(
                productIdRaw
            );


        if (
            !Number.isInteger(
                productId
            ) ||
            productId <= 0
        ) {

            alert(
                "Invalid product ID."
            );


            return;
        }

    }


    const submitButton =
        document.querySelector(
            "#productForm button[type='submit']"
        );


    const originalText =
        submitButton
            ? submitButton.textContent
            : "";


    if (submitButton) {

        submitButton.disabled =
            true;


        submitButton.textContent =
            "⏳ Saving...";

    }


    try {

        /* =========================================
           IMAGE
        ========================================= */

        let imageUrl =
            selectedProductImageUrl ||
            "";


        if (imageFile) {

            const uploadResult =
                await uploadProductImage(
                    imageFile
                );


            if (
                !uploadResult.success
            ) {

                alert(
                    "Product image upload failed.\n\n" +
                    uploadResult.message
                );


                return;
            }


            imageUrl =
                uploadResult.url;

        }


        /* =========================================
           PRODUCT DATA
        ========================================= */

        const productData = {

            name:
                name,

            pack:
                pack,

            price:
                price,

            icon:
                icon ||
                "🥤",

            image_url:
                imageUrl ||
                null,

            stock:
                stock,

            is_active:
                isActive

        };


        /* =========================================
           UPDATE EXISTING PRODUCT
        ========================================= */

        if (productId !== null) {

            console.log(
                "Updating product ID:",
                productId
            );


            console.log(
                "Update data:",
                productData
            );


            const {
                data,
                error
            } = await supabaseClient

                .from("products")

                .update(
                    productData
                )

                .eq(
                    "id",
                    productId
                )

                .select(`
                    id,
                    name,
                    pack,
                    price,
                    icon,
                    image_url,
                    stock,
                    is_active,
                    created_at
                `)

                .maybeSingle();


            if (error) {

                console.error(
                    "Update product error:",
                    error
                );


                alert(
                    "Product update failed.\n\n" +
                    error.message
                );


                return;
            }


            if (!data) {

                alert(
                    "Product update failed.\n\n" +
                    "No product was updated. Please check the product ID and admin RLS policy."
                );


                return;
            }


            console.log(
                "Updated product:",
                data
            );


            alert(
                "✅ Product updated successfully."
            );


        } else {

            /* =====================================
               ADD NEW PRODUCT
            ===================================== */

            const {
                data,
                error
            } = await supabaseClient

                .from("products")

                .insert(
                    productData
                )

                .select(`
                    id,
                    name,
                    pack,
                    price,
                    icon,
                    image_url,
                    stock,
                    is_active,
                    created_at
                `)

                .maybeSingle();


            if (error) {

                console.error(
                    "Add product error:",
                    error
                );


                alert(
                    "Product could not be added.\n\n" +
                    error.message
                );


                return;
            }


            if (!data) {

                alert(
                    "Product could not be added."
                );


                return;
            }


            console.log(
                "Added product:",
                data
            );


            alert(
                "✅ Product added successfully."
            );

        }


        closeProductModal();


        await loadAdminProducts();


    } catch (error) {

        console.error(
            "Save product error:",
            error
        );


        alert(
            "Something went wrong.\n\n" +
            error.message
        );


    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;


            submitButton.textContent =
                originalText ||
                "💾 Save Product";

        }

    }
}


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadAdminProducts() {

    const container =
        document.getElementById(
            "adminProductsContainer"
        );


    if (container) {

        container.innerHTML =
            `
            <div class="loading-box">
                Loading products...
            </div>
            `;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("products")

            .select(`
                id,
                name,
                pack,
                price,
                icon,
                image_url,
                stock,
                is_active,
                created_at
            `)

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "Products error:",
                error
            );


            if (container) {

                container.innerHTML =
                    `
                    <div class="empty-product-box">

                        <div>
                            ❌
                        </div>

                        <h3>
                            Could not load products
                        </h3>

                        <p>
                            ${escapeHtml(
                                error.message
                            )}
                        </p>

                    </div>
                    `;

            }


            return;
        }


        allProducts =
            data || [];


        displayAdminProducts(
            allProducts
        );


        displayStockProducts(
            allProducts
        );


    } catch (error) {

        console.error(
            "Load products error:",
            error
        );


        if (container) {

            container.innerHTML =
                `
                <div class="empty-product-box">

                    ❌ Something went wrong.

                    <br><br>

                    ${escapeHtml(
                        error.message
                    )}

                </div>
                `;

        }

    }
}


/* =====================================================
   DISPLAY ADMIN PRODUCTS
===================================================== */

function displayAdminProducts(
    products
) {

    const container =
        document.getElementById(
            "adminProductsContainer"
        );


    if (!container) {
        return;
    }


    const searchInput =
        document.getElementById(
            "productSearch"
        );


    const statusFilter =
        document.getElementById(
            "productStatusFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filter =
        statusFilter
            ? statusFilter.value
            : "all";


    const filteredProducts =
        products.filter(
            product => {

                const productName =
                    String(
                        product.name ||
                        ""
                    )
                        .toLowerCase();


                const productPack =
                    String(
                        product.pack ||
                        ""
                    )
                        .toLowerCase();


                const matchesSearch =
                    !search ||
                    productName.includes(
                        search
                    ) ||
                    productPack.includes(
                        search
                    );


                let matchesFilter =
                    true;


                if (
                    filter ===
                    "active"
                ) {

                    matchesFilter =
                        product.is_active ===
                        true;

                }


                if (
                    filter ===
                    "inactive"
                ) {

                    matchesFilter =
                        product.is_active ===
                        false;

                }


                if (
                    filter ===
                    "out"
                ) {

                    matchesFilter =
                        Number(
                            product.stock || 0
                        ) <=
                        0;

                }


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    if (!filteredProducts.length) {

        container.innerHTML =
            `
            <div class="empty-product-box">

                <div>
                    🔎
                </div>

                <h3>
                    No Products Found
                </h3>

                <p>
                    Try another search or add a new product.
                </p>

            </div>
            `;


        return;
    }


    container.innerHTML =
        filteredProducts
            .map(
                product =>
                    createAdminProductCard(
                        product
                    )
            )
            .join("");
}


/* =====================================================
   CREATE PRODUCT CARD
===================================================== */

function createAdminProductCard(
    product
) {

    const stock =
        Number(
            product.stock || 0
        );


    let stockClass =
        "";


    let stockText =
        `${stock} in stock`;


    if (
        stock <=
        0
    ) {

        stockClass =
            "out";


        stockText =
            "Out of Stock";


    } else if (
        stock <=
        10
    ) {

        stockClass =
            "low";


        stockText =
            `${stock} left`;

    }


    const imageHTML =
        product.image_url
            ? `

                <img
                    src="${escapeHtml(
                        product.image_url
                    )}"
                    alt="${escapeHtml(
                        product.name
                    )}"
                    loading="lazy"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                >

                <div
                    class="product-no-image"
                    style="display:none;"
                >
                    ${escapeHtml(
                        product.icon ||
                        "🥤"
                    )}
                </div>

              `
            : `

                <div class="product-no-image">

                    ${escapeHtml(
                        product.icon ||
                        "🥤"
                    )}

                </div>

              `;


    const statusHTML =
        product.is_active
            ? `
                <span
                    class="product-status active"
                >
                    ACTIVE
                </span>
              `
            : `
                <span
                    class="product-status inactive"
                >
                    INACTIVE
                </span>
              `;


    const actionHTML =
        product.is_active
            ? `

                <button
                    type="button"
                    class="edit-product-btn"
                    onclick="openProductModal('${product.id}')"
                >
                    ✏️ Edit
                </button>

                <button
                    type="button"
                    class="stock-product-btn"
                    onclick="quickStockUpdate('${product.id}')"
                >
                    📦 Stock
                </button>

                <button
                    type="button"
                    class="delete-product-btn"
                    onclick="deactivateProduct('${product.id}')"
                >
                    🗑️ Deactivate
                </button>

              `
            : `

                <button
                    type="button"
                    class="edit-product-btn"
                    onclick="openProductModal('${product.id}')"
                >
                    ✏️ Edit
                </button>

                <button
                    type="button"
                    class="activate-product-btn"
                    onclick="activateProduct('${product.id}')"
                >
                    ✅ Activate
                </button>

              `;


    const outOfStockHTML =
        stock <= 0
            ? `
                <div class="out-of-stock-label">
                    🚫 OUT OF STOCK
                </div>
              `
            : "";


    return `

        <div
            class="admin-product-card ${
                stock <= 0
                    ? "product-out-of-stock"
                    : ""
            } ${
                product.is_active
                    ? ""
                    : "product-inactive"
            }"
        >

            <div class="admin-product-image">

                ${imageHTML}


                <div
                    class="product-icon-badge"
                >
                    ${escapeHtml(
                        product.icon ||
                        "🥤"
                    )}
                </div>

            </div>


            <div class="admin-product-content">

                ${statusHTML}

                ${outOfStockHTML}


                <h3>
                    ${escapeHtml(
                        product.name
                    )}
                </h3>


                <div class="admin-product-pack">

                    ${escapeHtml(
                        product.pack
                    )}

                </div>


                <div class="admin-product-meta">

                    <div
                        class="admin-product-price"
                    >

                        ₹${Number(
                            product.price ||
                            0
                        ).toFixed(2)}

                    </div>


                    <span
                        class="stock-badge ${stockClass}"
                    >

                        ${escapeHtml(
                            stockText
                        )}

                    </span>

                </div>


                <div class="admin-product-actions">

                    ${actionHTML}

                </div>

            </div>

        </div>

    `;
}

/* =====================================================
   QUICK STOCK UPDATE
   CUSTOM INPUT DIALOG
===================================================== */

async function quickStockUpdate(productId) {

    try {

        const numericProductId =
            Number(productId);

        if (
            !Number.isInteger(numericProductId) ||
            numericProductId <= 0
        ) {

            alert(
                "Invalid product ID."
            );

            return;
        }


        const product =
            allProducts.find(function(item) {

                return Number(item.id) ===
                    numericProductId;

            });


        if (!product) {

            alert(
                "Product not found."
            );

            return;
        }


        const currentStock =
            Number(product.stock || 0);


        openAdminInputDialog(

            "Update Stock",

            `Enter new stock for "${product.name}":`,

            String(currentStock),

            async function(newStock) {

                const stockValue =
                    Number(
                        String(newStock || "").trim()
                    );


                if (
                    !Number.isInteger(stockValue) ||
                    stockValue < 0
                ) {

                    alert(
                        "Invalid stock.\n\n" +
                        "Please enter a whole number like 0, 10, 50, 100."
                    );

                    return;
                }


                await updateProductStock(

                    numericProductId,

                    stockValue

                );

            }

        );

    } catch (error) {

        console.error(
            "Quick stock update error:",
            error
        );


        alert(
            "Something went wrong.\n\n" +
            error.message
        );

    }

}

/* =====================================================
   CENTRAL STOCK UPDATE
===================================================== */

async function updateProductStock(
    productId,
    stock
) {

    const numericProductId =
        Number(
            productId
        );


    const numericStock =
        Number(
            stock
        );


    if (
        !Number.isInteger(
            numericProductId
        ) ||
        numericProductId <= 0
    ) {

        alert(
            "Invalid product ID."
        );


        return false;
    }


    if (
        !Number.isInteger(
            numericStock
        ) ||
        numericStock < 0
    ) {

        alert(
            "Invalid stock value."
        );


        return false;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("products")

            .update({

                stock:
                    numericStock

            })

            .eq(
                "id",
                numericProductId
            )

            .select(
                "id, stock"
            )

            .maybeSingle();


        if (error) {

            console.error(
                "Stock update error:",
                error
            );


            alert(
                "Stock update failed.\n\n" +
                error.message
            );


            return false;
        }


        if (!data) {

            alert(
                "Stock update failed.\n\n" +
                "No product was updated."
            );


            return false;
        }


        console.log(
            "Stock updated:",
            data
        );


        alert(
            numericStock === 0
                ? "✅ Stock updated. Product is now Out of Stock."
                : "✅ Stock updated successfully."
        );


        await loadAdminProducts();


        return true;


    } catch (error) {

        console.error(
            "Stock update exception:",
            error
        );


        alert(
            "Something went wrong.\n\n" +
            error.message
        );


        return false;

    }
}


/* =====================================================
   DEACTIVATE PRODUCT
   CUSTOM CONFIRM DIALOG
===================================================== */

async function deactivateProduct(productId) {

    const numericProductId =
        Number(productId);


    if (
        !Number.isInteger(numericProductId) ||
        numericProductId <= 0
    ) {

        alert(
            "Invalid product ID."
        );

        return;
    }


    openAdminConfirmDialog(

        "Deactivate Product",

        "Are you sure you want to deactivate this product?",

        async function() {

            try {

                const {
                    data,
                    error
                } = await supabaseClient

                    .from("products")

                    .update({

                        is_active: false

                    })

                    .eq(
                        "id",
                        numericProductId
                    )

                    .select()
                    .maybeSingle();


                if (error) {

                    console.error(
                        "Deactivate product error:",
                        error
                    );


                    alert(
                        "Product could not be deactivated.\n\n" +
                        error.message
                    );

                    return;
                }


                if (!data) {

                    alert(
                        "Product could not be updated."
                    );

                    return;
                }


                alert(
                    "Product deactivated successfully."
                );


                /*
                   Existing product refresh
                   yahan apne existing function ko
                   same rakho agar tumhare code mein
                   koi specific reload function hai.
                */

                await loadAdminProducts();

            } catch (error) {

                console.error(
                    "Deactivate product exception:",
                    error
                );


                alert(
                    "Something went wrong.\n\n" +
                    error.message
                );

            }

        }

    );

}

/* =====================================================
   ACTIVATE PRODUCT
===================================================== */

async function activateProduct(
    productId
) {

    const numericProductId =
        Number(
            productId
        );


    if (
        !Number.isInteger(
            numericProductId
        ) ||
        numericProductId <= 0
    ) {

        alert(
            "Invalid product ID."
        );


        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("products")

            .update({

                is_active:
                    true

            })

            .eq(
                "id",
                numericProductId
            )

            .select(
                "id, is_active"
            )

            .maybeSingle();


        if (error) {

            console.error(
                "Activate error:",
                error
            );


            alert(
                "Activate failed.\n\n" +
                error.message
            );


            return;
        }


        if (!data) {

            alert(
                "Activate failed.\n\n" +
                "No product was updated."
            );


            return;
        }


        alert(
            "✅ Product activated successfully."
        );


        await loadAdminProducts();


    } catch (error) {

        console.error(
            "Activate exception:",
            error
        );


        alert(
            "Something went wrong.\n\n" +
            error.message
        );

    }
}


/* =====================================================
   DISPLAY STOCK PRODUCTS
===================================================== */

function displayStockProducts(
    products
) {

    const container =
        document.getElementById(
            "stockContainer"
        );


    if (!container) {
        return;
    }


    if (!products.length) {

        container.innerHTML =
            `
            <div class="empty-product-box">

                <div>
                    📦
                </div>

                <h3>
                    No Products
                </h3>

                <p>
                    Add products to manage stock.
                </p>

            </div>
            `;


        return;
    }


    container.innerHTML =
        products
            .map(
                product => {

                    const stock =
                        Number(
                            product.stock || 0
                        );


                    let stockClass =
                        "";


                    let stockText =
                        String(
                            stock
                        );


                    if (
                        stock <=
                        0
                    ) {

                        stockClass =
                            "out";


                        stockText =
                            "OUT";


                    } else if (
                        stock <=
                        10
                    ) {

                        stockClass =
                            "low";


                        stockText =
                            `${stock} Low`;

                    } else {

                        stockText =
                            `${stock}`;

                    }


                    const productStatus =
                        product.is_active
                            ? "Active"
                            : "Inactive";


                    return `

                        <div
                            class="
                                stock-card
                                ${
                                    product.is_active
                                        ? ""
                                        : "stock-card-inactive"
                                }
                            "
                        >

                            <div
                                class="stock-product-info"
                            >

                                <div
                                    class="stock-product-icon"
                                >

                                    ${
                                        product.image_url
                                            ? `
                                                <img
                                                    src="${escapeHtml(
                                                        product.image_url
                                                    )}"
                                                    alt="${escapeHtml(
                                                        product.name
                                                    )}"
                                                >
                                              `
                                            : escapeHtml(
                                                product.icon ||
                                                "🥤"
                                            )
                                    }

                                </div>


                                <div>

                                    <h3>
                                        ${escapeHtml(
                                            product.name
                                        )}
                                    </h3>


                                    <p>
                                        ${escapeHtml(
                                            product.pack
                                        )}
                                    </p>


                                    <small>
                                        ${productStatus}
                                    </small>

                                </div>

                            </div>


                            <div
                                class="stock-update-area"
                            >

                                <span
                                    class="
                                        stock-badge
                                        ${stockClass}
                                    "
                                >
                                    ${escapeHtml(
                                        stockText
                                    )}
                                </span>


                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value="${stock}"
                                    id="stock-${product.id}"
                                >


                                <button
                                    type="button"
                                    onclick="updateStockFromField('${product.id}')"
                                >
                                    Update
                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");
}


/* =====================================================
   UPDATE STOCK FROM FIELD
===================================================== */

async function updateStockFromField(
    productId
) {

    const input =
        document.getElementById(
            `stock-${productId}`
        );


    if (!input) {

        alert(
            "Stock input not found."
        );


        return;
    }


    const stockValue =
        Number(
            String(
                input.value
            ).trim()
        );


    if (
        !Number.isInteger(
            stockValue
        ) ||
        stockValue < 0
    ) {

        alert(
            "Please enter a valid whole stock number."
        );


        return;
    }


    const numericProductId =
        Number(
            productId
        );


    if (
        !Number.isInteger(
            numericProductId
        ) ||
        numericProductId <= 0
    ) {

        alert(
            "Invalid product ID."
        );


        return;
    }


    await updateProductStock(
        numericProductId,
        stockValue
    );
}


/* =====================================================
   PRODUCT SEARCH
===================================================== */

function setupProductSearch() {

    const search =
        document.getElementById(
            "productSearch"
        );


    const filter =
        document.getElementById(
            "productStatusFilter"
        );


    if (search) {

        search.addEventListener(
            "input",
            function() {

                displayAdminProducts(
                    allProducts
                );

            }
        );

    }


    if (filter) {

        filter.addEventListener(
            "change",
            function() {

                displayAdminProducts(
                    allProducts
                );

            }
        );

    }
}


/* =====================================================
   STATUS FILTER
===================================================== */

function setupStatusFilter() {

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            function() {

                displayOrders(
                    allOrders
                );

            }
        );

    }
}


/* =====================================================
   TOTAL EARNINGS
===================================================== */

/*
   IMPORTANT:

   Earnings only count orders whose status is:
   "completed"

   Product earning =
   price × quantity

   Delivery charge is NOT added to product-wise
   earnings because this section is calculating
   product sales.
*/


async function calculateEarnings() {

    const totalEarningElement =
        document.getElementById(
            "totalEarning"
        );


    const totalOrdersElement =
        document.getElementById(
            "earningTotalOrders"
        );


    const totalQuantityElement =
        document.getElementById(
            "earningTotalQuantity"
        );


    const tableBody =
        document.getElementById(
            "earningsTableBody"
        );


    const dateLabel =
        document.getElementById(
            "earningDateLabel"
        );


    if (
        !totalEarningElement ||
        !totalOrdersElement ||
        !totalQuantityElement ||
        !tableBody
    ) {

        return;
    }


    /* =================================================
       GET DATES
    ================================================= */

    const fromDate =
        document.getElementById(
            "earningFromDate"
        )?.value ||
        "";


    const toDate =
        document.getElementById(
            "earningToDate"
        )?.value ||
        "";


    /* =================================================
       DATE VALIDATION
    ================================================= */

    if (
        fromDate &&
        toDate &&
        fromDate >
        toDate
    ) {

        alert(
            "From Date cannot be greater than To Date."
        );


        return;
    }


    /* =================================================
       LOADING STATE
    ================================================= */

    tableBody.innerHTML =
        `
        <tr>

            <td
                colspan="4"
                class="earnings-empty"
            >
                ⏳ Calculating earnings...
            </td>

        </tr>
        `;


    totalEarningElement.textContent =
        "₹0.00";


    totalOrdersElement.textContent =
        "0";


    totalQuantityElement.textContent =
        "0";


    try {

        /* =================================================
           COMPLETED ORDERS FROM SUPABASE
        ================================================= */

        let completedOrdersQuery =
            supabaseClient

                .from("orders")

                .select(`
                    id,
                    order_no,
                    subtotal,
                    delivery_charge,
                    total,
                    status,
                    created_at
                `)

                .eq(
                    "status",
                    "completed"
                );


        /*
           From date:
           Include the complete selected day.
        */

        if (fromDate) {

            completedOrdersQuery =
                completedOrdersQuery.gte(
                    "created_at",
                    `${fromDate}T00:00:00`
                );

        }


        /*
           To date:
           Use next day at 00:00 and "<"
           so the selected To Date is fully included.
        */

        if (toDate) {

            const nextDay =
                getNextDate(
                    toDate
                );


            completedOrdersQuery =
                completedOrdersQuery.lt(
                    "created_at",
                    `${nextDay}T00:00:00`
                );

        }


        const {
            data: completedOrders,
            error: ordersError
        } = await completedOrdersQuery;


        if (ordersError) {

            console.error(
                "Earnings orders error:",
                ordersError
            );


            throw ordersError;
        }


        const orders =
            completedOrders || [];


        /* =================================================
           NO COMPLETED ORDERS
        ================================================= */

        if (!orders.length) {

            totalEarningElement.textContent =
                "₹0.00";


            totalOrdersElement.textContent =
                "0";


            totalQuantityElement.textContent =
                "0";


            tableBody.innerHTML =
                `
                <tr>

                    <td
                        colspan="4"
                        class="earnings-empty"
                    >
                        📦 No completed orders found
                        for the selected date range.
                    </td>

                </tr>
                `;


            updateEarningsDateLabel(
                fromDate,
                toDate,
                dateLabel
            );


            return;
        }


        /* =================================================
           GET ORDER IDS
        ================================================= */

        const orderIds =
            orders.map(
                order =>
                    order.id
            );


        /* =================================================
           GET ORDER ITEMS
        ================================================= */

        const {
            data: orderItems,
            error: itemsError
        } = await supabaseClient

            .from("order_items")

            .select(`
                order_id,
                product_name,
                pack,
                price,
                quantity,
                line_total
            `)

            .in(
                "order_id",
                orderIds
            );


        if (itemsError) {

            console.error(
                "Earnings items error:",
                itemsError
            );


            throw itemsError;
        }


        const items =
            orderItems || [];


        /* =================================================
           CALCULATE TOTALS
        ================================================= */

        let totalEarning =
            0;


        let totalQuantity =
            0;


        /*
           Product-wise data

           Key is:
           product name + price

           This keeps different prices
           separately visible.
        */

        const productMap =
            new Map();


        items.forEach(
            item => {

                const price =
                    Number(
                        item.price || 0
                    );


                const quantity =
                    Number(
                        item.quantity || 0
                    );


                const lineTotal =
                    Number(
                        item.line_total ||
                        (
                            price *
                            quantity
                        )
                    );


                totalEarning +=
                    lineTotal;


                totalQuantity +=
                    quantity;


                const productName =
                    String(
                        item.product_name ||
                        "Unknown Product"
                    );


                const pack =
                    String(
                        item.pack ||
                        ""
                    );


                const key =
                    productName +
                    "||" +
                    price;


                if (
                    !productMap.has(
                        key
                    )
                ) {

                    productMap.set(
                        key,
                        {
                            productName:
                                productName,

                            pack:
                                pack,

                            price:
                                price,

                            quantity:
                                0,

                            earning:
                                0
                        }
                    );

                }


                const productData =
                    productMap.get(
                        key
                    );


                productData.quantity +=
                    quantity;


                productData.earning +=
                    lineTotal;

            }
        );


        /* =================================================
           DISPLAY SUMMARY
        ================================================= */

        totalEarningElement.textContent =
            formatCurrency(
                totalEarning
            );


        totalOrdersElement.textContent =
            orders.length;


        totalQuantityElement.textContent =
            totalQuantity;


        updateEarningsDateLabel(
            fromDate,
            toDate,
            dateLabel
        );


        /* =================================================
           PRODUCT DATA ARRAY
        ================================================= */

        const productRows =
            Array.from(
                productMap.values()
            );


        /*
           Sort by highest earning first.
        */

        productRows.sort(
            (
                first,
                second
            ) =>
                second.earning -
                first.earning
        );


        /* =================================================
           NO ITEMS
        ================================================= */

        if (!productRows.length) {

            tableBody.innerHTML =
                `
                <tr>

                    <td
                        colspan="4"
                        class="earnings-empty"
                    >
                        🛍️ Completed orders exist,
                        but no order items were found.
                    </td>

                </tr>
                `;


            return;
        }


        /* =================================================
           TABLE ROWS
        ================================================= */

        tableBody.innerHTML =
            productRows
                .map(
                    product => `

                        <tr>

                            <td>

                                <strong>
                                    ${escapeHtml(
                                        product.productName
                                    )}
                                </strong>

                                ${
                                    product.pack
                                        ? `
                                            <br>

                                            <small>
                                                ${escapeHtml(
                                                    product.pack
                                                )}
                                            </small>
                                          `
                                        : ""
                                }

                            </td>


                            <td>

                                ${formatCurrency(
                                    product.price
                                )}

                            </td>


                            <td>

                                ${product.quantity}

                            </td>


                            <td>

                                ${formatCurrency(
                                    product.earning
                                )}

                            </td>

                        </tr>

                    `
                )
                .join("");


        /* =================================================
           GRAND TOTAL ROW
        ================================================= */

        tableBody.innerHTML +=
            `

            <tr
                class="earnings-total-row"
            >

                <td>
                    Grand Total
                </td>

                <td>
                    -
                </td>

                <td>
                    ${totalQuantity}
                </td>

                <td>
                    ${formatCurrency(
                        totalEarning
                    )}
                </td>

            </tr>

            `;


    } catch (error) {

        console.error(
            "Calculate earnings error:",
            error
        );


        totalEarningElement.textContent =
            "₹0.00";


        totalOrdersElement.textContent =
            "0";


        totalQuantityElement.textContent =
            "0";


        tableBody.innerHTML =
            `
            <tr>

                <td
                    colspan="4"
                    class="earnings-empty"
                >

                    ❌ Could not calculate earnings.

                    <br><br>

                    ${escapeHtml(
                        error.message
                    )}

                </td>

            </tr>
            `;

    }
}


/* =====================================================
   GET NEXT DATE
===================================================== */

function getNextDate(
    dateString
) {

    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    date.setDate(
        date.getDate() +
        1
    );


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );
}


/* =====================================================
   FORMAT CURRENCY
===================================================== */

function formatCurrency(
    amount
) {

    return (
        "₹" +
        Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2
            }
        )
    );
}


/* =====================================================
   EARNINGS DATE LABEL
===================================================== */

function updateEarningsDateLabel(
    fromDate,
    toDate,
    element
) {

    if (!element) {
        return;
    }


    if (
        !fromDate &&
        !toDate
    ) {

        element.textContent =
            "All completed orders";


        return;
    }


    if (
        fromDate &&
        toDate
    ) {

        element.textContent =
            `Completed orders from ${formatShortDate(fromDate)} to ${formatShortDate(toDate)}`;


        return;
    }


    if (fromDate) {

        element.textContent =
            `Completed orders from ${formatShortDate(fromDate)}`;


        return;
    }


    if (toDate) {

        element.textContent =
            `Completed orders up to ${formatShortDate(toDate)}`;

    }
}


/* =====================================================
   FORMAT SHORT DATE
===================================================== */

function formatShortDate(
    dateString
) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"
        }
    );
}


/* =====================================================
   RESET EARNINGS
===================================================== */

async function resetEarnings() {

    const fromInput =
        document.getElementById(
            "earningFromDate"
        );


    const toInput =
        document.getElementById(
            "earningToDate"
        );


    if (fromInput) {

        fromInput.value =
            "";

    }


    if (toInput) {

        toInput.value =
            "";

    }


    await calculateEarnings();
}


/* =====================================================
   OUTSIDE CLICK - MODALS
===================================================== */

document.addEventListener(
    "click",
    function(event) {

        const orderModal =
            document.getElementById(
                "orderModal"
            );


        if (
            orderModal &&
            event.target ===
                orderModal
        ) {

            closeOrderModal();

        }


        const productModal =
            document.getElementById(
                "productModal"
            );


        if (
            productModal &&
            event.target ===
                productModal
        ) {

            closeProductModal();

        }

    }
);


/* =====================================================
   ESC KEY - MODALS
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        closeOrderModal();

        closeProductModal();

        closeAdminSidebar();

    }
);


/* =====================================================
   ADMIN LOGOUT
===================================================== */

async function adminLogout() {

    const adminToken =
        localStorage.getItem("adminToken");

    try {

        if (adminToken) {

            await fetch(
                `${BACKEND_URL}/api/admin/logout`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${adminToken}`
                    }
                }
            );

        }

    } catch (error) {

        console.error(
            "Admin logout error:",
            error
        );

    }

    // Admin token remove
    localStorage.removeItem(
        "adminToken"
    );

    // Admin user remove
    localStorage.removeItem(
        "adminUser"
    );

    // Login page par wapas
    window.location.href =
        "login.html";
}

/* =====================================================
   PRINT CARTON STICKER
===================================================== */

async function printCartonSticker(
    orderId
) {

    const order =
        allOrders.find(
            item =>
                String(item.id) ===
                String(orderId)
        );


    if (!order) {

        alert(
            "Order details not found."
        );

        return;
    }


    try {

        /* =========================================
           GET BILL + SAME QR TOKEN
        ========================================= */

       const adminToken =
    localStorage.getItem(
        "adminToken"
    );


if (!adminToken) {

    alert(
        "Admin session missing. Please login again."
    );

    return;

}


const billResponse =
    await fetch(
        `${BACKEND_URL}/api/admin/bill/${orderId}`,
        {
            method:
                "GET",

            headers: {

                "Authorization":
                    `Bearer ${adminToken}`

            }

        }
    );


        const billResult =
            await billResponse.json();


        if (
            !billResponse.ok ||
            !billResult.success ||
            !billResult.bill ||
            !billResult.bill.qr_token
        ) {

            alert(
                "QR token could not be loaded.\n\n" +
                "Please generate the bill first."
            );

            return;
        }


        const qrToken =
            billResult.bill.qr_token;


        /* =========================================
           CUSTOMER
        ========================================= */

        const {
            data: customer,
            error: customerError
        } = await supabaseClient

            .from("profiles")

            .select(`
                full_name,
                phone
            `)

            .eq(
                "id",
                order.customer_id
            )

            .maybeSingle();


        if (customerError) {

            console.error(
                "Sticker customer error:",
                customerError
            );

        }


        /* =========================================
           ADDRESS
        ========================================= */

        let address = null;


        if (order.address_id) {

            const {
                data: addressData
            } = await supabaseClient

                .from("addresses")

                .select(`
                    address_line,
                    city,
                    state,
                    pincode
                `)

                .eq(
                    "id",
                    order.address_id
                )

                .maybeSingle();


            address =
                addressData;

        }


        /* =========================================
           QR DATA
           SAME FORMAT AS BILL PDF QR
        ========================================= */

        const qrData =
            JSON.stringify({

                orderId:
                    order.id,

                orderNo:
                    order.order_no,

                qrToken:
                    qrToken

            });


        /*
         * Safely convert QR data into a JavaScript
         * string for the print window.
         */
        const qrDataForScript =
            JSON.stringify(qrData)
                .replace(
                    /</g,
                    "\\u003c"
                )
                .replace(
                    />/g,
                    "\\u003e"
                )
                .replace(
                    /&/g,
                    "\\u0026"
                );


        /* =========================================
           CREATE PRINT WINDOW
        ========================================= */

        const printWindow =
            window.open(
                "",
                "_blank",
                "width=500,height=700"
            );


        if (!printWindow) {

            alert(
                "Please allow pop-ups for this website."
            );

            return;
        }


        printWindow.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    Carton Sticker - ${escapeHtml(
                        order.order_no
                    )}
                </title>


                <style>

                    * {
                        box-sizing: border-box;
                    }


                    body {

                        margin: 0;

                        padding: 20px;

                        background: #eeeeee;

                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;

                    }


                    .sticker {

                        width: 320px;

                        margin: 0 auto;

                        background: #ffffff;

                        border: 2px solid #111827;

                        border-radius: 12px;

                        padding: 16px;

                        text-align: center;

                    }


                    .company {

                        font-size: 20px;

                        font-weight: 800;

                        color: #111827;

                        margin-bottom: 3px;

                    }


                    .subtitle {

                        font-size: 10px;

                        color: #6b7280;

                        letter-spacing: 1px;

                        margin-bottom: 12px;

                    }


                    .order-box {

                        border: 1px dashed #9ca3af;

                        border-radius: 8px;

                        padding: 9px;

                        margin-bottom: 12px;

                    }


                    .order-label {

                        font-size: 10px;

                        color: #6b7280;

                        text-transform: uppercase;

                    }


                    .order-number {

                        font-size: 18px;

                        font-weight: 800;

                        margin-top: 3px;

                        color: #111827;

                    }


                    .customer {

                        text-align: left;

                        border-top: 1px solid #e5e7eb;

                        padding-top: 10px;

                    }


                    .row {

                        display: flex;

                        justify-content: space-between;

                        gap: 10px;

                        margin-bottom: 6px;

                        font-size: 11px;

                    }


                    .row span:first-child {

                        color: #6b7280;

                        font-weight: 600;

                    }


                    .row strong {

                        color: #111827;

                        text-align: right;

                    }


                    .address {

                        font-size: 10px;

                        line-height: 1.4;

                        color: #374151;

                        margin-top: 8px;

                        padding: 8px;

                        background: #f9fafb;

                        border-radius: 7px;

                    }


                    .amount {

                        margin-top: 10px;

                        padding: 9px;

                        border-radius: 8px;

                        background: #f3f4f6;

                        display: flex;

                        justify-content: space-between;

                        align-items: center;

                    }


                    .amount span {

                        font-size: 11px;

                        font-weight: 600;

                    }


                    .amount strong {

                        font-size: 17px;

                    }


                    .qr-section {

                        margin-top: 14px;

                        padding-top: 12px;

                        border-top: 1px dashed #9ca3af;

                    }


                    #qrCode {

                        width: 130px;

                        height: 130px;

                        margin: 8px auto;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                    }


                    #qrCode img {

                        width: 130px;

                        height: 130px;

                    }


                    .scan-text {

                        font-size: 9px;

                        color: #6b7280;

                    }


                    .footer {

                        margin-top: 10px;

                        font-size: 9px;

                        color: #6b7280;

                    }


                    @media print {

                        body {

                            padding: 0;

                            background: white;

                        }


                        .sticker {

                            margin: 0;

                            width: 320px;

                            border: 2px solid #111827;

                            page-break-inside: avoid;

                        }

                    }

                </style>

            </head>


            <body>


                <div class="sticker">


                    <div class="company">

                        📦 Pooja Paper Solution

                    </div>


                    <div class="subtitle">

                        CARTON / PARCEL LABEL

                    </div>


                    <div class="order-box">

                        <div class="order-label">

                            Order Number

                        </div>


                        <div class="order-number">

                            ${escapeHtml(
                                order.order_no
                            )}

                        </div>

                    </div>


                    <div class="customer">


                        <div class="row">

                            <span>
                                Customer
                            </span>

                            <strong>

                                ${escapeHtml(
                                    customer?.full_name ||
                                    "-"
                                )}

                            </strong>

                        </div>


                        <div class="row">

                            <span>
                                Phone
                            </span>

                            <strong>

                                ${escapeHtml(
                                    customer?.phone ||
                                    "-"
                                )}

                            </strong>

                        </div>


                        <div class="address">

                            <strong>
                                Deliver To
                            </strong>

                            <br>

                            ${escapeHtml(
                                address?.address_line ||
                                "-"
                            )}

                            <br>

                            ${escapeHtml(
                                address?.city ||
                                ""
                            )}

                            ,

                            ${escapeHtml(
                                address?.state ||
                                ""
                            )}

                            -

                            ${escapeHtml(
                                address?.pincode ||
                                ""
                            )}

                        </div>


                        <div class="amount">

                            <span>
                                COD / Total
                            </span>

                            <strong>

                                ₹${Number(
                                    order.total || 0
                                ).toFixed(2)}

                            </strong>

                        </div>


                    </div>


                    <div class="qr-section">

                        <strong>
                            Scan Order QR
                        </strong>


                        <div id="qrCode"></div>


                        <div class="scan-text">

                            Order verification

                        </div>

                    </div>


                    <div class="footer">

                        Pooja Paper Solution

                    </div>


                </div>


                <script
                    src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js">
                <\/script>


                <script>

                    window.onload =
                        function() {

                            const qr =
                                document.getElementById(
                                    "qrCode"
                                );


                            if (
                                typeof QRCode !==
                                "undefined"
                            ) {

                                new QRCode(
                                    qr,
                                    {

                                        text:
                                            ${qrDataForScript},

                                        width:
                                            130,

                                        height:
                                            130,

                                        correctLevel:
                                            QRCode.CorrectLevel.H

                                    }
                                );

                            }


                            setTimeout(
                                function() {

                                    window.print();

                                },
                                700
                            );

                        };

                <\/script>


            </body>

            </html>

        `);


        printWindow.document.close();


    } catch (error) {

        console.error(
            "Print sticker error:",
            error
        );


        alert(
            "Sticker could not be prepared.\n\n" +
            error.message
        );

    }
}
/* =====================================================
   ADMIN BACK TO TOP
===================================================== */

function scrollAdminToTop() {

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
   REFRESH ADMIN PANEL
===================================================== */

async function refreshAdminPanel() {

    await loadOrders();

    await loadAdminProducts();

}


/* =====================================================
   START ADMIN PANEL
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "Pooja Paper Solution Admin Panel started."
        );


        setupStatusFilter();

        setupProductSearch();

        setupProductImagePreview();


        await loadOrders();

        await loadAdminProducts();


    }
);