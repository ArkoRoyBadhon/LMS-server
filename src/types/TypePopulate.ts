import mongoose from 'mongoose'

export interface LectureDocument {
  _id: mongoose.Types.ObjectId
}

export interface ModuleDocument {
  _id: mongoose.Types.ObjectId
  lectures: LectureDocument[]
}

export interface CourseDocument {
  _id: mongoose.Types.ObjectId
  modules: ModuleDocument[]
}
