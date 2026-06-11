import User from "../models/User.js";

export const createUser = async (userData) => {
    try {
        return await User.create(userData);
    }
    catch (error) { throw error; }
};

export const findUserByEmail = async (email, selectOptions = "") => {
    try {
        let query = User.findOne({ email });

        if (selectOptions) {
            query = query.select(selectOptions);
        }

        return await query;
    }
    catch (error) { throw error; }
};

export const findUserById = async (id, selectOptions = "") => {
    try {
        let query = User.findById(id);

        if (selectOptions) {
            query = query.select(selectOptions);
        }

        return await query;
    }
    catch (error) { throw error; }
};

export const updateUserById = async (id, updateData) => {
    try {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    }
    catch (error) { throw error; }
};

export const saveUser = async (user) => {
    try {
        return await user.save({ validateBeforeSave: false });
    }
    catch (error) { throw error; }
};
