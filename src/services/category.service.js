import Category from "../models/Category.js";
import Expense from "../models/Expense.js";
import { ApiError } from "../utils/ApiError.js";

export const createCategoryService = async (userId, data) => {
    try {
        const duplicate = await Category.findOne({ userId, name: data.name });
        if (duplicate) {
            throw new ApiError(409, "You already have a category with that name");
        }

        const category = await Category.create({ userId, ...data });
        return category;
    } catch (err) {
        throw err;
    }
};

export const getCategoriesService = async (userId) => {
    try {
        const categories = await Category.find({ userId }).sort({ createdAt: 1 });
        return categories;
    } catch (err) {
        throw new Error("Failed to fetch categories: " + err.message);
    }
};

export const getCategoryByIdService = async (userId, id) => {
    try {
        const category = await Category.findOne({ _id: id, userId });
        if (!category) {
            throw new ApiError(404, "Category not found");
        }
        return category;
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

        return updated;
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
