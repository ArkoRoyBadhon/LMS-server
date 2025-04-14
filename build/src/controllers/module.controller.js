"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../error/AppError"));
const course_model_1 = require("../models/course.model");
const module_model_1 = require("../models/module.model");
const HandleCatchAsync_1 = __importDefault(require("../utils/HandleCatchAsync"));
const SendResponse_1 = __importDefault(require("../utils/SendResponse"));
const lecture_model_1 = require("../models/lecture.model");
const createModule = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const { title, course, isPublished } = req.body;
    const session = await (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const courseExists = await course_model_1.Course.findById(course).session(session);
        if (!courseExists) {
            throw new AppError_1.default(404, 'Course not found');
        }
        const module = await module_model_1.Module.create([
            {
                title,
                course,
                isPublished,
            },
        ], { session });
        await course_model_1.Course.findByIdAndUpdate(course, { $push: { modules: module[0]._id } }, { session });
        await session.commitTransaction();
        session.endSession();
        (0, SendResponse_1.default)(res, {
            success: true,
            statusCode: 201,
            message: 'Module created successfully',
            data: module[0],
        });
    }
    catch (error) {
        console.error(error);
        await session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(500, 'An error occurred while creating the module');
    }
    finally {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
    }
});
const getModule = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(400, 'Module id is required');
    }
    const module = await module_model_1.Module.findById(id);
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Module fetched successfully',
        data: module,
    });
});
const getAllModules = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const module = await module_model_1.Module.find();
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Modules fetched successfully',
        data: module,
    });
});
const getModuleByCourse = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(400, 'Course id is required');
    }
    const module = await module_model_1.Module.find({ course: id });
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Modules fetched successfully',
        data: module,
    });
});
const updateModule = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(400, 'Module id is required');
    }
    const module = await module_model_1.Module.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Module updated successfully',
        data: module,
    });
});
const deleteModule = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(400, 'Module ID is required');
    }
    const session = await (0, mongoose_1.startSession)();
    try {
        await session.withTransaction(async () => {
            const module = await module_model_1.Module.findById(id)
                .populate({
                path: 'lectures',
                select: '_id',
            })
                .session(session);
            if (!module) {
                throw new AppError_1.default(404, 'Module not found');
            }
            const lectureIds = module.lectures.map(lecture => lecture._id);
            if (lectureIds.length > 0) {
                await lecture_model_1.Lecture.deleteMany({ _id: { $in: lectureIds } }).session(session);
            }
            await module_model_1.Module.findByIdAndDelete(id).session(session);
        });
        (0, SendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: 'Module deleted successfully',
            data: null,
        });
    }
    catch {
        throw new AppError_1.default(500, 'An error occurred while deleting the module');
    }
    finally {
        session.endSession();
    }
});
exports.default = {
    createModule,
    getModule,
    getAllModules,
    getModuleByCourse,
    updateModule,
    deleteModule,
};
