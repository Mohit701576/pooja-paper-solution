/* =====================================================
   POOJA PAPER SOLUTION
   DELIVERY BOY PANEL
===================================================== */


/* =====================================================
   CONFIG
===================================================== */

const BACKEND_URL =
    "http://localhost:3000";


/* =====================================================
   LOGIN PROTECTION
===================================================== */

if (
    localStorage.getItem(
        "deliveryLoggedIn"
    ) !== "true"
) {

    window.location.replace(
        "login.html"
    );

}


/* =====================================================
   ELEMENTS
===================================================== */

const orderIdInput =
    document.getElementById(
        "orderId"
    );

const qrTokenInput =
    document.getElementById(
        "qrToken"
    );

const otpInput =
    document.getElementById(
        "deliveryOTP"
    );

const verifyBtn =
    document.getElementById(
        "verifyBtn"
    );

const deliveryMessage =
    document.getElementById(
        "deliveryMessage"
    );

const successBox =
    document.getElementById(
        "successBox"
    );

const completedOrderInfo =
    document.getElementById(
        "completedOrderInfo"
    );

const startDeliveryBtn =
    document.getElementById(
        "startDeliveryBtn"
    );

const qrReader =
    document.getElementById(
        "qr-reader"
    );

const scanBtn =
    document.getElementById(
        "scanBtn"
    );

const stopScanBtn =
    document.getElementById(
        "stopScanBtn"
    );

const galleryScanBtn =
    document.getElementById(
        "galleryScanBtn"
    );

const galleryQRInput =
    document.getElementById(
        "galleryQRInput"
    );


/* =====================================================
   QR VARIABLES
===================================================== */

let html5QrCode = null;

let qrScannerRunning = false;

let scannedOrderNo = "";


/* =====================================================
   OTP INPUT
===================================================== */

if (otpInput) {

    otpInput.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .slice(
                        0,
                        6
                    );

        }
    );

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    message,
    type = "error"
) {

    if (!deliveryMessage) {
        return;
    }

    deliveryMessage.textContent =
        message;

    deliveryMessage.className =
        "delivery-message " +
        type;

    deliveryMessage.style.display =
        "block";

}


function hideMessage() {

    if (!deliveryMessage) {
        return;
    }

    deliveryMessage.style.display =
        "none";

}


/* =====================================================
   START CAMERA QR SCANNER
===================================================== */

async function startQRScanner() {

    hideMessage();

    if (qrScannerRunning) {
        return;
    }

    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        showMessage(
            "QR scanner library could not be loaded."
        );

        return;
    }

    if (!qrReader) {

        showMessage(
            "QR scanner area is missing."
        );

        return;
    }


    qrReader.style.display =
        "block";


    if (scanBtn) {

        scanBtn.style.display =
            "none";

    }


    if (stopScanBtn) {

        stopScanBtn.style.display =
            "flex";

    }


    html5QrCode =
        new Html5Qrcode(
            "qr-reader"
        );


    try {

        await html5QrCode.start(

            {
                facingMode:
                    "environment"
            },

            {
                fps: 10,

                qrbox: {
                    width: 250,
                    height: 250
                },

                aspectRatio: 1.0
            },

            onQRCodeSuccess,

            onQRCodeError

        );


        qrScannerRunning =
            true;


    } catch (error) {

        console.error(
            "QR SCANNER ERROR:",
            error
        );


        showMessage(
            "Could not open the camera. Please allow camera permission."
        );


        qrReader.style.display =
            "none";


        if (scanBtn) {

            scanBtn.style.display =
                "flex";

        }


        if (stopScanBtn) {

            stopScanBtn.style.display =
                "none";

        }


        html5QrCode =
            null;

        qrScannerRunning =
            false;

    }

}


/* =====================================================
   PROCESS SCANNED QR
===================================================== */

function processScannedQR(
    decodedText
) {

    console.log(
        "QR SCANNED:",
        decodedText
    );


    try {

        const qrData =
            JSON.parse(
                decodedText
            );


        /*
           CHECK BILL QR DATA
        */

        if (
            !qrData.orderId ||
            !qrData.orderNo ||
            !qrData.qrToken
        ) {

            showMessage(
                "Invalid Pooja Paper Solution bill QR."
            );

            return;
        }


        /*
           FILL ORDER DATA
        */

        if (orderIdInput) {

            orderIdInput.value =
                qrData.orderId;

        }


        if (qrTokenInput) {

            qrTokenInput.value =
                qrData.qrToken;

        }


        scannedOrderNo =
            qrData.orderNo;


        /*
           SUCCESS MESSAGE
        */

        showMessage(
            `✅ Bill verified — Order ${qrData.orderNo}`,
            "success"
        );


        /*
           ENABLE START DELIVERY
        */

        if (startDeliveryBtn) {

            startDeliveryBtn.disabled =
                false;


            startDeliveryBtn.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "center"
            });

        }


        console.log(
            "ORDER ID:",
            qrData.orderId
        );


        console.log(
            "ORDER NO:",
            qrData.orderNo
        );


        console.log(
            "QR TOKEN:",
            qrData.qrToken
        );


    } catch (error) {

        console.error(
            "QR DATA ERROR:",
            error
        );


        showMessage(
            "This QR code is not a valid Pooja Paper Solution bill."
        );

    }

}


