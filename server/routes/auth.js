const express = require("express");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/logout", authController.logout);
router.get("/verify", auth, authController.verifyToken);

module.exports = router;
