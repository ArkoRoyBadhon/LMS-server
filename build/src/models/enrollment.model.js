"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enrollment = void 0;
const mongoose_1 = require("mongoose");
const enrollmentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active',
    },
    accessibleVideos: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Video',
            default: [],
        },
    ],
    nextVideoToUnlock: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Video',
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Enrollment = (0, mongoose_1.model)('Enrollment', enrollmentSchema);
