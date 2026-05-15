const path = require('path')
const fs = require('fs')
const multer = require('multer')

const uploadDir = path.join(__dirname, '..', 'uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    const base = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${base}${ext}`)
  },
})

const imageFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase())
  const mimeOk = allowed.test(file.mimetype)
  if (extOk && mimeOk) cb(null, true)
  else cb(new Error('Only JPEG, PNG, and WEBP images are allowed'))
}

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: imageFilter,
})

module.exports = upload
