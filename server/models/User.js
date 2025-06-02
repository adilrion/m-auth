const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
        },
        shopNames: [
            {
                type: String,
                required: true,
                trim: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Password validation middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    // Password validation
    // const passwordRegex =
    //     /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    // if (!passwordRegex.test(this.password)) {
    //     throw new Error(
    //         "Password must be at least 8 characters with one number and one special character"
    //     );
    // }

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
