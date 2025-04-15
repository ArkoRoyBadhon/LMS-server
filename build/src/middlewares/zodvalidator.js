"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validSchema = void 0;
const validSchema = (schema) => {
    return async (req, _, next) => {
        const { success, error } = await schema.safeParseAsync(req.body);
        if (success) {
            next();
        }
        else {
            next(error);
        }
    };
};
exports.validSchema = validSchema;
