const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Image file is required' })
  }

  return res.json({
    success: true,
    imageUrl: req.file.path,
  })
})

module.exports = router
