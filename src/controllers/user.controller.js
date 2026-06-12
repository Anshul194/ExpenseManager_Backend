import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export const updateProfile = async (req, res) => {
    try {
        const { fullName, avatar } = req.body;
        const userId = req.user._id;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { fullName, avatar } },
            { new: true }
        ).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: { user }
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId).select("+password");

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            throw new ApiError(401, "Invalid current password");
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }
};
