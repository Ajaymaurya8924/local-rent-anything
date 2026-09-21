// title             → Item ka naam
// description       → Item ki details
// category          → Electronics, Vehicle etc.
// pricePerDay       → 1 din ka rent
// securityDeposit   → Security ke liye amount
// images            → Item ki photos
// city              → Item kis city me hai
// state             → State
// owner             → Item kis User ka hai
// isAvailable       → Abhi rent ke liye available hai ya nahi


const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    pricePerDay: {
        type: Number,
        required: true
    },

    securityDeposit: {
        type: Number,
        default: 0
    },

    images: {
        type: [String],
        default: []
    },

    city: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    isAvailable: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;