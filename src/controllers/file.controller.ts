import cloudinary from 'cloudinary'
import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import fs from 'fs/promises' // Use promises for better error handling
import ErrorHandler from '../utils/errorhandler'

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CN_Cloud_name,
  api_key: process.env.CN_Api_key,
  api_secret: process.env.CN_Api_secret,
})

const isValidFileType = (mimeType: string): boolean => {
  return mimeType.startsWith('image/') || mimeType === 'application/pdf'
}

export const removeFile = async (filePath: string) => {
  try {
    await fs.unlink(filePath)
  } catch (err) {
    console.error('Error deleting file:', err)
  }
}

// Upload Single File Controller
export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new ErrorHandler('Validation Error', 400)
    }

    if (!req.file) {
      throw new ErrorHandler('No file uploaded', 400)
    }

    const fileType = req.file.mimetype
    if (!isValidFileType(fileType)) {
      throw new ErrorHandler(
        'Unsupported file type. Only images and PDFs are allowed.',
        400,
      )
    }

    // Determine the file extension
    const fileExtension = fileType === 'application/pdf' ? '.pdf' : ''

    // Generate a unique public ID and include the extension for Cloudinary
    const publicId = `${Date.now()}_${req.file.originalname.split('.')[0]}${fileExtension}`

    const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: process.env.CN_Folder,
      public_id: publicId,
      resource_type: fileType === 'application/pdf' ? 'raw' : 'image',
    })

    await removeFile(req.file.path)

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

// Replace Single File Controller
// Replace Single File Controller
export const replaceFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new ErrorHandler('Validation Error', 400)
    }

    if (!req.file) {
      throw new ErrorHandler('No file uploaded', 400)
    }

    const publicId = req.query.publicId as string
    if (!publicId) {
      throw new ErrorHandler('Public ID is required', 400)
    }

    const fileType = req.file.mimetype
    if (!isValidFileType(fileType)) {
      throw new ErrorHandler(
        'Unsupported file type. Only images and PDFs are allowed.',
        400,
      )
    }

    const folder = process.env.CN_Folder
    // Sanitize the publicId by removing the file extension if present
    const sanitizedPublicId = publicId.replace(/\.[^/.]+$/, '')

    // Upload with overwrite option - this will automatically replace the existing file
    const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
      folder,
      public_id: sanitizedPublicId,
      resource_type: fileType === 'application/pdf' ? 'raw' : 'image',
      overwrite: true, // This is the key to replacement
      invalidate: true, // Invalidate CDN cache
    })

    await removeFile(req.file.path)

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
// Upload Multiple Files Controller
export const uploadMultipleFiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new ErrorHandler('Validation Error', 400)
    }

    if (!req.files || Array.isArray(req.files) === false) {
      throw new ErrorHandler('No files uploaded or invalid files array', 400)
    }

    // Handle multiple file uploads
    const uploadPromises = req.files.map(async (file: Express.Multer.File) => {
      const fileType = file.mimetype
      if (!isValidFileType(fileType)) {
        throw new ErrorHandler(
          'Unsupported file type. Only images and PDFs are allowed.',
          400,
        )
      }

      const fileExtension = fileType === 'application/pdf' ? '.pdf' : ''
      const publicId = `${Date.now()}_${file.originalname.split('.')[0]}${fileExtension}`

      const uploadResult = await cloudinary.v2.uploader.upload(file.path, {
        folder: process.env.CN_Folder,
        public_id: publicId,
        resource_type: fileType === 'application/pdf' ? 'raw' : 'image',
      })

      await removeFile(file.path)

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
