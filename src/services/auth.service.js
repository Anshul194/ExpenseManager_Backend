import { createUser, findUserByEmail, findUserById, updateUserById, saveUser } from "../repositories/user.repository.js";
import Category from "../models/Category.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import { DEFAULT_CATEGORIES } from "../constants/index.js";

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000
};

const makeTokens = (userId) => {
    const accessToken = generateAccessToken({ userId });
    const refreshToken = generateRefreshToken({ userId });
    return { accessToken, refreshToken };
};

const createDefaultCategories = async (userId) => {
    try {
        const cats = DEFAULT_CATEGORIES.map((c) => ({ ...c, userId, isDefault: true }));
        await Category.insertMany(cats, { ordered: false });
    }
    catch (err) {
        console.log("Could not create default categories:", err.message);
    }
};

export const registerService = async ({ fullName, email, password }) => {
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            throw new ApiError(409, "Email already in use");
        }

        const user = await createUser({ fullName, email, password });
        await createDefaultCategories(user._id);

        const { accessToken, refreshToken } = makeTokens(user._id.toString());
        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await saveUser(user);

        const safeUser = { _id: user._id, fullName: user.fullName, email: user.email, avatar: user.avatar || null };
        return { user: safeUser, accessToken, refreshToken };
    }
    catch (err) { throw err; }
};

export const loginService = async (user) => {
    try {
        if (!user.isActive) {
            throw new ApiError(403, "Your account has been deactivated, contact support");
        }

        const { accessToken, refreshToken } = makeTokens(user._id.toString());
        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await saveUser(user);

        const safeUser = {
            _id: user._id, fullName: user.fullName, email: user.email,
            avatar: user.avatar || null, lastLogin: user.lastLogin
        };

        return { user: safeUser, accessToken, refreshToken };
    }
    catch (err) { throw err; }
};

export const refreshTokenService = async (token) => {
    try {
        if (!token) throw new ApiError(401, "Refresh token missing");

        let decoded;
        try {
            decoded = verifyRefreshToken(token);
        }
        catch (err) { throw new ApiError(401, "Refresh token is invalid or expired"); }

        const user = await findUserById(decoded.userId, "+refreshToken");
        if (!user || user.refreshToken !== token) {
            throw new ApiError(401, "Session expired, please login again");
        }

        const { accessToken, refreshToken: newRefreshToken } = makeTokens(user._id.toString());
        user.refreshToken = newRefreshToken;
        await saveUser(user);

        return { accessToken, refreshToken: newRefreshToken };
    }
    catch (err) { throw err; }
};

export const logoutService = async (userId) => {
    try {
        await updateUserById(userId, { refreshToken: null });
    }
    catch (err) { throw new Error("Logout failed: " + err.message); }
};