/* =====================================================
   CAMERA QR SUCCESS
===================================================== */

async function onQRCodeSuccess(
    decodedText
) {

    /*
       Process scanned QR
    */

    processScannedQR(
        decodedText
    );


    /*
       Stop camera after successful scan
    */

    await stopQRScanner();

}


/* =====================================================
   QR ERROR
===================================================== */

function onQRCodeError(
    errorMessage
) {

    /*
       Scanner continuously calls this
       while searching for a QR.

       Therefore intentionally empty.
    */

}


/* =====================================================
   OPEN GALLERY
===================================================== */

function openGalleryScanner() {

    hideMessage();


    if (!galleryQRInput) {

        showMessage(
            "Gallery scanner is not available."
        );

        return;
    }


    /*
       Reset first.

       This allows the same image
       to be selected again.
    */

    galleryQRInput.value =
        "";


    galleryQRInput.click();

}


/* =====================================================
   SCAN QR FROM GALLERY
===================================================== */

async function scanQRFromGallery(
    file
) {

    if (!file) {
        return;
    }


    /*
       Check QR library
    */

    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        showMessage(
            "QR scanner library could not be loaded."
        );

        return;
    }


    /*
       Stop camera if it is running
    */

    if (qrScannerRunning) {

        await stopQRScanner();

    }


    /*
       Disable gallery button
    */

    if (galleryScanBtn) {

        galleryScanBtn.disabled =
            true;


        galleryScanBtn.textContent =
            "⏳ Scanning Image...";

    }


    try {

        /*
           Create temporary scanner
        */

        const galleryScanner =
            new Html5Qrcode(
                "qr-reader"
            );


        /*
           Scan selected image
        */

        const decodedText =
            await galleryScanner.scanFile(
                file,
                true
            );


        console.log(
            "GALLERY QR SCANNED:",
            decodedText
        );


        /*
           Process QR data
        */

        processScannedQR(
            decodedText
        );


        /*
           Clear temporary scanner
        */

        try {

            await galleryScanner.clear();

        } catch (clearError) {

            console.warn(
                "GALLERY SCANNER CLEAR WARNING:",
                clearError
            );

        }


    } catch (error) {

        console.error(
            "GALLERY QR SCAN ERROR:",
            error
        );


        showMessage(
            "Could not find a valid QR code in this image."
        );


    } finally {

        /*
           Enable gallery button
        */

        if (galleryScanBtn) {

            galleryScanBtn.disabled =
                false;


            galleryScanBtn.textContent =
                "🖼️ Scan from Gallery";

        }


        /*
           Reset file input
        */

        if (galleryQRInput) {

            galleryQRInput.value =
                "";

        }

    }

}


/* =====================================================
   GALLERY FILE SELECTED
===================================================== */

if (galleryQRInput) {

    galleryQRInput.addEventListener(
        "change",
        async function () {

            const file =
                this.files &&
                this.files[0];


            if (!file) {
                return;
            }


            hideMessage();


            /*
               Make sure selected file
               is an image.
            */

            if (
                !file.type ||
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showMessage(
                    "Please select an image containing the bill QR code."
                );


                this.value =
                    "";


                return;

            }


            /*
               Start gallery scan
            */

            await scanQRFromGallery(
                file
            );

        }
    );

}


/* =====================================================
   STOP CAMERA QR SCANNER
===================================================== */

