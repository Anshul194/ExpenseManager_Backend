import Category from "../models/Category.js";
import Expense from "../models/Expense.js";
import { ApiError } from "../utils/ApiError.js";

const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
};

export const createCategoryService = async (userId, data) => {
    try {
        const duplicate = await Category.findOne({ userId, name: data.name });
        if (duplicate) {
            throw new ApiError(409, "You already have a category with that name");
        }

        const category = await Category.create({ userId, ...data });
        return { ...category.toObject(), spent: 0 };
    } catch (err) {
        throw err;
    }
};

export const getCategoriesService = async (userId) => {
    try {
        const categories = await Category.find({ userId }).sort({ createdAt: 1 }).lean();

        const { start, end } = getCurrentMonthRange();

        const spending = await Expense.aggregate([
            { $match: { userId, expenseDate: { $gte: start, $lte: end } } },
            { $group: { _id: "$categoryId", spent: { $sum: "$amount" } } }
        ]);

        const spendingMap = new Map(spending.map(s => [s._id.toString(), s.spent]));

        return categories.map(cat => ({
            ...cat,
            spent: parseFloat((spendingMap.get(cat._id.toString()) ?? 0).toFixed(2))
        }));
    } catch (err) {
        throw new Error("Failed to fetch categories: " + err.message);
    }
};

const attachSpent = async (userId, category) => {
    const cat = category.toObject ? category.toObject() : category;
    const { start, end } = getCurrentMonthRange();
    const [result] = await Expense.aggregate([
        { $match: { userId, categoryId: cat._id, expenseDate: { $gte: start, $lte: end } } },
        { $group: { _id: null, spent: { $sum: "$amount" } } }
    ]);
    return { ...cat, spent: parseFloat((result?.spent ?? 0).toFixed(2)) };
};

export const getCategoryByIdService = async (userId, id) => {
    try {
        const category = await Category.findOne({ _id: id, userId });
        if (!category) {
            throw new ApiError(404, "Category not found");
        }
        return await attachSpent(userId, category);
    } catch (err) {
        throw err;
    }
};

export const updateCategoryService = async (userId, id, data) => {
    try {
        if (data.name) {
            const conflict = await Category.findOne({ userId, name: data.name, _id: { $ne: id } });
            if (conflict) {
                throw new ApiError(409, "Another category with this name already exists");
            }
        }

        const updated = await Category.findOneAndUpdate(
            { _id: id, userId },
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!updated) {
            throw new ApiError(404, "Category not found");
        }

        return await attachSpent(userId, updated);
    } catch (err) {
        throw err;
    }
};

export const deleteCategoryService = async (userId, id) => {
    try {
        const category = await Category.findOne({ _id: id, userId });
        if (!category) {
            throw new ApiError(404, "Category not found");
        }

        const count = await Expense.countDocuments({ userId, categoryId: id });
        if (count > 0) {
            throw new ApiError(409, `This category has ${count} expense(s) linked to it. Please reassign them first.`);
        }

        await category.deleteOne();
    } catch (err) {
        throw err;
    }
};
