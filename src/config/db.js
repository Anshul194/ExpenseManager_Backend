import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/expense_tracker");
        console.log(`mongo connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("db connection error: ", error.message);
        process.exit(1);
    }
};
