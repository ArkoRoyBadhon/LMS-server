import express from 'express'
import multer from 'multer'
import {
  replaceFile,
  uploadFile,
  uploadMultipleFiles,
} from '../controllers/file.controller'
import { userRequest } from '../helpers/extender'

const router = express.Router()

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/', // Temporary file storage location
  limits: { fileSize: 50 * 1024 * 1024 }, // Optional: Set file size limit (50MB in this example)
  fileFilter: (req: userRequest, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true) // Accept the file
    } else {
      req.fileValidationError = 'Unsupported file type' // Set a custom error on the request
      cb(null, false) // Reject the file
    }
  },
})

router.post('/upload', upload.single('file'), uploadFile)

router.post('/upload/multiple', upload.array('files', 10), uploadMultipleFiles)

router.post('/replace', upload.single('file'), replaceFile) // Handle file replacement

export default router
