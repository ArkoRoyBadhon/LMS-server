"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_flow_1 = __importDefault(require("dotenv-flow"));
dotenv_flow_1.default.config();
const { ENV, NODE_ENV, SERVER_URL, FRONTEND_URL, PORT, DATABASE_URL, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET, EMAIL_VERIFICATION_TOKEN, } = process.env;
exports.default = {
    ENV,
    NODE_ENV,
    SERVER_URL,
    FRONTEND_URL,
    PORT: Number(PORT) || 5000,
    DATABASE_URL,
    REFRESH_TOKEN: {
        SECRET: REFRESH_TOKEN_SECRET,
        EXPIRY: '7d',
    },
    ACCESS_TOKEN: {
        SECRET: ACCESS_TOKEN_SECRET,
        EXPIRY: '15m',
    },
    EMAIL_VERIFICATION_TOKEN: {
        SECRET: EMAIL_VERIFICATION_TOKEN,
        EXPIRY: '15m',
    },
};
