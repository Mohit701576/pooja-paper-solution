/* =====================================================
   POOJA PAPER SOLUTION
   COMPLETE BACKEND SERVER
===================================================== */


const express =
    require("express");

const cors =
    require("cors");

const dotenv =
    require("dotenv");

const {
    createClient
} =
    require("@supabase/supabase-js");

const PDFDocument =
    require("pdfkit");

const QRCode =
    require("qrcode");

const crypto =
    require("crypto");


/* =====================================================
   LOAD ENVIRONMENT
===================================================== */

dotenv.config();


/* =====================================================
   APP SETUP
===================================================== */

const app =
    express();


app.use(
    cors()
);


app.use(
    express.json()
);


/* =====================================================
   ENVIRONMENT VARIABLES
===================================================== */

const PORT =
    process.env.PORT || 3000;


const SUPABASE_URL =
    process.env.SUPABASE_URL;


const SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY;


/* =====================================================
   ADMIN CREDENTIALS
===================================================== */

const ADMIN_USERNAME =
    process.env.ADMIN_USERNAME;


const ADMIN_PASSWORD =
    process.env.ADMIN_PASSWORD;


/* =====================================================
   ADMIN SESSION SECRET
===================================================== */

/*
   IMPORTANT:

   Add this to .env:

   ADMIN_SESSION_SECRET=your-long-random-secret

   If not present, backend will create a temporary
   random secret when server starts.
*/

const ADMIN_SESSION_SECRET =
    process.env.ADMIN_SESSION_SECRET ||
    crypto.randomBytes(32).toString("hex");


/* =====================================================
   LOG SUPABASE URL
===================================================== */

console.log(
    "===================================="
);

console.log(
    "SUPABASE URL:"
);

console.log(
    SUPABASE_URL
);

console.log(
    "===================================="
);


/* =====================================================
   CHECK ENVIRONMENT
===================================================== */

if (!SUPABASE_URL) {

    console.error(
        "SUPABASE_URL is missing in .env"
    );

    process.exit(1);

}


if (!SUPABASE_SERVICE_ROLE_KEY) {

    console.error(
        "SUPABASE_SERVICE_ROLE_KEY is missing in .env"
    );

    process.exit(1);

}


if (!ADMIN_USERNAME) {

    console.error(
        "ADMIN_USERNAME is missing in .env"
    );

    process.exit(1);

}


if (!ADMIN_PASSWORD) {

    console.error(
        "ADMIN_PASSWORD is missing in .env"
    );

    process.exit(1);

}


/* =====================================================
   SUPABASE ADMIN CLIENT
===================================================== */

const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY
    );


/* =====================================================
   BASIC TEST ROUTE
===================================================== */

app.get(
    "/",
    function (req, res) {

        return res.json({

            success: true,

            message:
                "Pooja Paper Solution backend is running."

        });

    }
);


/* =====================================================
   ADMIN SESSION TOKEN
===================================================== */


/*
   Creates a signed token.

   We are NOT storing the admin password
   in localStorage.

   Frontend will only store this token.
*/

function createAdminToken() {

    const payload = {

        role:
            "admin",

        createdAt:
            Date.now(),

        expiresAt:
            Date.now() +
            (
                12 *
                60 *
                60 *
                1000
            )

    };


    const encodedPayload =
        Buffer
            .from(
                JSON.stringify(payload)
            )
            .toString(
                "base64url"
            );


    const signature =
        crypto
            .createHmac(
                "sha256",
                ADMIN_SESSION_SECRET
            )
            .update(
                encodedPayload
            )
            .digest(
                "base64url"
            );


    return (
        encodedPayload +
        "." +
        signature
    );

}


/* =====================================================
   VERIFY ADMIN TOKEN
===================================================== */

function verifyAdminToken(
    token
) {

    try {

        if (!token) {

            return null;

        }


        const parts =
            String(token).split(".");


        if (
            parts.length !== 2
        ) {

            return null;

        }


        const encodedPayload =
            parts[0];


        const receivedSignature =
            parts[1];


        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    ADMIN_SESSION_SECRET
                )
                .update(
                    encodedPayload
                )
                .digest(
                    "base64url"
                );


        const receivedBuffer =
            Buffer.from(
                receivedSignature
            );


        const expectedBuffer =
            Buffer.from(
                expectedSignature
            );


        if (
            receivedBuffer.length !==
            expectedBuffer.length
        ) {

            return null;

        }


        if (
            !crypto.timingSafeEqual(
                receivedBuffer,
                expectedBuffer
            )
        ) {

            return null;

        }


        const payload =
            JSON.parse(
                Buffer
                    .from(
                        encodedPayload,
                        "base64url"
                    )
                    .toString(
                        "utf8"
                    )
            );


        if (
            payload.role !==
            "admin"
        ) {

            return null;

        }


        if (
            !payload.expiresAt
        ) {

            return null;

        }


        if (
            Date.now() >
            Number(
                payload.expiresAt
            )
        ) {

            return null;

        }


        return payload;

    }

    catch (error) {

        console.error(
            "ADMIN TOKEN VERIFY ERROR:",
            error
        );

        return null;

    }

}


/* =====================================================
   ADMIN AUTH MIDDLEWARE
===================================================== */

function requireAdmin(
    req,
    res,
    next
) {

    try {

        const authHeader =
            String(
                req.headers.authorization ||
                ""
            ).trim();


        let token = "";


        if (
            authHeader
                .toLowerCase()
                .startsWith(
                    "bearer "
                )
        ) {

            token =
                authHeader
                    .slice(7)
                    .trim();

        }


        if (!token) {

            token =
                String(
                    req.headers["x-admin-token"] ||
                    ""
                ).trim();

        }


        const adminSession =
            verifyAdminToken(
                token
            );


        if (!adminSession) {

            return res.status(401).json({

                success: false,

                message:
                    "Admin session is missing or expired. Please login again."

            });

        }


        req.admin =
            adminSession;


        next();

    }

    catch (error) {

        console.error(
            "ADMIN AUTH MIDDLEWARE ERROR:",
            error
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid admin session."

        });

    }

}


/* =====================================================
   TEST ALL ORDERS
   BACKEND SERVICE ROLE TEST
===================================================== */

