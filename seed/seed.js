import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";
import Category from "../src/models/Category.js";
import Expense from "../src/models/Expense.js";

dotenv.config();

const categories = [
    { name: "Food", color: "#FF6B6B" },
    { name: "Transport", color: "#4ECDC4" },
    { name: "Shopping", color: "#45B7D1" },
    { name: "Health", color: "#96CEB4" },
    { name: "Entertainment", color: "#FFEAA7" },
    { name: "Utilities", color: "#DDA0DD" },
    { name: "Other", color: "#B0B0B0" }
];

const expenseTitles = {
    Food: ["Lunch", "Dinner", "Groceries"],
    Transport: ["Petrol", "Uber Ride"],
    Shopping: ["Amazon Order", "Clothes"],
    Health: ["Medicine", "Doctor Visit"],
    Entertainment: ["Movie", "Cafe"],
    Utilities: ["Internet Bill", "Electricity Bill"],
    Other: ["Gift", "Misc Expense"]
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const user = await User.findOneAndUpdate(
            { email: "testuser@gmail.com" },
            {
                fullName: "Test User",
                email: "testuser@gmail.com",
                password: "Test@1234"
            },
            {
                new: true,
                upsert: true
            }
        );

        const createdCategories = [];

        for (const category of categories) {
            const savedCategory = await Category.findOneAndUpdate(
                {
                    name: category.name,
                    userId: user._id
                },
                {
                    ...category,
                    userId: user._id
                },
                {
                    new: true,
                    upsert: true
                }
            );

            createdCategories.push(savedCategory);
        }

        const methods = ["Cash", "UPI", "Credit Card"];
        const expenses = [];

        for (let i = 0; i < 50; i++) {
            const category =
                createdCategories[
                Math.floor(Math.random() * createdCategories.length)
                ];

            const titles = expenseTitles[category.name];

            expenses.push({
                userId: user._id,
                categoryId: category._id,
                title: titles[Math.floor(Math.random() * titles.length)],
                amount: Math.floor(Math.random() * 2500) + 100,
                paymentMethod:
                    methods[Math.floor(Math.random() * methods.length)],
                expenseDate: new Date(
                    Date.now() -
                    Math.floor(Math.random() * 30) *
                    24 *
                    60 *
                    60 *
                    1000
                )
            });
        }

        await Expense.insertMany(expenses);

        console.log(`Created ${expenses.length} expenses`);
        console.log("Seed completed successfully");

        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }

};

seedData();
