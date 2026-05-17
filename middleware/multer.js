const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
})

module.exports = upload