async function stopQRScanner() {

    /*
       If scanner does not exist
    */

    if (!html5QrCode) {

        if (qrReader) {

            qrReader.style.display =
                "none";

        }


        if (scanBtn) {

            scanBtn.style.display =
                "flex";

        }


        if (stopScanBtn) {

            stopScanBtn.style.display =
                "none";

        }


        qrScannerRunning =
            false;


        return;

    }


    try {

        /*
           Stop camera
        */

        if (
            qrScannerRunning
        ) {

            await html5QrCode.stop();

        }


        /*
           Clear scanner
        */

        await html5QrCode.clear();


    } catch (error) {

        console.error(
            "STOP QR ERROR:",
            error
        );

    }


    /*
       Reset variables
    */

    html5QrCode =
        null;


    qrScannerRunning =
        false;


    /*
       Hide reader
    */

    if (qrReader) {

        qrReader.style.display =
            "none";

    }


    /*
       Show camera scan button
    */

    if (scanBtn) {

        scanBtn.style.display =
            "flex";

    }


    /*
       Hide stop button
    */

    if (stopScanBtn) {

        stopScanBtn.style.display =
            "none";

    }

}


/* =====================================================
   START DELIVERY
===================================================== */

async function startDelivery() {

    hideMessage();


    const orderId =
        orderIdInput.value.trim();


    const qrToken =
        qrTokenInput.value.trim();


    /*
       CHECK ORDER ID
    */

    if (!orderId) {

        showMessage(
            "Please scan the customer's bill QR code first."
        );

        return;

    }


    /*
       CHECK QR TOKEN
    */

    if (!qrToken) {

        showMessage(
            "QR Token is missing."
        );

        return;

    }


    if (!startDeliveryBtn) {
        return;
    }


    /*
       DISABLE BUTTON
    */

    startDeliveryBtn.disabled =
        true;


    startDeliveryBtn.textContent =
        "⏳ Starting Delivery...";


    try {

        const response =
            await fetch(

                BACKEND_URL +
                "/api/delivery/start-delivery",

                {
                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

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


        console.log(
            "START DELIVERY RESPONSE:",
            result
        );


        /*
           CHECK RESPONSE
        */

        if (
            !response.ok ||
            !result.success
        ) {

            showMessage(

                result.message ||
                "Could not start delivery."

            );


            startDeliveryBtn.disabled =
                false;


            startDeliveryBtn.textContent =
                "🚚 Start Delivery";


            return;

        }


        /*
           ON THE WAY
        */

        showMessage(

            "🚚 Delivery started successfully. Order is now On the Way.",

            "success"

        );


        /*
           HIDE START BUTTON
        */

        startDeliveryBtn.style.display =
            "none";


        /*
           SHOW OTP SECTION
        */

        const otpSection =
            document.getElementById(
                "otpSection"
            );


        if (otpSection) {

            otpSection.style.display =
                "block";


            otpSection.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"

            });

        }


    } catch (error) {

        console.error(
            "START DELIVERY ERROR:",
            error
        );


        showMessage(

            "Could not connect to the backend server. Please check that the server is running."

        );


        startDeliveryBtn.disabled =
            false;


        startDeliveryBtn.textContent =
            "🚚 Start Delivery";

    }

}


/* =====================================================
   VERIFY DELIVERY
===================================================== */

async function verifyDelivery() {

    hideMessage();


    if (successBox) {

        successBox.style.display =
            "none";

    }


    const orderId =
        orderIdInput.value.trim();


    const qrToken =
        qrTokenInput.value.trim();


    const otp =
        otpInput.value.trim();


    /*
       CHECK ORDER ID
    */

    if (!orderId) {

        showMessage(
            "Please scan the customer's bill QR code."
        );

        return;

    }


    /*
       CHECK QR TOKEN
    */

    if (!qrToken) {

        showMessage(
            "QR Token is missing."
        );

        return;

    }


    /*
       CHECK OTP
    */

    if (
        !/^\d{6}$/.test(
            otp
        )
    ) {

        showMessage(
            "Please enter the 6-digit customer OTP."
        );


        otpInput.focus();


        return;

    }


    /*
       DISABLE VERIFY BUTTON
    */

    verifyBtn.disabled =
        true;


    verifyBtn.textContent =
        "⏳ Verifying Delivery...";


    try {

        const response =
            await fetch(

                BACKEND_URL +
                "/api/delivery/verify-otp",

                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            orderId:
                                orderId,

                            qrToken:
                                qrToken,

                            otp:
                                otp

                        })

                }

            );


        const result =
            await response.json();


        console.log(
            "DELIVERY VERIFY RESPONSE:",
            result
        );


        /*
           CHECK RESPONSE
        */

        if (
            !response.ok ||
            !result.success
        ) {

            showMessage(

                result.message ||
                "Delivery verification failed."

            );


            verifyBtn.disabled =
                false;


            verifyBtn.textContent =
                "✅ Complete Delivery";


            return;

        }


        /*
           SUCCESS
        */

        showMessage(

            "✅ Customer OTP verified. Delivery completed.",

            "success"

        );


        /*
           HIDE OTP SECTION
        */

        const otpSection =
            document.getElementById(
                "otpSection"
            );


        if (otpSection) {

            otpSection.style.display =
                "none";

        }


        /*
           SHOW SUCCESS BOX
        */

        if (successBox) {

            successBox.style.display =
                "block";

        }


        const completedOrder =
            result.order ||
            {};


        const finalOrderNo =
            completedOrder.order_no ||
            scannedOrderNo ||
            orderId;


        /*
           SHOW COMPLETED ORDER
        */

        if (completedOrderInfo) {

            completedOrderInfo.innerHTML =

                `
                    <div class="completed-info-row">

                        <span>
                            Order No.
                        </span>

                        <strong>
                            ${escapeHTML(
                                finalOrderNo
                            )}
                        </strong>

                    </div>


                    <div class="completed-info-row">

                        <span>
                            Status
                        </span>

                        <strong>
                            ✅ Completed
                        </strong>

                    </div>
                `;

        }


        /*
           DISABLE INPUTS
        */

        orderIdInput.disabled =
            true;


        qrTokenInput.disabled =
            true;


        otpInput.disabled =
            true;


        verifyBtn.style.display =
            "none";


    } catch (error) {

        console.error(
            "DELIVERY VERIFY ERROR:",
            error
        );


        showMessage(

            "Could not connect to the backend server. Please check that the server is running."

        );


        verifyBtn.disabled =
            false;


        verifyBtn.textContent =
            "✅ Complete Delivery";

    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value
    )

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
   RESET FORM
