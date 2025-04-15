"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HandleCatchAsync_1 = __importDefault(require("../utils/HandleCatchAsync"));
const SendResponse_1 = __importDefault(require("../utils/SendResponse"));
const lecture_service_1 = __importDefault(require("../services/lecture.service"));
const createLecture = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const lectureData = req.body;
    const lecture = await lecture_service_1.default.createLectureService(lectureData);
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: 'Lecture created successfully',
        data: lecture,
    });
});
const getLecture = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const lecture = await lecture_service_1.default.getLectureService(id);
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Lecture fetched successfully',
        data: lecture,
    });
});
const getAllLectures = (0, HandleCatchAsync_1.default)(async (_req, res) => {
    const lectures = await lecture_service_1.default.getAllLecturesService();
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Lectures fetched successfully',
        data: lectures,
    });
});
const getLecturesByModule = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const moduleId = req.params.id;
    const lectures = await lecture_service_1.default.getLecturesByModuleService(moduleId);
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Lectures fetched successfully',
        data: lectures,
    });
});
const updateLecture = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    const lecture = await lecture_service_1.default.updateLectureService(id, updateData);
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Lecture updated successfully',
        data: lecture,
    });
});
const deleteLecture = (0, HandleCatchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const lecture = await lecture_service_1.default.deleteLectureService(id);
    (0, SendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Lecture deleted successfully',
        data: lecture,
    });
});
exports.default = {
    createLecture,
    getLecture,
    getAllLectures,
    getLecturesByModule,
    updateLecture,
    deleteLecture,
};
