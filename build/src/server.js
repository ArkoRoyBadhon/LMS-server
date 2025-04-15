"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const envConfig_1 = __importDefault(require("./config/envConfig"));
const mongoose_1 = __importDefault(require("mongoose"));
const appServer = app_1.app.listen(envConfig_1.default.PORT);
(async () => {
    try {
        // await mongoose.connect(envConfig.DATABASE_URL as string)
        await mongoose_1.default.connect(envConfig_1.default.DATABASE_URL);
        console.log('Database connected successfully');
        console.log('database connnected on port: ', envConfig_1.default.PORT);
    }
    catch (err) {
        console.log('database connnection failed', err);
        appServer.close(error => {
            if (error) {
                console.log('error', error);
            }
            process.exit(1);
        });
    }
})();