===================================================== */

async function resetDeliveryForm() {

    await stopQRScanner();


    /*
       CLEAR VALUES
    */

    orderIdInput.value =
        "";


    qrTokenInput.value =
        "";


    otpInput.value =
        "";


    scannedOrderNo =
        "";


    /*
       ENABLE INPUTS
    */

    orderIdInput.disabled =
        false;


    qrTokenInput.disabled =
        false;


    otpInput.disabled =
        false;


    /*
       RESET START DELIVERY BUTTON
    */

    if (startDeliveryBtn) {

        startDeliveryBtn.style.display =
            "flex";


        startDeliveryBtn.disabled =
            true;


        startDeliveryBtn.textContent =
            "🚚 Start Delivery";

    }


    /*
       RESET VERIFY BUTTON
    */

    verifyBtn.style.display =
        "block";


    verifyBtn.disabled =
        false;


    verifyBtn.textContent =
        "✅ Complete Delivery";


    /*
       HIDE OTP
    */

    const otpSection =
        document.getElementById(
            "otpSection"
        );


    if (otpSection) {

        otpSection.style.display =
            "none";

    }


    /*
       HIDE SUCCESS BOX
    */

    if (successBox) {

        successBox.style.display =
            "none";

    }


    /*
       HIDE MESSAGE
    */

    hideMessage();


    /*
       SCROLL TOP
    */

    window.scrollTo({

        top:
            0,

        behavior:
            "smooth"

    });

}


/* =====================================================
   LOGOUT
===================================================== */

function deliveryLogout() {

    localStorage.removeItem(
        "deliveryLoggedIn"
    );


    localStorage.removeItem(
        "deliveryUsername"
    );


    window.location.replace(
        "login.html"
    );

}

/* =========================================================
   COMPLETE DELIVERY BUTTON
   Opens second QR scanner only after user clicks Complete
========================================================= */

async function completeDeliveryStartScan() {

    deliveryStarted = true;

    document.getElementById(
        "deliveryActionButtons"
    ).style.display = "none";

    showMessage(
        "Please scan the SAME carton QR again.",
        "info"
    );

    await startStepAwareScanner();
}

function cancelDeliveryFlow() {

    stopQRScanner();

    deliveryStarted = false;

    document.getElementById(
        "deliveryActionButtons"
    ).style.display = "none";

    document.getElementById(
        "otpSection"
    ).classList.remove("show");

    showMessage(
        "Delivery flow cancelled.",
        "info"
    );
}

async function refreshDeliveryDashboard() {

    const button =
        document.querySelector(
            ".dashboard-refresh-btn"
        );

    if (button) {

        button.disabled = true;

        button.innerHTML =
            "⏳ Refreshing...";

    }


    try {

        /* ===============================
           REFRESH DASHBOARD STATS
        =============================== */

        await updateDashboardStats();


        /* ===============================
           REFRESH ON THE WAY ORDERS
        =============================== */

        await loadDeliveryOrders();


        /* ===============================
           SUCCESS
        =============================== */

        if (button) {

            button.innerHTML =
                "✅ Refreshed";

        }


        setTimeout(() => {

            if (button) {

                button.innerHTML =
                    "🔄 Refresh Dashboard";

            }

        }, 1500);

    }
    catch (error) {

        console.error(
            "Dashboard refresh error:",
            error
        );


        if (button) {

            button.innerHTML =
                "❌ Refresh Failed";

        }


        setTimeout(() => {

            if (button) {

                button.innerHTML =
                    "🔄 Refresh Dashboard";

            }

        }, 2000);

    }
    finally {

        if (button) {

            button.disabled = false;

        }

    }

}

