const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");

const {
    createReviewController,
    getItemReviewsController
} = require("../controllers/review.controller");

router.post("/", verifyToken, createReviewController);

router.get("/item/:itemId", getItemReviewsController);

module.exports = router;