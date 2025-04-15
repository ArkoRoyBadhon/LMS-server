'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.uploadMultipleFiles =
  exports.replaceFile =
  exports.uploadFile =
  exports.removeFile =
    void 0
const cloudinary_1 = __importDefault(require('cloudinary'))
const express_validator_1 = require('express-validator')
const promises_1 = __importDefault(require('fs/promises')) // Use promises for better error handling
const errorhandler_1 = __importDefault(require('../utils/errorhandler'))
// Cloudinary configuration
cloudinary_1.default.v2.config({
  cloud_name: process.env.CN_Cloud_name,
  api_key: process.env.CN_Api_key,
  api_secret: process.env.CN_Api_secret,
})
const isValidFileType = mimeType => {
  return mimeType.startsWith('image/') || mimeType === 'application/pdf'
}
const removeFile = async filePath => {
  try {
    await promises_1.default.unlink(filePath)
  } catch (err) {
    console.error('Error deleting file:', err)
  }
}
exports.removeFile = removeFile
// Upload Single File Controller
const uploadFile = async (req, res, next) => {
  try {
    const errors = (0, express_validator_1.validationResult)(req)
    if (!errors.isEmpty()) {
      throw new errorhandler_1.default('Validation Error', 400)
    }
    if (!req.file) {
      throw new errorhandler_1.default('No file uploaded', 400)
    }
    const fileType = req.file.mimetype
    if (!isValidFileType(fileType)) {
      throw new errorhandler_1.default(
        'Unsupported file type. Only images and PDFs are allowed.',
        400,
      )
    }
    // Determine the file extension
    const fileExtension = fileType === 'application/pdf' ? '.pdf' : ''
    // Generate a unique public ID and include the extension for Cloudinary
    const publicId = `${Date.now()}_${req.file.originalname.split('.')[0]}${fileExtension}`
    const uploadResult = await cloudinary_1.default.v2.uploader.upload(
      req.file.path,
      {
        folder: process.env.CN_Folder,
        public_id: publicId,
        resource_type: fileType === 'application/pdf' ? 'raw' : 'image',
      },
    )
    await (0, exports.removeFile)(req.file.path)
    // Final URL (remove the extension from the URL if it is a PDF)
    let finalUrl = uploadResult.secure_url
    if (fileExtension && finalUrl.endsWith(fileExtension)) {
      finalUrl = finalUrl.slice(0, -fileExtension.length) // Remove the '.pdf' from the URL
    }
    res.status(200).json({
      url: finalUrl,
    })
  } catch (error) {
    next(error)
  }
}
exports.uploadFile = uploadFile
// Replace Single File Controller
// Replace Single File Controller
const replaceFile = async (req, res, next) => {
  try {
    const errors = (0, express_validator_1.validationResult)(req)
    if (!errors.isEmpty()) {
      throw new errorhandler_1.default('Validation Error', 400)
    }
    if (!req.file) {
      throw new errorhandler_1.default('No file uploaded', 400)
    }
    const publicId = req.query.publicId
    if (!publicId) {
      throw new errorhandler_1.default('Public ID is required', 400)
    }
    const fileType = req.file.mimetype
    if (!isValidFileType(fileType)) {
      throw new errorhandler_1.default(
        'Unsupported file type. Only images and PDFs are allowed.',
        400,
      )
    }
    const folder = process.env.CN_Folder
    // Sanitize the publicId by removing the file extension if present
    const sanitizedPublicId = publicId.replace(/\.[^/.]+$/, '')
    // Upload with overwrite option - this will automatically replace the existing file
    const uploadResult = await cloudinary_1.default.v2.uploader.upload(
      req.file.path,
      {
        folder,
        public_id: sanitizedPublicId,
        resource_type: fileType === 'application/pdf' ? 'raw' : 'image',
        overwrite: true, // This is the key to replacement
        invalidate: true, // Invalidate CDN cache
      },
    )
    await (0, exports.removeFile)(req.file.path)
    // For PDFs, remove the extension from the URL if present
    let finalUrl = uploadResult.secure_url
    if (fileType === 'application/pdf' && finalUrl.endsWith('.pdf')) {
      finalUrl = finalUrl.slice(0, -4)
    }
    // Add version parameter to bypass caching
    res.status(200).json({
      url: `${finalUrl}?v=${Date.now()}`,
    })
  } catch (error) {
    next(error)
  }
}
exports.replaceFile = replaceFile
// Upload Multiple Files Controller
const uploadMultipleFiles = async (req, res, next) => {
  try {
    const errors = (0, express_validator_1.validationResult)(req)
    if (!errors.isEmpty()) {
      throw new errorhandler_1.default('Validation Error', 400)
    }
    if (!req.files || Array.isArray(req.files) === false) {
      throw new errorhandler_1.default(
        'No files uploaded or invalid files array',
        400,
      )
    }
    // Handle multiple file uploads
    const uploadPromises = req.files.map(async file => {
      const fileType = file.mimetype
      if (!isValidFileType(fileType)) {
        throw new errorhandler_1.default(
          'Unsupported file type. Only images and PDFs are allowed.',
          400,
        )
      }
      const fileExtension = fileType === 'application/pdf' ? '.pdf' : ''
      const publicId = `${Date.now()}_${file.originalname.split('.')[0]}${fileExtension}`
      const uploadResult = await cloudinary_1.default.v2.uploader.upload(
        file.path,
        {
          folder: process.env.CN_Folder,
          public_id: publicId,
          resource_type: fileType === 'application/pdf' ? 'raw' : 'image',
        },
      )
      await (0, exports.removeFile)(file.path)
      return uploadResult.secure_url
    })
    // Wait for all uploads to finish
    const uploadedUrls = await Promise.all(uploadPromises)
    res.status(200).json({
      urls: uploadedUrls,
    })
  } catch (error) {
    next(error)
  }
}
exports.uploadMultipleFiles = uploadMultipleFiles