app.get(
    "/api/test-orders",
    async function (req, res) {

        try {

            const {
                data,
                error
            } =
                await supabase
                    .from("orders")
                    .select(
                        "id, order_no, status, customer_id, created_at"
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    )
                    .limit(10);


            console.log("");

            console.log(
                "========== TEST ORDERS =========="
            );

            console.log(
                "Orders:",
                data
            );

            console.log(
                "Error:",
                error
            );

            console.log(
                "================================="
            );


            if (error) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not fetch orders.",

                    error:
                        error.message

                });

            }


            return res.json({

                success: true,

                data:
                    data || []

            });

        }

        catch (error) {

            console.error(
                "Test orders error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Could not fetch orders.",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   TEST ONE ORDER
===================================================== */

app.get(
    "/api/test-order/:id",
    async function (req, res) {

        try {

            const orderId =
                req.params.id;


            const {
                data,
                error
            } =
                await supabase
                    .from("orders")
                    .select("*")
                    .eq(
                        "id",
                        orderId
                    )
                    .maybeSingle();


            return res.json({

                success:
                    !error,

                data:
                    data,

                error:
                    error

            });

        }

        catch (error) {

            console.error(
                "Test one order error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Test order request failed.",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   ADMIN LOGIN
===================================================== */

app.post(
    "/api/admin/login",
    async function (req, res) {

        try {

            const username =
                String(
                    req.body.username ||
                    ""
                ).trim();


            const password =
                String(
                    req.body.password ||
                    ""
                );


            if (
                !username ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Username and password are required."

                });

            }


            if (
                username !==
                ADMIN_USERNAME ||
                password !==
                ADMIN_PASSWORD
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid admin username or password."

                });

            }


            const adminToken =
                createAdminToken();


            console.log("");

            console.log(
                "===================================="
            );

            console.log(
                "ADMIN LOGIN SUCCESS"
            );

            console.log(
                "Username:",
                username
            );

            console.log(
                "===================================="
            );


            return res.json({

                success: true,

                message:
                    "Admin login successful.",

                token:
                    adminToken,

                expiresIn:
                    12 * 60 * 60 * 1000

            });

        }

        catch (error) {

            console.error(
                "ADMIN LOGIN ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Admin login failed."

            });

        }

    }
);


/* =====================================================
   ADMIN SESSION CHECK
===================================================== */

app.get(
    "/api/admin/session",
    requireAdmin,
    function (req, res) {

        return res.json({

            success: true,

            authenticated:
                true,

            role:
                "admin"

        });

    }
);


/* =====================================================
   ADMIN LOGOUT
===================================================== */

app.post(
    "/api/admin/logout",
    requireAdmin,
    function (req, res) {

        return res.json({

            success: true,

            message:
                "Admin logged out successfully."

        });

    }
);


/* =====================================================
   ADMIN - GET ALL ORDERS
===================================================== */

app.get(
    "/api/admin/orders",
    requireAdmin,
    async function (req, res) {

        try {

            const status =
                String(
                    req.query.status ||
                    "all"
                ).trim();


            let query =
                supabase
                    .from("orders")
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (
                status &&
                status !== "all"
            ) {

                query =
                    query.eq(
                        "status",
                        status
                    );

            }


            const {
                data,
                error
            } =
                await query;


            if (error) {

                console.error(
                    "ADMIN ORDERS FETCH ERROR:",
                    error
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Could not load orders.",

                    error:
                        error.message

                });

            }


            console.log(
                "ADMIN ORDERS:",
                data?.length || 0
            );


            return res.json({

                success: true,

                orders:
                    data || [],

                count:
                    data?.length || 0

            });

        }

        catch (error) {

            console.error(
                "ADMIN ORDERS ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Could not load orders.",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   ADMIN - GET ONE ORDER
===================================================== */

app.get(
    "/api/admin/orders/:orderId",
    requireAdmin,
    async function (req, res) {

        try {

            const orderId =
                String(
                    req.params.orderId ||
                    ""
                ).trim();


            if (!orderId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Order ID is required."

                });

            }


            /* =====================================
               ORDER
            ===================================== */

            const {
                data: order,
                error: orderError
            } =
                await supabase
                    .from("orders")
                    .select("*")
                    .eq(
                        "id",
                        orderId
                    )
                    .maybeSingle();


            if (orderError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not load order.",

                    error:
                        orderError.message

                });

            }


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            /* =====================================
               CUSTOMER
            ===================================== */

            let customer =
                null;


            if (
                order.customer_id
            ) {

                const {
                    data
                } =
                    await supabase
                        .from("profiles")
                        .select(
                            "id, full_name, phone, role"
                        )
                        .eq(
                            "id",
                            order.customer_id
                        )
                        .maybeSingle();


                customer =
                    data || null;

            }


            /* =====================================
               ADDRESS
            ===================================== */

            let address =
                null;


            if (
                order.address_id
            ) {

                const {
                    data
                } =
                    await supabase
                        .from("addresses")
                        .select("*")
                        .eq(
                            "id",
                            order.address_id
                        )
                        .maybeSingle();


                address =
                    data || null;

            }


            /* =====================================
               ORDER ITEMS
            ===================================== */

            const {
                data: items,
                error: itemsError
            } =
                await supabase
                    .from("order_items")
                    .select("*")
                    .eq(
                        "order_id",
                        orderId
                    )
                    .order(
                        "id"
                    );


            if (itemsError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not load order items.",

                    error:
                        itemsError.message

                });

            }


            /* =====================================
               BILL
            ===================================== */

            const {
                data: bill
            } =
                await supabase
                    .from("bills")
                    .select("*")
                    .eq(
                        "order_id",
                        orderId
                    )
                    .maybeSingle();


            /* =====================================
               DELIVERY OTP
            ===================================== */

            const {
                data: otp
            } =
                await supabase
                    .from("delivery_otps")
                    .select(
                        "id, order_id, expires_at, verified_at, created_at"
                    )
                    .eq(
                        "order_id",
                        orderId
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    )
                    .limit(1)
                    .maybeSingle();


            return res.json({

                success: true,

                order:
                    order,

                customer:
                    customer,

                address:
                    address,

                items:
                    items || [],

                bill:
                    bill || null,

                deliveryOtp:
                    otp || null

            });

        }

        catch (error) {

            console.error(
                "ADMIN ORDER DETAILS ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Could not load order details.",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   ADMIN - ACCEPT ORDER
===================================================== */

app.post(
    "/api/admin/orders/:orderId/accept",
    requireAdmin,
    async function (req, res) {

        try {

            const orderId =
                String(
                    req.params.orderId ||
                    ""
                ).trim();


            if (!orderId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Order ID is required."

                });

            }


            const {
                data: order,
                error: fetchError
            } =
                await supabase
                    .from("orders")
                    .select(
                        "id, order_no, status, admin_accepted"
                    )
                    .eq(
                        "id",
                        orderId
                    )
                    .maybeSingle();


            if (fetchError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not fetch order.",

                    error:
                        fetchError.message

                });

            }


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            if (
                order.status ===
                "cancelled"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Cancelled order cannot be accepted."

                });

            }


            if (
                order.status ===
                "rejected"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Rejected order cannot be accepted."

                });

            }


            const {
                data: updatedOrder,
                error: updateError
            } =
                await supabase
                    .from("orders")
                    .update({

                        admin_accepted:
                            true,

                        status:
                            "accepted",

                        accepted_at:
                            new Date().toISOString(),

                        rejection_reason:
                            null,

                        rejected_at:
                            null

                    })
                    .eq(
                        "id",
                        orderId
                    )
                    .select()
                    .maybeSingle();


            if (updateError) {

                console.error(
                    "ADMIN ACCEPT ERROR:",
                    updateError
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Could not accept order.",

                    error:
                        updateError.message

                });

            }


            return res.json({

                success: true,

                message:
                    "Order accepted successfully.",

                order:
                    updatedOrder

            });

        }

        catch (error) {

            console.error(
                "ADMIN ACCEPT ORDER ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Could not accept order.",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   ADMIN - REJECT ORDER
===================================================== */

app.post(
    "/api/admin/orders/:orderId/reject",
    requireAdmin,
    async function (req, res) {

        try {

            const orderId =
                String(
                    req.params.orderId ||
                    ""
                ).trim();


            const reason =
                String(
                    req.body.reason ||
                    "Order rejected by admin."
                ).trim();


            if (!orderId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Order ID is required."

                });

            }


            const {
                data: order,
                error: fetchError
            } =
                await supabase
                    .from("orders")
                    .select(
                        "id, order_no, status"
                    )
                    .eq(
                        "id",
                        orderId
                    )
                    .maybeSingle();


            if (fetchError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not fetch order.",

                    error:
                        fetchError.message

                });

            }


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            if (
                order.status ===
                "completed"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Completed order cannot be rejected."

                });

            }


            const {
                data: updatedOrder,
                error: updateError
            } =
                await supabase
                    .from("orders")
                    .update({

                        admin_accepted:
                            false,

                        status:
                            "rejected",

                        rejection_reason:
                            reason,

                        rejected_at:
                            new Date().toISOString()

                    })
                    .eq(
                        "id",
                        orderId
                    )
                    .select()
                    .maybeSingle();


            if (updateError) {

                console.error(
                    "ADMIN REJECT ERROR:",
                    updateError
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Could not reject order.",

                    error:
                        updateError.message

                });

            }


            return res.json({

                success: true,

                message:
                    "Order rejected successfully.",

                order:
                    updatedOrder

            });

        }

        catch (error) {

            console.error(
                "ADMIN REJECT ORDER ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Could not reject order.",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   FORGOT PASSWORD
   CREATE RESET TOKEN
===================================================== */

function createPasswordResetToken(
    userId
) {

    const expiresAt =
        Date.now() +
        (
            10 *
            60 *
            1000
        );


    const payload = {

        userId:
            userId,

        expiresAt:
            expiresAt

    };


    const encodedPayload =
        Buffer
            .from(
                JSON.stringify(payload)
            )
            .toString(
                "base64url"
            );


    const signature =
        crypto
            .createHmac(
                "sha256",
                SUPABASE_SERVICE_ROLE_KEY
            )
            .update(
                encodedPayload
            )
            .digest(
                "base64url"
            );


    return (
        encodedPayload +
        "." +
        signature
    );

}


/* =====================================================
   VERIFY PASSWORD RESET TOKEN
===================================================== */

function verifyPasswordResetToken(
    token
) {

    try {

        if (!token) {

            return null;

        }


        const parts =
            token.split(".");


        if (
            parts.length !== 2
        ) {

            return null;

        }


        const encodedPayload =
            parts[0];


        const receivedSignature =
            parts[1];


        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    SUPABASE_SERVICE_ROLE_KEY
                )
                .update(
                    encodedPayload
                )
                .digest(
                    "base64url"
                );


        const receivedBuffer =
            Buffer.from(
                receivedSignature
            );


        const expectedBuffer =
            Buffer.from(
                expectedSignature
            );


        if (
            receivedBuffer.length !==
            expectedBuffer.length
        ) {

            return null;

        }


        if (
            !crypto.timingSafeEqual(
                receivedBuffer,
                expectedBuffer
            )
        ) {

            return null;

        }


        const payload =
            JSON.parse(
                Buffer
                    .from(
                        encodedPayload,
                        "base64url"
                    )
                    .toString(
                        "utf8"
                    )
            );


        if (!payload.userId) {

            return null;

        }


        if (!payload.expiresAt) {

            return null;

        }


        if (
            Date.now() >
            Number(
                payload.expiresAt
            )
        ) {

            return null;

        }


        return payload;

    }

    catch (error) {

        console.error(
            "RESET TOKEN VERIFICATION ERROR:",
            error
        );

        return null;

    }

}


/* =====================================================
   FORGOT PASSWORD - VERIFY
===================================================== */

app.post(
    "/api/auth/forgot-password/verify",
    async function (req, res) {

        try {

            const email =
                String(
                    req.body.email ||
                    ""
                )
                .trim()
                .toLowerCase();


            const phone =
                String(
                    req.body.phone ||
                    ""
                )
                .trim();


            if (!email) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email address is required."

                });

            }


            if (!phone) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Phone number is required."

                });

            }


            const {
                data: profiles,
                error: profileError
            } =
                await supabase
                    .from("profiles")
                    .select(
                        "id, full_name, phone, role"
                    )
                    .eq(
                        "phone",
                        phone
                    )
                    .limit(10);


            if (profileError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not verify account.",

                    error:
                        profileError.message

                });

            }


            if (
                !profiles ||
                profiles.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Email and phone number do not match our records."

                });

            }


            let matchedUser =
                null;


            for (
                const profile of profiles
            ) {

                try {

                    const {
                        data:
                            authUserData,
                        error:
                            authUserError
                    } =
                        await supabase
                            .auth
                            .admin
                            .getUserById(
                                profile.id
                            );


                    if (authUserError) {

                        continue;

                    }


                    const authUser =
                        authUserData?.user;


                    if (!authUser) {

                        continue;

                    }


                    const authEmail =
                        String(
                            authUser.email ||
                            ""
                        )
                        .trim()
                        .toLowerCase();


                    if (
                        authEmail ===
                        email
                    ) {

                        matchedUser =
                            authUser;

                        break;

                    }

                }

                catch (userError) {

                    console.error(
                        "USER LOOKUP ERROR:",
                        userError
                    );

                }

            }


            if (!matchedUser) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Email and phone number do not match our records."

                });

            }


            const resetToken =
                createPasswordResetToken(
                    matchedUser.id
                );


            return res.json({

                success: true,

                message:
                    "Account verified successfully.",

                resetToken:
                    resetToken

            });

        }

        catch (error) {

            console.error(
                "FORGOT PASSWORD VERIFY ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Could not verify your account.",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   FORGOT PASSWORD - RESET
===================================================== */

app.post(
    "/api/auth/forgot-password/reset",
    async function (req, res) {

        try {

            const resetToken =
                String(
                    req.body.resetToken ||
                    ""
                ).trim();


            const newPassword =
                String(
                    req.body.newPassword ||
                    ""
                );


            if (!resetToken) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password reset session is missing."

                });

            }


            if (!newPassword) {

                return res.status(400).json({

                    success: false,

                    message:
                        "New password is required."

                });

            }


            if (
                newPassword.length < 6
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password must be at least 6 characters."

                });

            }


            const tokenData =
                verifyPasswordResetToken(
                    resetToken
                );


            if (!tokenData) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Password reset session is invalid or expired. Please try again."

                });

            }


            const {
                error:
                    updatePasswordError
            } =
                await supabase
                    .auth
                    .admin
                    .updateUserById(
                        tokenData.userId,
                        {
                            password:
                                newPassword
                        }
                    );


            if (updatePasswordError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Password could not be updated.",

                    error:
                        updatePasswordError.message

                });

            }


            return res.json({

                success: true,

                message:
                    "Password reset successfully."

            });

        }

        catch (error) {

            console.error(
                "RESET PASSWORD ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Could not reset password.",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   GENERATE BILL NUMBER
===================================================== */

function generateBillNumber() {

    const year =
        new Date().getFullYear();


    const randomNumber =
        crypto.randomInt(
            100000,
            1000000
        );


    return (
        `PPS-BILL-${year}-${randomNumber}`
    );

}


/* =====================================================
   GENERATE QR TOKEN
===================================================== */

function generateQRToken() {

    return crypto.randomUUID();

}


/* =====================================================
   GENERATE DELIVERY OTP
===================================================== */

function generateDeliveryOTP() {

    return String(
        crypto.randomInt(
            100000,
            1000000
        )
    );

}


/* =====================================================
   HASH DELIVERY OTP
===================================================== */

function hashDeliveryOTP(
    otp
) {

    return crypto
        .createHash(
            "sha256"
        )
        .update(
            String(otp)
        )
        .digest(
            "hex"
        );

}


/* =====================================================
   CREATE DELIVERY OTP
===================================================== */

async function createDeliveryOTP(
    orderId
) {

    const otp =
        generateDeliveryOTP();


    const otpHash =
        hashDeliveryOTP(
            otp
        );


    const expiresAt =
        new Date(
            Date.now() +
            (
                4 *
                24 *
                60 *
                60 *
                1000
            )
        ).toISOString();


    const {
        data,
        error
    } =
        await supabase
            .from("delivery_otps")
            .insert({

                order_id:
                    orderId,

                otp_hash:
                    otpHash,

                expires_at:
                    expiresAt

            })
            .select()
            .single();


    if (error) {

        throw new Error(
            `Could not create delivery OTP: ${error.message}`
        );

    }


    return {

        otp:
            otp,

        record:
            data

    };

}


/* =====================================================
   CREATE BILL PDF
===================================================== */

async function createBillPDF(
    order,
    customer,
    address,
    items,
    billNumber,
    qrToken,
    deliveryOTP
) {

    return new Promise(
        async function (
            resolve,
            reject
        ) {

            try {

                const doc =
                    new PDFDocument({

                        size:
                            "A4",

                        margin:
                            45,

                        bufferPages:
                            true

                    });


                const chunks =
                    [];


                doc.on(
                    "data",
                    function (chunk) {

                        chunks.push(
                            chunk
                        );

                    }
                );


                doc.on(
                    "end",
                    function () {

                        resolve(
                            Buffer.concat(
                                chunks
                            )
                        );

                    }
                );


                doc.on(
                    "error",
                    function (error) {

                        reject(
                            error
                        );

                    }
                );


                const pageWidth =
                    doc.page.width;


                const pageHeight =
                    doc.page.height;


                const left =
                    doc.page.margins.left;


                const right =
                    pageWidth -
                    doc.page.margins.right;


                const contentWidth =
                    right -
                    left;


                function money(value) {

                    return (
                        "Rs. " +
                        Number(
                            value || 0
                        ).toFixed(2)
                    );

                }


                function drawLine(y) {

                    doc
                        .moveTo(
                            left,
                            y
                        )
                        .lineTo(
                            right,
                            y
                        )
                        .lineWidth(
                            0.7
                        )
                        .strokeColor(
                            "#cccccc"
                        )
                        .stroke();

                }


                function drawSectionTitle(
                    title
                ) {

                    doc
                        .font(
                            "Helvetica-Bold"
                        )
                        .fontSize(
                            11
                        )
                        .fillColor(
                            "#222222"
                        )
                        .text(
                            title,
                            left,
                            doc.y
                        );


                    doc.moveDown(
                        0.35
                    );

                }


                function drawFooter() {

                    const footerY =
                        pageHeight -
                        48;


                    doc
                        .font(
                            "Helvetica"
                        )
                        .fontSize(
                            8
                        )
                        .fillColor(
                            "#777777"
                        )
                        .text(
                            "Pooja Paper Solution | Computer-generated bill",
                            left,
                            footerY,
                            {
                                width:
                                    contentWidth,

                                align:
                                    "center"
                            }
                        );

                }


                function checkPageSpace(
                    requiredHeight
                ) {

                    if (
                        doc.y +
                        requiredHeight >
                        pageHeight -
                        70
                    ) {

                        drawFooter();

                        doc.addPage();

                        doc.y =
                            doc.page.margins.top;

                    }

                }


                /* =====================================
                   QR
                ===================================== */

                const qrData =
                    JSON.stringify({

                        orderId:
                            order.id,

                        orderNo:
                            order.order_no,

                        qrToken:
                            qrToken

                    });


                const qrDataURL =
                    await QRCode.toDataURL(
                        qrData,
                        {
                            width:
                                300,

                            margin:
                                2,

                            errorCorrectionLevel:
                                "H"
                        }
                    );


                const qrBase64 =
                    qrDataURL.replace(
                        /^data:image\/png;base64,/,
                        ""
                    );


                const qrBuffer =
                    Buffer.from(
                        qrBase64,
                        "base64"
                    );


                /* =====================================
                   HEADER
                ===================================== */

                const headerTop =
                    doc.y;


                const headerHeight =
                    82;


                doc
                    .roundedRect(
                        left,
                        headerTop,
                        contentWidth,
                        headerHeight,
                        8
                    )
                    .lineWidth(
                        1
                    )
                    .strokeColor(
                        "#333333"
                    )
                    .stroke();


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(
                        21
                    )
                    .fillColor(
                        "#111111"
                    )
                    .text(
                        "POOJA PAPER SOLUTION",
                        left + 18,
                        headerTop + 15,
                        {
                            width:
                                contentWidth - 36,

                            align:
                                "center"
                        }
                    );


                doc
                    .font(
                        "Helvetica"
                    )
                    .fontSize(
                        9
                    )
                    .fillColor(
                        "#555555"
                    )
                    .text(
                        "Disposable Paper Products",
                        left + 18,
                        headerTop + 43,
                        {
                            width:
                                contentWidth - 36,

                            align:
                                "center"
                        }
                    );


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(
                        13
                    )
                    .fillColor(
                        "#111111"
                    )
                    .text(
                        "SALES BILL",
                        left + 18,
                        headerTop + 58,
                        {
                            width:
                                contentWidth - 36,

                            align:
                                "center"
                        }
                    );


                doc.y =
                    headerTop +
                    headerHeight +
                    18;


                /* =====================================
                   BILL INFORMATION
                ===================================== */

                const infoTop =
                    doc.y;


                const halfWidth =
                    contentWidth /
                    2;


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(
                        9
                    )
                    .fillColor(
                        "#333333"
                    )
                    .text(
                        "BILL INFORMATION",
                        left,
                        infoTop
                    );


                doc
                    .font(
                        "Helvetica"
                    )
                    .fontSize(
                        9
                    )
                    .fillColor(
                        "#222222"
                    )
                    .text(
                        `Bill No: ${billNumber}`,
                        left,
                        infoTop + 17
                    );


                doc.text(
                    `Order No: ${order.order_no}`,
                    left,
                    infoTop + 32
                );


                const createdAtUTC = order.created_at;

const orderDateUTC =
    new Date(createdAtUTC);

// Manually add 5 hours 30 minutes for IST
const orderDateIST =
    new Date(
        orderDateUTC.getTime() +
        (5 * 60 + 30) * 60 * 1000
    );

const orderDate =
    orderDateIST.toLocaleString(
        "en-IN",
        {
            timeZone: "UTC",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }
    );
                doc.text(
    `Date: ${orderDate} (+5:30)`,
    left,
    infoTop + 47
);


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .text(
                        "PAYMENT",
                        left +
                        halfWidth,
                        infoTop
                    );


                doc
                    .font(
                        "Helvetica"
                    )
                    .text(
                        `Method: ${
                            order.payment_method ||
                            "COD"
                        }`,
                        left +
                        halfWidth,
                        infoTop + 17
                    );


                doc.y =
                    infoTop +
                    67;


                drawLine(
                    doc.y
                );


                doc.moveDown(
                    0.8
                );


                /* =====================================
                   CUSTOMER + ADDRESS
                ===================================== */

                const customerTop =
                    doc.y;


                const columnGap =
                    20;


                const columnWidth =
                    (
                        contentWidth -
                        columnGap
                    ) /
                    2;


                doc
                    .roundedRect(
                        left,
                        customerTop,
                        columnWidth,
                        90,
                        6
                    )
                    .lineWidth(
                        0.7
                    )
                    .strokeColor(
                        "#cccccc"
                    )
                    .stroke();


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(
                        10
                    )
                    .fillColor(
                        "#222222"
                    )
                    .text(
                        "CUSTOMER DETAILS",
                        left + 10,
                        customerTop + 10
                    );


                doc
                    .font(
                        "Helvetica"
                    )
                    .fontSize(
                        9
                    )
                    .fillColor(
                        "#333333"
                    )
                    .text(
                        `Name: ${
                            customer?.full_name ||
                            "Customer"
                        }`,
                        left + 10,
                        customerTop + 30,
                        {
                            width:
                                columnWidth - 20
                        }
                    );


                doc.text(
                    `Phone: ${
                        customer?.phone ||
                        "Not provided"
                    }`,
                    left + 10,
                    customerTop + 48,
                    {
                        width:
                            columnWidth - 20
                    }
                );


                const addressX =
                    left +
                    columnWidth +
                    columnGap;


                doc
                    .roundedRect(
                        addressX,
                        customerTop,
                        columnWidth,
                        90,
                        6
                    )
                    .lineWidth(
                        0.7
                    )
                    .strokeColor(
                        "#cccccc"
                    )
                    .stroke();


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(
                        10
                    )
                    .fillColor(
                        "#222222"
                    )
                    .text(
                        "DELIVERY ADDRESS",
                        addressX + 10,
                        customerTop + 10
                    );


                let addressText =
                    "Address not provided";


                if (address) {

                    addressText =
                        [
                            address.address_line,
                            address.city,
                            address.state,
                            address.pincode
                        ]
                        .filter(
                            Boolean
                        )
                        .join(
                            ", "
                        );

                }


                doc
                    .font(
                        "Helvetica"
                    )
                    .fontSize(
                        8.5
                    )
                    .fillColor(
                        "#333333"
                    )
                    .text(
                        addressText,
                        addressX + 10,
                        customerTop + 30,
                        {
                            width:
                                columnWidth - 20,

                            height:
                                48
                        }
                    );


                doc.y =
                    customerTop +
                    110;


                /* =====================================
                   ORDER ITEMS
                ===================================== */

                drawSectionTitle(
                    "ORDER ITEMS"
                );


                const tableX =
                    left;


                const tableWidth =
                    contentWidth;


                const colProduct =
                    190;


                const colPack =
                    90;


                const colQty =
                    45;


                const colPrice =
                    75;


                const colTotal =
                    tableWidth -
                    (
                        colProduct +
                        colPack +
                        colQty +
                        colPrice
                    );


                const xProduct =
                    tableX;


                const xPack =
                    xProduct +
                    colProduct;


                const xQty =
                    xPack +
                    colPack;


                const xPrice =
                    xQty +
                    colQty;


                const xTotal =
                    xPrice +
                    colPrice;


                const tableHeaderY =
                    doc.y;


                const tableHeaderHeight =
                    25;


                doc
                    .rect(
                        tableX,
                        tableHeaderY,
                        tableWidth,
                        tableHeaderHeight
                    )
                    .lineWidth(
                        0.5
                    )
                    .strokeColor(
                        "#555555"
                    )
                    .stroke();


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(
                        8
                    )
                    .fillColor(
                        "#222222"
                    );


                doc.text(
                    "PRODUCT",
                    xProduct + 7,
                    tableHeaderY + 8,
                    {
                        width:
                            colProduct - 14
                    }
                );


                doc.text(
                    "PACK",
                    xPack + 5,
                    tableHeaderY + 8,
                    {
                        width:
                            colPack - 10
                    }
                );


                doc.text(
                    "QTY",
                    xQty,
                    tableHeaderY + 8,
                    {
                        width:
                            colQty,

                        align:
                            "center"
                    }
                );


                doc.text(
                    "PRICE",
                    xPrice,
                    tableHeaderY + 8,
                    {
                        width:
                            colPrice - 5,

                        align:
                            "right"
                    }
                );


                doc.text(
                    "TOTAL",
                    xTotal,
                    tableHeaderY + 8,
                    {
                        width:
                            colTotal - 7,

                        align:
                            "right"
                    }
                );


                doc.y =
                    tableHeaderY +
                    tableHeaderHeight;


                items.forEach(
                    function (item) {

                        const productName =
                            String(
                                item.product_name ||
                                "Product"
                            );


                        const pack =
                            String(
                                item.pack ||
                                "-"
                            );


                        const quantity =
                            String(
                                item.quantity ||
                                0
                            );


                        const price =
                            money(
                                item.price
                            );


                        const lineTotal =
                            money(
                                item.line_total
                            );


                        const productHeight =
                            doc.heightOfString(
                                productName,
                                {
                                    width:
                                        colProduct - 14,

                                    font:
                                        "Helvetica",

                                    fontSize:
                                        8.5
                                }
                            );


                        const packHeight =
                            doc.heightOfString(
                                pack,
                                {
                                    width:
                                        colPack - 10,

                                    font:
                                        "Helvetica",

                                    fontSize:
                                        8.5
                                }
                            );


                        const rowHeight =
                            Math.max(
                                28,
                                productHeight + 14,
                                packHeight + 14
                            );


                        checkPageSpace(
                            rowHeight + 10
                        );


                        const rowY =
                            doc.y;


                        doc
                            .rect(
                                tableX,
                                rowY,
                                tableWidth,
                                rowHeight
                            )
                            .lineWidth(
                                0.5
                            )
                            .strokeColor(
                                "#dddddd"
                            )
                            .stroke();


                        doc
                            .font(
                                "Helvetica"
                            )
                            .fontSize(
                                8.5
                            )
                            .fillColor(
                                "#222222"
                            )
                            .text(
                                productName,
                                xProduct + 7,
                                rowY + 8,
                                {
                                    width:
                                        colProduct - 14,

                                    height:
                                        rowHeight - 10
                                }
                            );


                        doc.text(
                            pack,
                            xPack + 5,
                            rowY + 8,
                            {
                                width:
                                    colPack - 10,

                                height:
                                    rowHeight - 10
                            }
                        );


                        doc.text(
                            quantity,
                            xQty,
                            rowY + 8,
                            {
                                width:
                                    colQty,

                                align:
                                    "center"
                            }
                        );


                        doc.text(
                            price,
                            xPrice,
                            rowY + 8,
                            {
                                width:
                                    colPrice - 5,

                                align:
                                    "right"
                            }
                        );


                        doc
                            .font(
                                "Helvetica-Bold"
                            )
                            .text(
                                lineTotal,
                                xTotal,
                                rowY + 8,
                                {
                                    width:
                                        colTotal - 7,

                                    align:
                                        "right"
                                }
                            );


                        doc.y =
                            rowY +
                            rowHeight;

                    }
                );


                /* =====================================
                   TOTAL
                ===================================== */

                doc.moveDown(
                    1
                );


                checkPageSpace(
                    120
                );


                const summaryWidth =
                    240;


                const summaryX =
                    right -
                    summaryWidth;


                const summaryTop =
                    doc.y;


                doc
                    .font(
                        "Helvetica"
                    )
                    .fontSize(
                        9
                    )
                    .fillColor(
                        "#333333"
                    );


                doc.text(
                    "Subtotal",
                    summaryX,
                    summaryTop,
                    {
                        width:
                            120
                    }
                );


                doc.text(
                    money(
                        order.subtotal
                    ),
                    summaryX + 120,
                    summaryTop,
                    {
                        width:
                            120,

                        align:
                            "right"
                    }
                );


                doc.text(
                    "Delivery Charge",
                    summaryX,
                    summaryTop + 20,
                    {
                        width:
                            120
                    }
                );


                doc.text(
                    money(
                        order.delivery_charge
                    ),
                    summaryX + 120,
                    summaryTop + 20,
                    {
                        width:
                            120,

                        align:
                            "right"
                    }
                );


                drawLine(
                    summaryTop + 42
                );


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(
                        12
                    )
                    .fillColor(
                        "#111111"
                    );


                doc.text(
                    "GRAND TOTAL",
                    summaryX,
                    summaryTop + 52,
                    {
                        width:
                            120
                    }
                );


                doc.text(
                    money(
                        order.total
                    ),
                    summaryX + 120,
                    summaryTop + 52,
                    {
                        width:
                            120,

                        align:
                            "right"
                    }
                );


                doc.y =
                    summaryTop +
                    82;


                /* =====================================
                   DELIVERY VERIFICATION
                ===================================== */

                checkPageSpace(
                    190
                );


                drawLine(
                    doc.y
                );


                doc.y += 8;


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(
                        10
                    )
                    .fillColor(
                        "#222222"
                    )
                    .text(
                        "DELIVERY VERIFICATION",
                        left,
                        doc.y,
                        {
                            width:
                                contentWidth,

                            align:
                                "center"
                        }
                    );


                doc.y += 4;


                doc
                    .font(
                        "Helvetica"
                    )
                    .fontSize(
                        7.5
                    )
                    .fillColor(
                        "#555555"
                    )
                    .text(
                        "Give this code to the delivery person when receiving your order.",
                        left,
                        doc.y,
                        {
                            width:
                                contentWidth,

                            align:
                                "center"
                        }
                    );


                doc.y += 4;


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(
                        20
                    )
                    .fillColor(
                        "#111111"
                    )
                    .text(
                        String(
                            deliveryOTP
                        ),
                        left,
                        doc.y,
                        {
                            width:
                                contentWidth,

                            align:
                                "center"
                        }
                    );


                doc.y += 3;


                const otpExpiryDate =
                    new Date(
                        Date.now() +
                        (
                            4 *
                            24 *
                            60 *
                            60 *
                            1000
                        )
                    );


               const otpExpiryText =
    otpExpiryDate.toLocaleString(
        "en-IN",
        {
            timeZone:
                "Asia/Kolkata",

            dateStyle:
                "medium",

            timeStyle:
                "short"
        }
    );


                doc
                    .font(
                        "Helvetica"
                    )
                    .fontSize(
                        7.5
                    )
                    .fillColor(
                        "#777777"
                    )
                    .text(
                        `Valid until: ${otpExpiryText}`,
                        left,
                        doc.y,
                        {
                            width:
                                contentWidth,

                            align:
                                "center"
                        }
                    );


                /* =====================================
                   QR
                ===================================== */

                doc.y += 8;


                drawLine(
                    doc.y
                );


                doc.y += 7;


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(
                        9.5
                    )
                    .fillColor(
                        "#222222"
                    )
                    .text(
                        "ORDER VERIFICATION QR",
                        left,
                        doc.y,
                        {
                            width:
                                contentWidth,

                            align:
                                "center"
                        }
                    );


                doc.y += 5;


                const qrSize =
                    105;


                const qrX =
                    left +
                    (
                        contentWidth -
                        qrSize
                    ) /
                    2;


                const qrY =
                    doc.y;


                doc.image(
                    qrBuffer,
                    qrX,
                    qrY,
                    {
                        width:
                            qrSize,

                        height:
                            qrSize
                    }
                );


                doc.y =
                    qrY +
                    qrSize +
                    4;


                doc
                    .font(
                        "Helvetica"
                    )
                    .fontSize(
                        7
                    )
                    .fillColor(
                        "#555555"
                    )
                    .text(
                        "Scan this QR code to identify this order.",
                        left,
                        doc.y,
                        {
                            width:
                                contentWidth,

                            align:
                                "center"
                        }
                    );


                doc.y += 4;


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(
                        8
                    )
                    .fillColor(
                        "#222222"
                    )
                    .text(
                        `Order No: ${order.order_no}`,
                        left,
                        doc.y,
                        {
                            width:
                                contentWidth,

                            align:
                                "center"
                        }
                    );


                /* =====================================
                   THANK YOU
                ===================================== */

                doc.y += 8;


                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(
                        8.5
                    )
                    .fillColor(
                        "#222222"
                    )
                    .text(
                        "Thank you for choosing Pooja Paper Solution!",
                        left,
                        doc.y,
                        {
                            width:
                                contentWidth,

                            align:
                                "center"
                        }
                    );


                doc.y += 2;


                doc
                    .font(
                        "Helvetica"
                    )
                    .fontSize(
                        7
                    )
                    .fillColor(
                        "#777777"
                    )
                    .text(
                        "We appreciate your business.",
                        left,
                        doc.y,
                        {
                            width:
                                contentWidth,

                            align:
                                "center"
                        }
                    );


                /* =====================================
                   FOOTERS
                ===================================== */

                const range =
                    doc.bufferedPageRange();


                for (
                    let i =
                        range.start;

                    i <
                    range.start +
                    range.count;

                    i++
                ) {

                    doc.switchToPage(
                        i
                    );

                    drawFooter();

                }


                doc.end();

            }

            catch (error) {

                reject(
                    error
                );

            }

        }
    );

}


/* =====================================================
   GENERATE BILL API
===================================================== */

app.post(
    "/api/admin/generate-bill",
    requireAdmin,
    async function (req, res) {

        try {

            const orderId =
                req.body.orderId;


            if (!orderId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Order ID is required."

                });

            }


            const {
                data: order,
                error: orderError
            } =
                await supabase
                    .from("orders")
                    .select("*")
                    .eq(
                        "id",
                        orderId
                    )
                    .maybeSingle();


            if (orderError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Supabase order fetch failed.",

                    error:
                        orderError.message

                });

            }


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found in Supabase."

                });

            }


            /* =====================================
               CUSTOMER
            ===================================== */

            const {
                data: customer
            } =
                await supabase
                    .from("profiles")
                    .select(
                        "id, full_name, phone, role"
                    )
                    .eq(
                        "id",
                        order.customer_id
                    )
                    .maybeSingle();


            /* =====================================
               ADDRESS
            ===================================== */

            let address =
                null;


            if (
                order.address_id
            ) {

                const {
                    data: addressData
                } =
                    await supabase
                        .from("addresses")
                        .select("*")
                        .eq(
                            "id",
                            order.address_id
                        )
                        .maybeSingle();


                address =
                    addressData;

            }


            /* =====================================
               ITEMS
            ===================================== */

            const {
                data: items,
                error: itemsError
            } =
                await supabase
                    .from("order_items")
                    .select("*")
                    .eq(
                        "order_id",
                        orderId
                    )
                    .order(
                        "id"
                    );


            if (itemsError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not load order items.",

                    error:
                        itemsError.message

                });

            }


            if (
                !items ||
                items.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This order has no items."

                });

            }


            /* =====================================
               EXISTING BILL
            ===================================== */

            const {
                data: existingBill
            } =
                await supabase
                    .from("bills")
                    .select("*")
                    .eq(
                        "order_id",
                        orderId
                    )
                    .maybeSingle();

            /* =====================================
               EXISTING OTP
            ===================================== */

            const {
                data: existingOTPRecord
            } =
                await supabase
                    .from("delivery_otps")
                    .select("*")
                    .eq(
                        "order_id",
                        orderId
                    )
                    .order(
                        "created_at",
                        {
                            ascending:
                                false
                        }
                    )
                    .limit(1)
                    .maybeSingle();


            if (existingBill) {

                let signedUrl =
                    null;


                if (
                    existingBill.pdf_path
                ) {

                    const {
                        data:
                            signedData
                    } =
                        await supabase
                            .storage
                            .from(
                                "bills"
                            )
                            .createSignedUrl(
                                existingBill.pdf_path,
                                3600
                            );


                    if (
                        signedData
                    ) {

                        signedUrl =
                            signedData.signedUrl;

                    }

                }


                return res.json({

                    success:
                        true,

                    message:
                        "Bill already exists.",

                    bill:
                        existingBill,

                    pdfUrl:
                        signedUrl,

                    deliveryOtpCreated:
                        Boolean(
                            existingOTPRecord
                        )

                });

            }


            /* =====================================
               BILL NUMBER
            ===================================== */

            const billNumber =
                generateBillNumber();


            /* =====================================
               QR TOKEN
            ===================================== */

            const qrToken =
                generateQRToken();


            /* =====================================
               DELIVERY OTP
            ===================================== */

            let deliveryOTPData;


            try {

                deliveryOTPData =
                    await createDeliveryOTP(
                        orderId
                    );

            }

            catch (otpError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not create delivery verification code.",

                    error:
                        otpError.message

                });

            }


            const deliveryOTP =
                deliveryOTPData.otp;


            /* =====================================
               CREATE PDF
            ===================================== */

            const pdfBuffer =
                await createBillPDF(
                    order,
                    customer,
                    address,
                    items,
                    billNumber,
                    qrToken,
                    deliveryOTP
                );


            /* =====================================
               FILE PATH
            ===================================== */

            const filePath =
                `${
                    new Date().getFullYear()
                }/${
                    order.order_no
                }.pdf`;


            /* =====================================
               UPLOAD PDF
            ===================================== */

            const {
                error:
                    uploadError
            } =
                await supabase
                    .storage
                    .from("bills")
                    .upload(
                        filePath,
                        pdfBuffer,
                        {
                            contentType:
                                "application/pdf",

                            upsert:
                                true
                        }
                    );


            if (uploadError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "PDF upload failed. Make sure the bills bucket exists.",

                    error:
                        uploadError.message

                });

            }


            /* =====================================
               SAVE BILL
            ===================================== */

            const {
                data: bill,
                error: billError
            } =
                await supabase
                    .from("bills")
                    .insert({

                        order_id:
                            orderId,

                        bill_no:
                            billNumber,

                        pdf_path:
                            filePath,

                        qr_token:
                            qrToken

                    })
                    .select()
                    .single();


            if (billError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not save bill information.",

                    error:
                        billError.message

                });

            }


            /* =====================================
               UPDATE ORDER
            ===================================== */

            const {
                error:
                    updateError
            } =
                await supabase
                    .from("orders")
                    .update({

                        bill_generated:
                            true,

                        status:
                            "bill_generated"

                    })
                    .eq(
                        "id",
                        orderId
                    );


            if (updateError) {

                console.error(
                    "Order update error:",
                    updateError
                );

            }


            /* =====================================
               SIGNED URL
            ===================================== */

            let pdfUrl =
                null;


            const {
                data:
                    signedData
            } =
                await supabase
                    .storage
                    .from("bills")
                    .createSignedUrl(
                        filePath,
                        3600
                    );


            if (
                signedData
            ) {

                pdfUrl =
                    signedData.signedUrl;

            }


            console.log(
                "BILL GENERATED:",
                billNumber
            );


            return res.json({

                success:
                    true,

                message:
                    "Bill generated successfully.",

                bill:
                    bill,

                pdfUrl:
                    pdfUrl

            });

        }

        catch (error) {

            console.error(
                "Generate bill error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Internal server error.",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   VIEW BILL
===================================================== */

app.get(
    "/api/admin/bill/:orderId",
    requireAdmin,
    async function (req, res) {

        try {

            const orderId =
                req.params.orderId;


            const {
                data: bill,
                error
            } =
                await supabase
                    .from("bills")
                    .select("*")
                    .eq(
                        "order_id",
                        orderId
                    )
                    .maybeSingle();


            if (error) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not fetch bill.",

                    error:
                        error.message

                });

            }


            if (!bill) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Bill not found."

                });

            }


            const {
                data: signedData,
                error: signedError
            } =
                await supabase
                    .storage
                    .from("bills")
                    .createSignedUrl(
                        bill.pdf_path,
                        3600
                    );


            if (signedError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not create PDF link.",

                    error:
                        signedError.message

                });

            }


            const {
                data: otpRecord
            } =
                await supabase
                    .from("delivery_otps")
                    .select(
                        "id, order_id, expires_at, verified_at, created_at"
                    )
                    .eq(
                        "order_id",
                        orderId
                    )
                    .order(
                        "created_at",
                        {
                            ascending:
                                false
                        }
                    )
                    .limit(1)
                    .maybeSingle();


            return res.json({

                success:
                    true,

                bill:
                    bill,

                pdfUrl:
                    signedData.signedUrl,

                deliveryOTP:
                    otpRecord ||
                    null

            });

        }

        catch (error) {

            console.error(
                "View bill error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Internal server error.",

                error:
                    error.message

            });

        }

    }
);

