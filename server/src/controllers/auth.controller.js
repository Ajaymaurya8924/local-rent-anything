// Responsibility
// 1. Request lena
// 2. Service call karna
// 3. Response bhejna

const {
    registerUser,
    loginUser,
    changePassword,
    updateProfile
} = require("../services/auth.service");


// ================= REGISTER =================

const register = async (req, res) => {

    try {

        const result =
            await registerUser(req.body);

        res.cookie("token", result.token, {

            httpOnly: true,

            secure: false,

            sameSite: "lax",

            maxAge: 7 * 24 * 60 * 60 * 1000

        });

        res.status(201).json({

            success: true,

            message:
                "User registered successfully",

            data: {
                user: result.user
            }

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


// ================= LOGIN =================

const login = async (req, res) => {

    try {

        const result =
            await loginUser(req.body);

        res.cookie("token", result.token, {

            httpOnly: true,

            secure: false,

            sameSite: "lax",

            maxAge: 7 * 24 * 60 * 60 * 1000

        });

        res.status(200).json({

            success: true,

            message:
                "User Login Successfully",

            data: {
                user: result.user
            }

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


// ================= LOGOUT =================

const logout = async (req, res) => {

    res.clearCookie("token");

    res.status(200).json({

        success: true,

        message: "Logout Successfully"

    });

};


// ================= GET CURRENT USER =================

const getMe = async (req, res) => {

    try {

        res.status(200).json({

            success: true,

            message:
                "User fetched successfully",

            data: {
                user: req.user
            }

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


// ================= CHANGE PASSWORD =================

const updatePassword = async (req, res) => {

    try {

        const {
            oldPassword,
            newPassword
        } = req.body;

        await changePassword(

            req.user._id,

            oldPassword,

            newPassword

        );

        res.status(200).json({

            success: true,

            message:
                "Password changed successfully"

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


// ================= UPDATE PROFILE =================

const updateProfileController = async (
    req,
    res
) => {

    try {

        const user =
            await updateProfile(

                req.user._id,

                req.body

            );

        res.status(200).json({

            success: true,

            message:
                "Profile updated successfully",

            data: {
                user
            }

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


// ================= EXPORT =================

module.exports = {

    register,

    login,

    logout,

    getMe,

    updatePassword,

    updateProfileController

};