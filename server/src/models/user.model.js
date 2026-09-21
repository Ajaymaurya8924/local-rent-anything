// Responcibility
//   1. User Schema banana
//   2. Validation define karna
//   3. Methods define karna
//   4. MongoDB Collection banana

const mongoose = require("mongoose")



const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        minilength: 4
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minilength: 4
    },
    phone: {
        type: String
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    profileImage: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

module.exports = User;