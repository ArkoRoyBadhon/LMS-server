import { Types } from 'mongoose'

export interface ILecture {
  _id: Types.ObjectId
  // _id: Types.ObjectId | string
  module: Types.ObjectId | string
  title: string
  video_url: string
  pdf_urls: string[]
  position: number
  isFreePreview: boolean
  isPublished: boolean
}

export interface IModule {
  title: string
  position: number
  isPublished: boolean
  _id: string
  lectures: ILecture[]
}

export interface ICourse {
  title: string
  description: string
  thumbnail: string
  price: number
  modules: IModule[]
  _id: string
}

export interface IEnrollment {
  _id: string
  user: string
  course: ICourse
  enrolledAt: Date
  status: string
  accessibleVideos: string[]
  nextVideoToUnlock: string
  isCompleted: boolean
}
