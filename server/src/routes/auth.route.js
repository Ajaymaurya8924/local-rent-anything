const express = require("express");

const router = express.Router();

const {
    register,
    login,
    logout,
    getMe,
    updatePassword,
    updateProfileController
} = require("../controllers/auth.controller");

const {
    verifyToken
} = require("../middlewares/auth.middleware");


// ================= PUBLIC ROUTES =================

router.post(
    "/register",
    register
);

router.post(
    "/login",
    login
);

router.post(
    "/logout",
    logout
);


// ================= PROTECTED ROUTES =================

router.get(
    "/me",
    verifyToken,
    getMe
);

router.patch(
    "/change-password",
    verifyToken,
    updatePassword
);

router.patch(
    "/profile",
    verifyToken,
    updateProfileController
);


module.exports = router;