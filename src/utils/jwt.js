import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "default_access_secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret";

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: "15m"
    });
};

export const generateRefreshToken = payload => {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: "7d"
    });
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
    jwt.verify(token, REFRESH_SECRET);
}