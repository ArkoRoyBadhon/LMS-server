"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../error/AppError"));
const enrollment_model_1 = require("../models/enrollment.model");
const HandleCatchAsync_1 = __importDefault(require("../utils/HandleCatchAsync"));
const SendResponse_1 = __importDefault(require("../utils/SendResponse"));
const createEnrollment = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const { course, status } = req.body;
    const { _id } = req.user;
    const isEnrolled = await enrollment_model_1.Enrollment.findOne({
        user: _id,
        course,
    });
    if (isEnrolled) {
        throw new AppError_1.default(409, 'You are already enrolled in this course');
    }
    const enrollment = await enrollment_model_1.Enrollment.create({
        user: _id,
        course,
        status,
    });
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: 'Enrollment created successfully',
        data: enrollment,
    });
});
const getAllEnrollments = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const enrollments = await enrollment_model_1.Enrollment.find();
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Enrollments fetched successfully',
        data: enrollments,
    });
});
const getEnrollmentById = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(400, 'Enrollment id is required');
    }
    const enrollment = await enrollment_model_1.Enrollment.findById(id).populate({
        path: 'course',
        select: 'title description  isPublished',
        populate: {
            path: 'modules',
            select: 'title video_url pdf_urls  isFreePreview isPublished',
            options: { sort: { module_number: 1 } },
            populate: {
                path: 'lectures',
                select: 'title video_url pdf_urls  isFreePreview isPublished',
                options: { sort: { module_number: 1 } },
            },
        },
    });
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Enrollment fetched successfully',
        data: enrollment,
    });
});
const getEnrollmentByIdForUser = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const { _id } = req.user;
    const { search } = req.query;
    if (!id) {
        throw new AppError_1.default(400, 'Enrollment id is required');
    }
    const ee = await enrollment_model_1.Enrollment.findById(id).populate({
        path: 'course',
        select: 'title description  isPublished',
        populate: {
            path: 'modules',
            match: { isPublished: true },
            select: 'title video_url pdf_urls  isFreePreview isPublished',
            options: { sort: { module_number: 1 } },
            populate: {
                path: 'lectures',
                match: {
                    isPublished: true,
                },
                select: 'title video_url pdf_urls  isFreePreview isPublished',
                options: { sort: { module_number: 1 } },
            },
        },
    });
    if (ee && ee.accessibleVideos.length === 0) {
        await enrollment_model_1.Enrollment.findByIdAndUpdate(id, {
            $push: {
                accessibleVideos: ee.course?.modules[0]?.lectures[ee.accessibleVideos.length]?._id,
            },
            nextVideoToUnlock: ee.course?.modules[0]?.lectures[ee.accessibleVideos.length + 1]?._id,
        }, { new: true });
    }
    const enrollment = await enrollment_model_1.Enrollment.findById(id).populate({
        path: 'course',
        select: 'title description  isPublished',
        populate: {
            path: 'modules',
            match: { isPublished: true },
            select: 'title video_url pdf_urls  isFreePreview isPublished',
            options: { sort: { module_number: 1 } },
            populate: {
                path: 'lectures',
                match: {
                    isPublished: true,
                    ...(search
                        ? { title: { $regex: search, $options: 'i' } }
                        : {}),
                },
                select: 'title video_url pdf_urls  isFreePreview isPublished',
                options: { sort: { module_number: 1 } },
            },
        },
    });
    if (!enrollment || enrollment.user.toString() !== _id) {
        throw new AppError_1.default(404, 'Enrollment not found');
    }
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Enrollment fetched successfully',
        data: enrollment,
    });
});
const nextLecture = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(400, 'Enrollment id is required');
    }
    const enrollment = await enrollment_model_1.Enrollment.findById(id).populate({
        path: 'course',
        select: 'title description  isPublished',
        populate: {
            path: 'modules',
            match: { isPublished: true },
            select: 'title video_url pdf_urls  isFreePreview isPublished',
            options: { sort: { module_number: 1 } },
            populate: {
                path: 'lectures',
                match: { isPublished: true },
                select: 'title video_url pdf_urls  isFreePreview isPublished',
                options: { sort: { module_number: 1 } },
            },
        },
    });
    if (!enrollment) {
        throw new AppError_1.default(404, 'Enrollment not found');
    }
    if (enrollment.isCompleted) {
        return (0, SendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: 'You have completed the course',
            data: null,
        });
    }
    // Get all published lectures in proper order
    const allPublishedLectures = [];
    if (enrollment.course && !(enrollment.course instanceof mongoose_1.Types.ObjectId)) {
        enrollment.course.modules.forEach(module => {
            module.lectures.forEach(lecture => {
                allPublishedLectures.push(lecture);
            });
        });
    }
    // Find current
    const currentIndex = enrollment.nextVideoToUnlock
        ? allPublishedLectures.findIndex(l => l._id.equals(enrollment?.nextVideoToUnlock))
        : -1;
    // Determine next lecture to unlock
    if (currentIndex >= 0 && currentIndex < allPublishedLectures.length - 1) {
        // Unlock next lecture
        await enrollment_model_1.Enrollment.findByIdAndUpdate(id, {
            $push: { accessibleVideos: allPublishedLectures[currentIndex]._id },
            nextVideoToUnlock: allPublishedLectures[currentIndex + 1]._id,
        }, { new: true });
    }
    else if (currentIndex >= 0 &&
        currentIndex === allPublishedLectures.length - 1) {
        // Final lecture - mark course as completed
        await enrollment_model_1.Enrollment.findByIdAndUpdate(id, {
            $push: { accessibleVideos: allPublishedLectures[currentIndex]._id },
            nextVideoToUnlock: null,
            isCompleted: true,
        }, { new: true });
    }
    else if (currentIndex === -1 && allPublishedLectures.length > 0) {
        await enrollment_model_1.Enrollment.findByIdAndUpdate(id, {
            $push: { accessibleVideos: allPublishedLectures[0]._id },
            nextVideoToUnlock: allPublishedLectures.length > 1 ? allPublishedLectures[1]._id : null,
            ...(allPublishedLectures.length === 1 ? { isCompleted: true } : {}),
        }, { new: true });
    }
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Next Video unlocked successfully',
        data: null,
    });
});
const getEnrollmentByUser = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const { _id } = req.user;
    if (!_id) {
        throw new AppError_1.default(400, 'User id is required');
    }
    const user = await enrollment_model_1.Enrollment.find({ user: _id });
    if (!user || user.length === 0) {
        throw new AppError_1.default(404, 'Enrollment not found');
    }
    const enrollment = await enrollment_model_1.Enrollment.find({
        user: _id,
        status: 'active',
    }).populate({
        path: 'course',
        select: 'title description thumbnail price isPublished',
    });
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Enrollment fetched successfully',
        data: enrollment,
    });
});
const getEnrollmentByUserId = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(400, 'User id is required');
    }
    const user = await enrollment_model_1.Enrollment.find({ user: id });
    if (!user || user.length === 0) {
        throw new AppError_1.default(404, 'Enrollment not found');
    }
    const enrollment = await enrollment_model_1.Enrollment.find({ user: id });
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Enrollment fetched successfully',
        data: enrollment,
    });
});
const updateEnrollment = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(400, 'Enrollment id is required');
    }
    const enrollment = await enrollment_model_1.Enrollment.findByIdAndUpdate(id, {
        status: req.body.status,
    }, {
        new: true,
        runValidators: true,
    });
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Enrollment updated successfully',
        data: enrollment,
    });
});
exports.default = {
    createEnrollment,
    getAllEnrollments,
    getEnrollmentById,
    getEnrollmentByIdForUser,
    nextLecture,
    getEnrollmentByUser,
    getEnrollmentByUserId,
    updateEnrollment,
};
