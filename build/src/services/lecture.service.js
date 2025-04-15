"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../error/AppError"));
const lecture_model_1 = require("../models/lecture.model");
const module_model_1 = require("../models/module.model");
const createLectureService = async (lectureData) => {
    const { title, module: moduleId, video_url, pdf_urls, isFreePreview, isPublished, } = lectureData;
    const session = await (0, mongoose_1.startSession)();
    try {
        return await session.withTransaction(async () => {
            const moduleExists = await module_model_1.Module.findById(moduleId).session(session);
            if (!moduleExists) {
                throw new AppError_1.default(404, 'Module not found');
            }
            const [lecture] = await lecture_model_1.Lecture.create([
                {
                    title,
                    module: moduleId,
                    video_url,
                    pdf_urls,
                    isFreePreview,
                    isPublished,
                },
            ], { session });
            await module_model_1.Module.findByIdAndUpdate(moduleId, { $push: { lectures: lecture._id } }, { session });
            return lecture;
        });
    }
    catch {
        throw new AppError_1.default(500, 'An error occurred while creating the lecture');
    }
    finally {
        session.endSession();
    }
};
const getLectureService = async (id) => {
    const lecture = await lecture_model_1.Lecture.findById(id);
    if (!lecture) {
        throw new AppError_1.default(404, 'Lecture not found');
    }
    return lecture;
};
const getAllLecturesService = async () => {
    return await lecture_model_1.Lecture.find();
};
const getLecturesByModuleService = async (moduleId) => {
    const moduleExists = await module_model_1.Module.findById(moduleId);
    if (!moduleExists) {
        throw new AppError_1.default(404, 'Module not found');
    }
    return await lecture_model_1.Lecture.find({ module: moduleId });
};
const updateLectureService = async (id, updateData) => {
    const lecture = await lecture_model_1.Lecture.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    if (!lecture) {
        throw new AppError_1.default(404, 'Lecture not found');
    }
    return lecture;
};
const deleteLectureService = async (id) => {
    const lecture = await lecture_model_1.Lecture.findByIdAndDelete(id);
    if (!lecture) {
        throw new AppError_1.default(404, 'Lecture not found');
    }
    return lecture;
};
exports.default = {
    createLectureService,
    getLectureService,
    getAllLecturesService,
    getLecturesByModuleService,
    updateLectureService,
    deleteLectureService,
};
