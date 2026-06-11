import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    color: {
        type: String,
        default: "#B0B0B0",
    },

    monthlyBudget: {
        type: Number,
        default: 0,
    },

    isDefault: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);