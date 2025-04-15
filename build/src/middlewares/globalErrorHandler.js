"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../error/AppError"));
const zodError_1 = __importDefault(require("../error/zodError"));
const globalErrorHandler = (error, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    let message = error.message || 'Something went wrong!';
    let statusCode = 500;
    let errorMessages = [{ path: '', message }];
    if (error instanceof AppError_1.default) {
        statusCode = error?.statusCode || 400;
        message = error.message;
        errorMessages = [{ path: '', message }];
    }
    else if (error instanceof zod_1.ZodError) {
        const simpleErr = (0, zodError_1.default)(error);
        statusCode = simpleErr?.statusCode;
        message = simpleErr?.message;
        errorMessages = simpleErr?.errorSources;
    }
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorMessages,
    });
};
exports.default = globalErrorHandler;
