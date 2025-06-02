const Shop = require("../models/Shop");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId, rememberMe = false) => {
    const expiresIn = rememberMe ? "7d" : "30m";
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

exports.signup = async (req, res) => {
    try {
        const { username, password, shopNames } = req.body;

        // Validation
        if (!shopNames || shopNames.length < 3) {
            return res
                .status(400)
                .json({ message: "At least 3 shop names are required" });
        }

        // Check if username exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check for unique shop names
        const normalizedShopNames = shopNames.map((name) =>
            name.trim().toLowerCase()
        );
        const existingShops = await Shop.find({
            name: { $in: normalizedShopNames },
        });

        if (existingShops.length > 0) {
            return res.status(400).json({
                message: `Shop name(s) already exist: ${existingShops
                    .map((s) => s.name)
                    .join(", ")}`,
            });
        }

        // Create user
        const user = new User({
            username,
            password,
            shopNames: normalizedShopNames,
        });
        await user.save();

        // Create shops
        const shopPromises = normalizedShopNames.map((name) =>
            new Shop({ name, owner: user._id }).save()
        );
        await Promise.all(shopPromises);

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.signin = async (req, res) => {
    try {
        console.log(req.body);
        const { username, password, rememberMe } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isMatch = await user.comparePassword(password);
        console.log("🚀 ~ isMatch:", isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = generateToken(user._id, rememberMe);

        // Set HTTP-only cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            domain: ".localhost", // Allow subdomains
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000,
        };

        res.cookie("authToken", token, cookieOptions);
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                shopNames: user.shopNames,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("authToken", { domain: ".localhost" });
    res.json({ message: "Logged out successfully" });
};

exports.verifyToken = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        res.json({
            user: {
                id: user._id,
                username: user.username,
                shopNames: user.shopNames,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