/* =====================================================
   CUSTOMER VIEW / DOWNLOAD BILL
===================================================== */

app.get(
    "/api/customer/bill/:orderId",
    async function (req, res) {

        try {

            const orderId =
                req.params.orderId;


            /* =================================================
               CHECK ORDER
            ================================================= */

            const {
                data: order,
                error: orderError
            } =
                await supabase
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
                    .maybeSingle();


            if (orderError) {

                console.error(
                    "Customer bill order error:",
                    orderError
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Could not verify order.",

                    error:
                        orderError.message

                });

            }


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            /* =================================================
               CHECK BILL GENERATED
            ================================================= */

            if (
                order.bill_generated !== true
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Bill has not been generated yet."

                });

            }


            /* =================================================
               GET BILL
            ================================================= */

            const {
                data: bill,
                error: billError
            } =
                await supabase
                    .from("bills")
                    .select("*")
                    .eq(
                        "order_id",
                        orderId
                    )
                    .maybeSingle();


            if (billError) {

                console.error(
                    "Customer bill fetch error:",
                    billError
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Could not fetch bill.",

                    error:
                        billError.message

                });

            }


            if (!bill) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Bill not found."

                });

            }


            /* =================================================
               CREATE SIGNED PDF URL
            ================================================= */

            const {
                data: signedData,
                error: signedError
            } =
                await supabase
                    .storage
                    .from("bills")
                    .createSignedUrl(
                        bill.pdf_path,
                        3600
                    );


            if (signedError) {

                console.error(
                    "Customer bill PDF URL error:",
                    signedError
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Could not create PDF link.",

                    error:
                        signedError.message

                });

            }


            if (
                !signedData ||
                !signedData.signedUrl
            ) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Bill PDF URL is not available."

                });

            }


            /* =================================================
               DELIVERY OTP
            ================================================= */

            const {
                data: otpRecord
            } =
                await supabase
                    .from("delivery_otps")
                    .select(
                        "id, order_id, expires_at, verified_at, created_at"
                    )
                    .eq(
                        "order_id",
                        orderId
                    )
                    .order(
                        "created_at",
                        {
                            ascending:
                                false
                        }
                    )
                    .limit(1)
                    .maybeSingle();


            /* =================================================
               SUCCESS
            ================================================= */

            return res.json({

                success:
                    true,

                bill:
                    bill,

                pdfUrl:
                    signedData.signedUrl,

                deliveryOTP:
                    otpRecord ||
                    null

            });

        }

        catch (error) {

            console.error(
                "Customer view bill error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Internal server error.",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   DELIVERY BOY - GET ORDER BY QR
===================================================== */

app.get(
    "/api/delivery/order/:orderId",
    async function (req, res) {

        try {

            const orderId =
                req.params.orderId;


            const qrToken =
                String(
                    req.query.qrToken ||
                    ""
                ).trim();


            if (!orderId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Order ID is required."

                });

            }


            if (!qrToken) {

                return res.status(400).json({

                    success: false,

                    message:
                        "QR token is required."

                });

            }


            const {
                data: bill,
                error: billError
            } =
                await supabase
                    .from("bills")
                    .select(
                        "id, order_id, bill_no, qr_token"
                    )
                    .eq(
                        "order_id",
                        orderId
                    )
                    .eq(
                        "qr_token",
                        qrToken
                    )
                    .maybeSingle();


            if (billError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not verify QR code.",

                    error:
                        billError.message

                });

            }


            if (!bill) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid order QR code."

                });

            }


            const {
                data: order,
                error: orderError
            } =
                await supabase
                    .from("orders")
                    .select(
                        "id, order_no, customer_id, address_id, total, payment_method, status, bill_generated, created_at"
                    )
                    .eq(
                        "id",
                        orderId
                    )
                    .maybeSingle();


            if (orderError) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not fetch order.",

                    error:
                        orderError.message

                });

            }


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            if (
                order.status ===
                "completed"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This order has already been completed."

                });

            }


            const {
                data: customer
            } =
                await supabase
                    .from("profiles")
                    .select(
                        "full_name, phone"
                    )
                    .eq(
                        "id",
                        order.customer_id
                    )
                    .maybeSingle();


            let address =
                null;


            if (
                order.address_id
            ) {

                const {
                    data: addressData
                } =
                    await supabase
                        .from("addresses")
                        .select("*")
                        .eq(
                            "id",
                            order.address_id
                        )
                        .maybeSingle();


                address =
                    addressData;

            }


            return res.json({

                success:
                    true,

                order:
                    order,

                customer:
                    customer,

                address:
                    address,

                bill:
                    bill

            });

        }

        catch (error) {

            console.error(
                "DELIVERY ORDER FETCH ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Could not load delivery order.",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   DELIVERY OTP VERIFICATION
===================================================== */
/* =========================================================
   DELIVERY BOY - SCAN SECOND CARTON QR
   First scan starts delivery.
   Second scan records carton QR scan.
========================================================= */

app.post(
    "/api/delivery/scan-carton",
    async function (req, res) {

        try {

            const {
                orderId,
                qrToken
            } = req.body;


            /* ===============================
               BASIC VALIDATION
            =============================== */

            if (!orderId || !qrToken) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Order ID and QR token are required."

                });

            }


            /* ===============================
               GET ORDER
            =============================== */

            const {
                data: order,
                error: orderError
            } =
                await supabase
                    .from("orders")
                    .select(`
                        id,
                        order_no,
                        status,
                        total,
                        otp_verified,
                        delivery_qr_scanned_at
                    `)
                    .eq(
                        "id",
                        orderId
                    )
                    .maybeSingle();


            if (orderError) {

                console.error(
                    "SCAN CARTON FETCH ERROR:",
                    orderError
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not fetch order."

                });

            }


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            /* ===============================
               CHECK ORDER STATUS
            =============================== */

            if (
                order.status === "completed"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This order has already been completed."

                });

            }


            if (
                order.status === "cancelled" ||
                order.status === "rejected"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `This order is ${order.status}.`

                });

            }


            if (
                order.status !==
                "out_for_delivery"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please start delivery before scanning the carton again."

                });

            }


            /* ===============================
               VERIFY SAME QR TOKEN
            =============================== */

            const {
                data: bill,
                error: billError
            } =
                await supabase
                    .from("bills")
                    .select(`
                        id,
                        order_id,
                        qr_token
                    `)
                    .eq(
                        "order_id",
                        orderId
                    )
                    .eq(
                        "qr_token",
                        qrToken
                    )
                    .maybeSingle();


            if (billError) {

                console.error(
                    "SCAN CARTON BILL ERROR:",
                    billError
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Unable to verify carton QR."

                });

            }


            if (!bill) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid carton QR."

                });

            }


            /* ===============================
               ALREADY SCANNED
            =============================== */

            if (
                order.delivery_qr_scanned_at
            ) {

                return res.status(200).json({

                    success: true,

                    alreadyScanned: true,

                    message:
                        "Carton QR has already been scanned. Please enter the customer OTP.",

                    order: order

                });

            }


            /* ===============================
               SAVE SECOND QR SCAN
            =============================== */

            const scannedAt =
                new Date().toISOString();


            const {
                data: updatedOrder,
                error: updateError
            } =
                await supabase
                    .from("orders")
                    .update({

                        delivery_qr_scanned_at:
                            scannedAt

                    })
                    .eq(
                        "id",
                        orderId
                    )
                    .eq(
                        "status",
                        "out_for_delivery"
                    )
                    .is(
                        "delivery_qr_scanned_at",
                        null
                    )
                    .select(`
                        id,
                        order_no,
                        status,
                        total,
                        otp_verified,
                        delivery_qr_scanned_at
                    `)
                    .maybeSingle();


            if (updateError) {

                console.error(
                    "SECOND QR SCAN UPDATE ERROR:",
                    updateError
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "QR scan could not be recorded."

                });

            }


            if (!updatedOrder) {

                return res.status(409).json({

                    success: false,

                    message:
                        "QR scan could not be recorded. Please scan again."

                });

            }


            /* ===============================
               SUCCESS
            =============================== */

            return res.json({

                success: true,

                alreadyScanned: false,

                message:
                    "Carton QR verified successfully. Now enter the customer OTP.",

                order:
                    updatedOrder

            });

        }

        catch (error) {

            console.error(
                "SCAN CARTON ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Server error while scanning carton QR."

            });

        }

    }
);
/* =========================================================
   DELIVERY BOY - VERIFY CUSTOMER OTP
   Second carton QR scan is mandatory
========================================================= */

