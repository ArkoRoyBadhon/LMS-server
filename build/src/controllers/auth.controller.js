"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../error/AppError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const HandleCatchAsync_1 = __importDefault(require("../utils/HandleCatchAsync"));
const SendResponse_1 = __importDefault(require("../utils/SendResponse"));
const quicker_1 = __importDefault(require("../utils/quicker"));
const envConfig_1 = __importDefault(require("../config/envConfig"));
const user_model_1 = require("../models/user.model");
const register = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const body = req.body;
    const user = await user_model_1.User.findOne({ email: body.email });
    if (user) {
        throw new AppError_1.default(409, 'User already exists');
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hash = await bcrypt_1.default.hash(body.password, salt);
    const newUser = await user_model_1.User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: hash,
        role: body.role,
    });
    const accessToken = quicker_1.default.generateAccessToken({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
    });
    const refreshToken = quicker_1.default.generateRefreshToken(newUser?._id.toString());
    res.cookie('accessToken', accessToken, {
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: true,
    });
    res.cookie('refreshToken', refreshToken, {
        sameSite: 'strict',
        maxAge: 1000 * 24 * 60 * 60 * 30,
        httpOnly: true,
        secure: true,
    });
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: 'User created successfully',
        data: {
            user: {
                id: newUser?._id,
                first_name: newUser?.first_name,
                last_name: newUser?.last_name,
                email: newUser?.email,
                role: newUser?.role,
            },
        },
    });
});
const login = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError_1.default(400, 'Email & Password is required');
    }
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(404, 'User not found');
    }
    const isMatch = bcrypt_1.default.compareSync(password, user.password);
    if (!isMatch) {
        throw new AppError_1.default(403, 'Unauthorized. Password is incorrect');
    }
    const accessToken = quicker_1.default.generateAccessToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });
    const refreshToken = quicker_1.default.generateRefreshToken(user?._id.toString());
    res.cookie('accessToken', accessToken, {
        sameSite: 'strict',
        maxAge: 1000 * 60 * 30,
        httpOnly: true,
        secure: true,
    });
    res.cookie('refreshToken', refreshToken, {
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
    });
    const userObject = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: newPass, ...rest } = userObject;
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Login successfully',
        data: rest,
    });
});
const logout = (0, HandleCatchAsync_1.default)(async (req, res) => {
    res.clearCookie('accessToken', {
        path: '/',
        sameSite: 'strict',
        secure: envConfig_1.default.NODE_ENV === 'production' ? true : false,
    });
    res.clearCookie('refreshToken', {
        path: '/',
        sameSite: 'strict',
        secure: envConfig_1.default.NODE_ENV === 'production' ? true : false,
    });
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Logout successfully',
        data: null,
    });
});
const getUser = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(404, 'User not found');
    }
    const userdata = await user_model_1.User.findById(user._id);
    if (!userdata) {
        throw new AppError_1.default(404, 'User not found');
    }
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'User fetched successfully',
        data: userdata,
    });
});
exports.default = {
    register,
    login,
    logout,
    getUser,
};
