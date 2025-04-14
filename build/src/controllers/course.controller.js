"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../error/AppError"));
const course_model_1 = require("../models/course.model");
const HandleCatchAsync_1 = __importDefault(require("../utils/HandleCatchAsync"));
const SendResponse_1 = __importDefault(require("../utils/SendResponse"));
const module_model_1 = require("../models/module.model");
const lecture_model_1 = require("../models/lecture.model");
const createCourse = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const { title, description, thumbnail, price } = req.body;
    const course = await course_model_1.Course.create({
        title,
        description,
        thumbnail,
        price,
    });
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: 'Course created successfully',
        data: course,
    });
});
const getCourse = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(400, 'Course id is required');
    }
    const course = await course_model_1.Course.findById(id)
        .select('title description thumbnail price')
        .lean()
        .populate({
        path: 'modules',
        select: 'title description position isPublished',
        populate: {
            path: 'lectures',
            select: 'title video_url pdf_urls position isFreePreview isPublished',
            options: { sort: { position: 1 } },
        },
    });
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Course fetched successfully',
        data: course,
    });
});
const getAllCourses = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const courses = await course_model_1.Course.find();
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Courses fetched successfully',
        data: courses,
    });
});
const updateCourse = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(400, 'Course id is required');
    }
    const course = await course_model_1.Course.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Course updated successfully',
        data: course,
    });
});
const deleteCourse = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(400, 'Course id is required');
    }
    const session = await (0, mongoose_1.startSession)();
    try {
        await session.withTransaction(async () => {
            const courseData = (await course_model_1.Course.findById(id)
                .populate({
                path: 'modules',
                select: '_id',
                populate: {
                    path: 'lectures',
                    select: '_id',
                },
            })
                .session(session));
            if (!courseData) {
                throw new AppError_1.default(404, 'Course not found');
            }
            for (const module of courseData.modules) {
                if (module.lectures && module.lectures.length > 0) {
                    const lectureIds = module.lectures.map(lecture => lecture._id);
                    await lecture_model_1.Lecture.deleteMany({ _id: { $in: lectureIds } }).session(session);
                }
            }
            const moduleIds = courseData.modules.map(module => module._id);
            if (moduleIds.length > 0) {
                await module_model_1.Module.deleteMany({ _id: { $in: moduleIds } }).session(session);
            }
            await course_model_1.Course.findByIdAndDelete(id).session(session);
        });
        (0, SendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: 'Course deleted successfully',
            data: null,
        });
    }
    catch {
        throw new AppError_1.default(500, 'An error occurred while deleting the course');
    }
    finally {
        session.endSession();
    }
});
exports.default = {
    createCourse,
    getCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
};