app.post("/api/delivery/verify-otp", async (req, res) => {

    try {

        const {
            orderId,
            otp,
            qrToken
        } = req.body;


        /* ===============================
           BASIC VALIDATION
        =============================== */

        if (!orderId || !otp || !qrToken) {

            return res.status(400).json({
                success: false,
                message:
                    "Order ID, QR token and OTP are required."
            });

        }


        if (!/^\d{6}$/.test(String(otp))) {

            return res.status(400).json({
                success: false,
                message:
                    "OTP must be exactly 6 digits."
            });

        }


        /* ===============================
           GET ORDER
        =============================== */

        const {
            data: order,
            error: orderError
        } = await supabase
            .from("orders")
            .select(`
                id,
                order_no,
                status,
                total,
                otp_verified,
                delivery_qr_scanned_at
            `)
            .eq("id", orderId)
            .single();


        if (orderError || !order) {

            return res.status(404).json({
                success: false,
                message: "Order not found."
            });

        }


        /* ===============================
           CHECK STATUS
        =============================== */

        if (order.status === "completed") {

            return res.status(400).json({
                success: false,
                message:
                    "This order has already been completed."
            });

        }


        if (
            order.status === "cancelled" ||
            order.status === "rejected"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `This order is ${order.status}.`
            });

        }


        if (order.status !== "out_for_delivery") {

            return res.status(400).json({
                success: false,
                message:
                    "Delivery has not been started for this order."
            });

        }


        /* =================================================
           SECOND QR SCAN IS MANDATORY
        ================================================= */

        if (!order.delivery_qr_scanned_at) {

            return res.status(400).json({
                success: false,
                message:
                    "Please scan the same carton QR first."
            });

        }


        /* ===============================
           VERIFY SAME QR
        =============================== */

        const {
            data: bill,
            error: billError
        } = await supabase
            .from("bills")
            .select(`
                id,
                order_id,
                qr_token
            `)
            .eq("order_id", orderId)
            .eq("qr_token", qrToken)
            .maybeSingle();


        if (billError) {

            console.error(
                "OTP bill verification error:",
                billError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to verify QR token."
            });

        }


        if (!bill) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid carton QR."
            });

        }


        /* ===============================
           OTP RECORD
        =============================== */

        const {
            data: otpRecord,
            error: otpError
        } = await supabase
            .from("delivery_otps")
            .select(`
                id,
                order_id,
                otp_hash,
                expires_at,
                verified_at
            `)
            .eq("order_id", orderId)
            .order("created_at", {
                ascending: false
            })
            .limit(1)
            .maybeSingle();


        if (otpError) {

            console.error(
                "OTP fetch error:",
                otpError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to verify OTP."
            });

        }


        if (!otpRecord) {

            return res.status(404).json({
                success: false,
                message:
                    "Delivery OTP record not found."
            });

        }


        /* ===============================
           ALREADY VERIFIED
        =============================== */

        if (otpRecord.verified_at) {

            return res.status(400).json({
                success: false,
                message:
                    "This OTP has already been used."
            });

        }


        /* ===============================
           EXPIRY CHECK
        =============================== */

        if (
            otpRecord.expires_at &&
            new Date(otpRecord.expires_at) < new Date()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "OTP has expired."
            });

        }


        /* ===============================
           HASH ENTERED OTP
        =============================== */

        const enteredOtpHash =
            hashDeliveryOTP(
                String(otp)
            );


        /* ===============================
           SAFE COMPARE
        =============================== */

        const storedHash =
            String(otpRecord.otp_hash);


        const enteredHash =
            String(enteredOtpHash);


        const hashesMatch =
            storedHash.length === enteredHash.length &&
            crypto.timingSafeEqual(
                Buffer.from(storedHash),
                Buffer.from(enteredHash)
            );


        if (!hashesMatch) {

            return res.status(400).json({
                success: false,
                message:
                    "Incorrect OTP. Please enter the correct customer OTP."
            });

        }


        /* ===============================
           VERIFIED TIME
        =============================== */

        const verifiedAt =
            new Date().toISOString();


        /* ===============================
           MARK OTP VERIFIED
        =============================== */

        const {
            error: otpUpdateError
        } = await supabase
            .from("delivery_otps")
            .update({
                verified_at: verifiedAt
            })
            .eq("id", otpRecord.id)
            .is("verified_at", null);


        if (otpUpdateError) {

            console.error(
                "OTP update error:",
                otpUpdateError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Could not complete OTP verification."
            });

        }


        /* ===============================
           COMPLETE ORDER
        =============================== */

        const {
            data: completedOrder,
            error: completeError
        } = await supabase
            .from("orders")
            .update({
                otp_verified: true,
                status: "completed",
                completed_at: verifiedAt
            })
            .eq("id", orderId)
            .eq("status", "out_for_delivery")
            .select(`
                id,
                order_no,
                status,
                total,
                otp_verified,
                delivery_qr_scanned_at,
                completed_at
            `)
            .single();


        if (completeError || !completedOrder) {

            console.error(
                "Complete order error:",
                completeError
            );

            return res.status(409).json({
                success: false,
                message:
                    "Order could not be completed."
            });

        }


        /* ===============================
           SUCCESS
        =============================== */

        return res.json({

            success: true,

            message:
                "Delivery completed successfully.",

            order: completedOrder

        });

    } catch (error) {

        console.error(
            "Verify OTP error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while verifying OTP."
        });

    }

});


