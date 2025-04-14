import express from 'express'
import multer from 'multer'
import {
  replaceFile,
  uploadFile,
  uploadMultipleFiles,
} from '../controllers/file.controller'
import { userRequest } from '../helpers/extender'

const router = express.Router()

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req: userRequest, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      req.fileValidationError = 'Unsupported file type'
      cb(null, false)
    }
  },
})

router.post('/upload', upload.single('file'), uploadFile)

router.post('/upload/multiple', upload.array('files', 10), uploadMultipleFiles)

router.post('/replace', upload.single('file'), replaceFile)

export default router
