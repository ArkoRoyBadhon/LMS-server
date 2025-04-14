"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCatchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.default = handleCatchAsync;