/* =========================================================
   DELIVERY BOY - CANCEL DELIVERY
========================================================= */
app.post(
    "/api/delivery/cancel-delivery",
    async function (req, res) {

        try {

            const orderId =
                String(
                    req.body.orderId ||
                    ""
                ).trim();

            const reason =
                String(
                    req.body.reason ||
                    ""
                ).trim();


            /* =========================================
               VALIDATE ORDER ID
            ========================================= */

            if (!orderId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Order ID is required."

                });

            }


            /* =========================================
               VALIDATE REASON
            ========================================= */

            if (!reason) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Cancellation reason is required."

                });

            }


            if (reason.length > 500) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Cancellation reason must be 500 characters or less."

                });

            }


            /* =========================================
               GET ORDER
            ========================================= */

            const {
                data: order,
                error: orderError
            } =
                await supabase
                    .from("orders")
                    .select(`
                        id,
                        status
                    `)
                    .eq("id", orderId)
                    .maybeSingle();


            if (orderError) {

                console.error(
                    "Cancel delivery order lookup error:",
                    orderError
                );

                return res.status(500).json({

                    success: false,

                    message:
                        orderError.message

                });

            }


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            /* =========================================
               ONLY OUT FOR DELIVERY CAN BE CANCELLED
            ========================================= */

            if (order.status !== "out_for_delivery") {

                return res.status(400).json({

                    success: false,

                    message:
                        `This order cannot be cancelled because its current status is "${order.status}".`

                });

            }


            /* =========================================
               CANCEL ORDER
               
               IMPORTANT:
               Database column is cancelled_reason
               NOT reason
            ========================================= */

            const {
                data: updatedOrder,
                error: updateError
            } =
                await supabase
                    .from("orders")
                    .update({

                        status: "cancelled",

                        cancelled_reason:
                            reason,

                        cancelled_at:
                            new Date().toISOString()

                    })
                    .eq("id", orderId)
                    .eq("status", "out_for_delivery")
                    .select(`
                        id,
                        order_no,
                        status,
                        cancelled_reason,
                        cancelled_at
                    `)
                    .maybeSingle();


            if (updateError) {

                console.error(
                    "Cancel delivery update error:",
                    updateError
                );

                return res.status(500).json({

                    success: false,

                    message:
                        updateError.message

                });

            }


            if (!updatedOrder) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Order could not be cancelled. It may have already been updated."

                });

            }


            /* =========================================
               SUCCESS
            ========================================= */

            return res.json({

                success: true,

                message:
                    "Delivery cancelled successfully.",

                order:
                    updatedOrder

            });

        } catch (error) {

            console.error(
                "Cancel delivery error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Something went wrong while cancelling delivery."

            });

        }

    }
);