/* =====================================================
   LOAD COMPLETED / CANCELLED HISTORY
===================================================== */

async function loadDeliveryHistory(status) {

    try {

        const response = await fetch(
            BACKEND_URL +
            "/api/delivery/history?status=" +
            encodeURIComponent(status)
        );

        const result = await response.json();

        console.log(
            "DELIVERY HISTORY:",
            status,
            result
        );

        if (
            !response.ok ||
            !result.success
        ) {

            console.error(
                "History load failed:",
                result.message
            );

            return [];

        }

        return Array.isArray(result.orders)
            ? result.orders
            : [];

    }
    catch (error) {

        console.error(
            "DELIVERY HISTORY ERROR:",
            error
        );

        return [];

    }

}


/* =====================================================
   LOAD CANCELLED ORDERS
===================================================== */

async function loadCancelledOrders() {

    const container =
        document.getElementById(
            "cancelledOrdersContainer"
        );

    if (container) {

        container.innerHTML = `
            <div class="loading-box">
                Loading cancelled orders...
            </div>
        `;

    }

    const orders =
        await loadDeliveryHistory(
            "cancelled"
        );

    console.log(
        "CANCELLED ORDERS:",
        orders
    );

    renderCancelledOrders(
        orders
    );

}


/* =====================================================
   RENDER CANCELLED ORDERS
===================================================== */

function renderCancelledOrders(
    orders
) {

    const container =
        document.getElementById(
            "cancelledOrdersContainer"
        );

    if (!container) {

        console.warn(
            "cancelledOrdersContainer not found."
        );

        return;

    }


    /* =========================================
       NO CANCELLED ORDERS
    ========================================= */

    if (
        !Array.isArray(orders) ||
        orders.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-orders-box">

                <div class="empty-icon">
                    🚫
                </div>

                <h3>
                    No Cancelled Orders
                </h3>

                <p>
                    There are no cancelled delivery orders.
                </p>

            </div>

        `;

        return;

    }


    /* =========================================
       RENDER ORDERS
    ========================================= */

    container.innerHTML = orders.map(
        function (order) {

            const orderNo =
                order.order_no ||
                order.id ||
                "N/A";


            const reason =
                order.cancelled_reason ||
                "No cancellation reason recorded.";


            const total =
                Number(
                    order.total || 0
                ).toFixed(2);


            const cancelledAt =
                order.cancelled_at
                    ? new Date(
                        order.cancelled_at
                    ).toLocaleString(
                        "en-IN",
                        {
                            dateStyle:
                                "medium",
                            timeStyle:
                                "short"
                        }
                    )
                    : "N/A";


            return `

                <div class="delivery-history-card cancelled-order-card">

                    <div class="history-card-header">

                        <div>

                            <span class="history-status cancelled">
                                ❌ Cancelled
                            </span>

                            <h3>
                                Order ${escapeHTML(orderNo)}
                            </h3>

                        </div>

                    </div>


                    <div class="history-card-details">

                        <div class="history-detail-row">

                            <span>
                                Order Total
                            </span>

                            <strong>
                                ₹${total}
                            </strong>

                        </div>


                        <div class="history-detail-row">

                            <span>
                                Cancelled At
                            </span>

                            <strong>
                                ${escapeHTML(cancelledAt)}
                            </strong>

                        </div>


                        <div class="cancellation-reason-box">

                            <strong>
                                Cancellation Reason
                            </strong>

                            <p>
                                ${escapeHTML(reason)}
                            </p>

                        </div>

                    </div>

                </div>

            `;

        }
    ).join("");

}


/* =====================================================
   LOAD COMPLETED ORDERS
===================================================== */

async function loadCompletedOrders() {

    const container =
        document.getElementById(
            "completedOrdersContainer"
        );

    if (container) {

        container.innerHTML = `
            <div class="loading-box">
                Loading completed orders...
            </div>
        `;

    }

    const orders =
        await loadDeliveryHistory(
            "completed"
        );

    console.log(
        "COMPLETED ORDERS:",
        orders
    );

    renderCompletedOrders(
        orders
    );

}