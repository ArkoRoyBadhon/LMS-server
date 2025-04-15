"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../error/AppError"));
const course_model_1 = require("../models/course.model");
const module_model_1 = require("../models/module.model");
const lecture_model_1 = require("../models/lecture.model");
const createCourseService = async ({ title, description, thumbnail, price, }) => {
    return await course_model_1.Course.create({ title, description, thumbnail, price });
};
const getCourseService = async (id) => {
    if (!id)
        throw new AppError_1.default(400, 'Course id is required');
    return await course_model_1.Course.findById(id)
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
};
const getAllCoursesService = async () => {
    return await course_model_1.Course.find();
};
const updateCourseService = async (id, updateData) => {
    if (!id)
        throw new AppError_1.default(400, 'Course id is required');
    return await course_model_1.Course.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};
const deleteCourseService = async (id) => {
    if (!id)
        throw new AppError_1.default(400, 'Course id is required');
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
            if (!courseData)
                throw new AppError_1.default(404, 'Course not found');
            for (const module of courseData.modules) {
                if (module.lectures?.length > 0) {
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
    }
    finally {
        session.endSession();
    }
};
exports.default = {
    createCourseService,
    getCourseService,
    getAllCoursesService,
    updateCourseService,
    deleteCourseService,
};
