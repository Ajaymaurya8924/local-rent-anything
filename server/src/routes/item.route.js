const express = require("express");
const router = express.Router();
const {
    addItem,
    getAllItems,
    getSingleItem,
     getMyItems,
       updateItem,
        deleteItem
} = require("../controllers/item.controller");


const {
    verifyToken
} = require("../middlewares/auth.middleware");

const upload = require("../middlewares/upload.middleware");


// Protected Route
router.post(
    "/",
    verifyToken,
    upload.array("images", 5),
    addItem
);

router.get("/", getAllItems);

router.get("/my-items", verifyToken, getMyItems);

router.get("/:id", getSingleItem);

router.patch(
    "/:id",
    verifyToken,
    upload.array("images", 5),
    updateItem
);

router.delete("/:id", verifyToken, deleteItem);


module.exports = router;