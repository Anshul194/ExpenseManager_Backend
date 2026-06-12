import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true
    },

    amount: {
        type: Number,
        required: true
    },

    title: {
        type: String, required: true, trim: true
    },


    description: {
        type: String, trim: true, default: ""
    },


    paymentMethod: {
        type: String,
        default: "Cash"
    },

    expenseDate: {
        type: Date, default: Date.now
    },

    tags: [String],

    receiptUrl: String

}, { timestamps: true });

expenseSchema.index({ userId: 1, expenseDate: -1 });

expenseSchema.index({ categoryId: 1 });

// Text index removed in favor of $regex partial matching in the service layer

export default mongoose.model("Expense", expenseSchema);
