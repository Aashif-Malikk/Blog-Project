const express = require('express')
const router = express.Router()
const authCtrl = require('../controller/authController')
const upload = require('../middleware/upload')
const verifyToken = require('../middleware/tokenMiddleware')

const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message || 'Upload failed' })
    }
    next()
  })
}

router.post('/sell', verifyToken, handleUpload, authCtrl.sellDetail)
router.get('/sell', authCtrl.viewImage)
router.post('/auth/signup',authCtrl.userRegister)
router.post('/auth/login',authCtrl.userLogin)
// router.get('/sell/mine', verifyToken, authCtrl.viewMyImages)


module.exports = router
