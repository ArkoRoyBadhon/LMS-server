"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const file_controller_1 = require("../controllers/file.controller");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    dest: 'uploads/',
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            req.fileValidationError = 'Unsupported file type';
            cb(null, false);
        }
    },
});
router.post('/upload', upload.single('file'), file_controller_1.uploadFile);
router.post('/upload/multiple', upload.array('files', 10), file_controller_1.uploadMultipleFiles);
router.post('/replace', upload.single('file'), file_controller_1.replaceFile);
exports.default = router;
