import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    fullName: { type: String, required: true, trim: true },

    email: {
        type: String, required: true, unique: true,
        index: true, lowercase: true, trim: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    refreshToken: {
        type: String,
        select: false,
        index: true
    },

    avatar: String,

    isActive: {
        type: Boolean,
        default: true,
        index: true
    },

    lastLogin: {
        type: Date,
        index: true
    }

}, {
    timestamps: true,
    autoIndex: process.env.NODE_ENV !== "production"
});

userSchema.index({ email: 1, isActive: 1 });

const User = mongoose.model("User", userSchema);

export default User;