/* =====================================================
   DELIVERY ORDER HISTORY
   COMPLETED / CANCELLED
===================================================== */

app.get(
    "/api/delivery/history",
    async function (req, res) {

        try {

            const status =
                String(
                    req.query.status ||
                    ""
                ).trim().toLowerCase();


            const allowedStatuses = [
                "completed",
                "cancelled"
            ];


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid history status."

                });

            }


            const {
                data: orders,
                error
            } =
                await supabase
                    .from("orders")
                    .select(`
                        id,
                        order_no,
                        status,
                        total,
                        created_at,
                        customer_id,
                        delivery_qr_scanned_at,
                        otp_verified,
                        completed_at,
                        cancelled_at,
                        cancelled_reason
                    `)
                    .eq(
                        "status",
                        status
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (error) {

                console.error(
                    "Delivery history error:",
                    error
                );


                return res.status(500).json({

                    success: false,

                    message:
                        error.message

                });

            }


            return res.json({

                success: true,

                orders:
                    orders || []

            });

        }
        catch (error) {

            console.error(
                "Delivery history server error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to load delivery history."

            });

        }

    }
);

/* =====================================================
   DELIVERY BOY LOGIN
===================================================== */

app.post(
    "/api/delivery/login",
    async function (req, res) {

        try {

            const username =
                String(
                    req.body.username ||
                    ""
                ).trim();


            const password =
                String(
                    req.body.password ||
                    ""
                );


            if (
                !username ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Username and password are required."

                });

            }


            if (
                username !==
                process.env.DELIVERY_USERNAME ||
                password !==
                process.env.DELIVERY_PASSWORD
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid delivery boy username or password."

                });

            }


            return res.json({

                success: true,

                message:
                    "Delivery boy username and password are correct."

            });

        }

        catch (error) {

            console.error(
                "DELIVERY LOGIN ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Delivery boy login failed."

            });

        }

    }
);

