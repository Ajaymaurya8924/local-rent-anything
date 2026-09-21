// Responsibility
// Is file me business logic rahega.

// Email already hai ya nahi?
// Password hash karo
// User create karo
// JWT generate karo
// Yahan req aur res ka use nahi hoga.

const User = require("../models/user.model");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");


// ================= REGISTER USER =================

const registerUser = async (userData) => {

    const {
        fullName,
        email,
        password,
        phone,
        city,
        state
    } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword =
        await bcrypt.hash(password, 10);

    const user = await User.create({

        fullName,

        email,

        password: hashedPassword,

        phone,

        city,

        state

    });

    const token = jwt.sign(

        {
            id: user._id,
            email: user.email,
            role: user.role
        },

        process.env.JWT_TOKEN,

        {
            expiresIn: "7d"
        }
    );

    const userResponse = {

        _id: user._id,

        fullName: user.fullName,

        email: user.email,

        role: user.role

    };

    return {
        user: userResponse,
        token
    };
};


// ================= LOGIN USER =================

const loginUser = async (userData) => {

    const {
        email,
        password
    } = userData;

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error(
            "Invalid email or password"
        );
    }

    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isMatch) {
        throw new Error(
            "Invalid email or password"
        );
    }

    const token = jwt.sign(

        {
            id: user._id,
            email: user.email,
            role: user.role
        },

        process.env.JWT_TOKEN,

        {
            expiresIn: "7d"
        }
    );

    const userResponse = {

        _id: user._id,

        fullName: user.fullName,

        email: user.email,

        role: user.role

    };

    return {
        user: userResponse,
        token
    };
};


// ================= GET CURRENT USER =================

const getCurrentUser = async (userId) => {

    const user =
        await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const userResponse = {

        _id: user._id,

        fullName: user.fullName,

        email: user.email,

        phone: user.phone,

        city: user.city,

        state: user.state,

        profileImage: user.profileImage,

        role: user.role

    };

    return userResponse;
};


// ================= CHANGE PASSWORD =================

const changePassword = async (
    userId,
    oldPassword,
    newPassword
) => {

    const user =
        await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const isMatch =
        await bcrypt.compare(
            oldPassword,
            user.password
        );

    if (!isMatch) {
        throw new Error(
            "Old password is incorrect"
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            newPassword,
            10
        );

    user.password =
        hashedPassword;

    await user.save();

    return true;
};


// ================= UPDATE PROFILE =================

const updateProfile = async (
    userId,
    profileData
) => {

    const {
        fullName,
        phone,
        city,
        state,
        profileImage
    } = profileData;


    const user =
        await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }


    if (fullName !== undefined) {
        user.fullName = fullName;
    }

    if (phone !== undefined) {
        user.phone = phone;
    }

    if (city !== undefined) {
        user.city = city;
    }

    if (state !== undefined) {
        user.state = state;
    }

    if (profileImage !== undefined) {
        user.profileImage = profileImage;
    }


    await user.save();


    const userResponse = {

        _id: user._id,

        fullName: user.fullName,

        email: user.email,

        phone: user.phone,

        city: user.city,

        state: user.state,

        profileImage: user.profileImage,

        role: user.role

    };


    return userResponse;
};


// ================= EXPORT =================

module.exports = {

    registerUser,

    loginUser,

    getCurrentUser,

    changePassword,

    updateProfile

};