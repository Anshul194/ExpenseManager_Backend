import {
    createCategoryService,
    getCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
    deleteCategoryService
} from "../services/category.service.js";

export const createCategory = async (req, res) => {
    try {
        const category = await createCategoryService(
            req.user._id,
            req.body
        );

        res.status(201).json({
            success: true,
            data: category
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await getCategoriesService(req.user._id);

        res.json({
            success: true,
            data: categories
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Could not fetch categories"
        });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await getCategoryByIdService(
            req.user._id,
            req.params.id
        );

        res.json({
            success: true,
            data: category
        });

    } catch (err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await updateCategoryService(
            req.user._id,
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            message: "Category updated",
            data: category
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await deleteCategoryService(req.user._id, req.params.id);

        res.json({
            success: true,
            message: "Category deleted"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to delete category"
        });
    }
};