/* =====================================================
   DELIVERY BOY - ON THE WAY ORDERS
===================================================== */
app.get(
    "/api/delivery/orders",
    async function (req, res) {

        try {

            const {
                data: orders,
                error
            } =
                await supabase
                    .from("orders")
                    .select(`
                        id,
                        order_no,
                        status,
                        total,
                        created_at,
                        customer_id,
                        delivery_qr_scanned_at,
                        otp_verified,
                        completed_at,
                        cancelled_at
                    `)
                    .in(
                        "status",
                        [
                            "bill_generated",
                            "out_for_delivery"
                        ]
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (error) {

                console.error(
                    "Delivery order listing error:",
                    error
                );

                return res.status(500).json({

                    success: false,

                    message:
                        error.message

                });

            }


            return res.json({

                success: true,

                orders:
                    orders || []

            });

        }
        catch (error) {

            console.error(
                "Delivery order listing server error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to load delivery orders."

            });

        }

    }
);

/* =====================================================
   DELIVERY BOY - DASHBOARD STATS
===================================================== */
app.get(
    "/api/delivery/stats",
    async function (req, res) {

        try {

            /* =========================================
               GET ALL ORDER STATUSES
            ========================================= */

            const {
                data: orders,
                error: ordersError
            } = await supabase
                .from("orders")
                .select(`
                    id,
                    status
                `);


            if (ordersError) {

                console.error(
                    "Delivery stats fetch error:",
                    ordersError
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not load delivery statistics.",

                    error:
                        ordersError.message

                });

            }


            /* =========================================
               COUNT ORDERS
            ========================================= */

            const allOrders =
                Array.isArray(orders)
                    ? orders
                    : [];


            const totalOrders =
                allOrders.length;


            /* =========================================
               ON THE WAY
               bill_generated + out_for_delivery
            ========================================= */

            const onTheWayOrders =
                allOrders.filter(
                    order =>
                        order.status === "bill_generated" ||
                        order.status === "out_for_delivery"
                ).length;


            /* =========================================
               COMPLETED
            ========================================= */

            const completedOrders =
                allOrders.filter(
                    order =>
                        order.status ===
                        "completed"
                ).length;


            /* =========================================
               CANCELLED
            ========================================= */

            const cancelledOrders =
                allOrders.filter(
                    order =>
                        order.status ===
                        "cancelled"
                ).length;


            /* =========================================
               RESPONSE
            ========================================= */

            return res.json({

                success:
                    true,

                stats: {

                    totalOrders:
                        totalOrders,

                    onTheWayOrders:
                        onTheWayOrders,

                    completedOrders:
                        completedOrders,

                    cancelledOrders:
                        cancelledOrders

                }

            });

        }

        catch (error) {

            console.error(
                "Delivery stats API error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Server error while loading delivery statistics.",

                error:
                    error.message

            });

        }

    }
);

