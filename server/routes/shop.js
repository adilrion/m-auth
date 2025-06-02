const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard/:shopName", auth, (req, res) => {
    const { shopName } = req.params;
    res.json({
        message: `This is ${shopName} shop`,
        shopName,
    });
});

module.exports = router;
