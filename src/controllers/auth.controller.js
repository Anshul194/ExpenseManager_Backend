import bcrypt from "bcryptjs";
import {
    registerService,
    loginService,
    refreshTokenService,
    logoutService,
    COOKIE_OPTIONS
} from "../services/auth.service.js";
import { findUserByEmail } from "../repositories/user.repository.js";

export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const data = await registerService({
            fullName,
            email,
            password: hashedPassword
        });

        res.cookie("refreshToken", data.refreshToken, COOKIE_OPTIONS);

        res.status(201).json({
            success: true,
            message: "Account created",
            data: {
                user: data.user,
                accessToken: data.accessToken
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(
            email,
            "+password +refreshToken +isActive"
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const data = await loginService(user);

        res.cookie("refreshToken", data.refreshToken, COOKIE_OPTIONS);

        res.json({
            success: true,
            message: "Login successful",
            data
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

export const refresh = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        const data = await refreshTokenService(token);

        res.cookie("refreshToken", data.refreshToken, COOKIE_OPTIONS);

        res.json({
            success: true,
            data: {
                accessToken: data.accessToken
            }
        });

    } catch (err) {
        res.status(401).json({
            success: false,
            message: err.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        await logoutService(req.user._id);

        res.clearCookie("refreshToken");

        res.json({
            success: true,
            message: "Logged out"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};

export const getMe = async (req, res) => {
    res.json({
        success: true,
        data: req.user
    });
};