/* =====================================================
   DELIVERY BOY - START DELIVERY
===================================================== */

app.post(
    "/api/delivery/start-delivery",
    async function (req, res) {

        try {

            const orderId =
                String(
                    req.body.orderId ||
                    ""
                ).trim();


            if (!orderId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Order ID is required."

                });

            }


            const {
                data: order,
                error: orderError
            } =
                await supabase
                    .from("orders")
                    .select(
                        `
                        id,
                        order_no,
                        status,
                        total,
                        delivery_boy_id
                        `
                    )
                    .eq(
                        "id",
                        orderId
                    )
                    .maybeSingle();


            if (orderError) {

                console.error(
                    "START DELIVERY FETCH ERROR:",
                    orderError
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not fetch order."

                });

            }


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            /* =========================================
               ALLOWED START STATUSES
            ========================================= */

            if (
                order.status !== "assigned" &&
                order.status !== "bill_generated"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Order cannot be started. Current status: ${order.status}`

                });

            }


            /* =========================================
               START DELIVERY
            ========================================= */

            const {
                data: updatedOrder,
                error: updateError
            } =
                await supabase
                    .from("orders")
                    .update({

                        status:
                            "out_for_delivery"

                    })
                    .eq(
                        "id",
                        orderId
                    )
                    .in(
                        "status",
                        [
                            "assigned",
                            "bill_generated"
                        ]
                    )
                    .select(
                        `
                        id,
                        order_no,
                        status,
                        total
                        `
                    )
                    .maybeSingle();


            if (updateError) {

                console.error(
                    "START DELIVERY UPDATE ERROR:",
                    updateError
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not start delivery."

                });

            }


            if (!updatedOrder) {

                return res.status(409).json({

                    success: false,

                    message:
                        "This order status has already changed."

                });

            }


            /* =========================================
               SUCCESS
            ========================================= */

            return res.json({

                success:
                    true,

                message:
                    "Delivery started successfully. Order is now on the way.",

                order: {

                    id:
                        updatedOrder.id,

                    order_no:
                        updatedOrder.order_no,

                    status:
                        updatedOrder.status,

                    total:
                        updatedOrder.total

                }

            });

        }

        catch (error) {

            console.error(
                "START DELIVERY ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Could not start delivery."

            });

        }

    }
);
/* =====================================================
   START SERVER
===================================================== */

app.listen(
    PORT,
    function () {

        console.log("");

        console.log(
            "===================================="
        );

        console.log(
            `Pooja Paper Solution backend running at http://localhost:${PORT}`
        );

        console.log(
            "Admin API:"
        );

        console.log(
            "GET /api/admin/orders"
        );

        console.log(
            "===================================="
        );

    }
);