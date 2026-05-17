const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Sell = require('../models/schema').Image
const User = require('../models/schema').User
const secretkey = process.env.SECRET_KEY || 'defaultSecretKey'

// ---------------- Selling (multipart: field name "image") ----------------

exports.sellDetail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Image file is required' })
    }

    const { title, description, tags, price } = req.body

    if (!title || !String(title).trim()) {
      return res.status(400).json({ msg: 'Title is required' })
    }

    let fileMeta = {}
    if (req.body.fileMeta) {
      try {
        fileMeta = JSON.parse(req.body.fileMeta)
      } catch {
        fileMeta = {}
      }
    }

    const imgSrc = req.file?.path || ''
    const selling = new Sell({
      title: String(title).trim(),
      description: description != null ? String(description) : '',
      fileMeta: fileMeta != null && typeof fileMeta === 'object' ? fileMeta : {},
      tags: tags != null ? String(tags) : '',
      imgSrc,
      price: price != null ? String(price) : '',
      user: req.userId,
    })

    await selling.save()

    return res.json({ msg: 'Image Uploaded Successfully', imgSrc })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      msg: 'Server error',
      error: err.message,
    })
  }
}

// ---------------- View Images ----------------

exports.viewImage = async (req, res) => {
  try {
    const sellData = await Sell.find().populate('user', 'name email').sort({ createdAt: -1 })
    return res.json(sellData)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      msg: 'Server error',
      error: error.message,
    })
  }
}

// exports.viewMyImages = async (req, res) => {
//   try {
//     const sellData = await Sell.find({ user: req.userId }).sort({ createdAt: -1 })
//     return res.json(sellData)
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ msg: 'Server error', error: error.message })
//   }
// }

// ---------------- User Registration ----------------

exports.userRegister = async (req, res) => {
  console.log(req.body);
  const { fullName, email, password } = req.body
  let userfound = await User.findOne({ email })
  if (userfound) {
    res.send({ message: "User already exists!" })
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      const newuser = new User({ name: fullName, email, password: hashedPassword });
      await newuser.save();
      res.send({ message: "User registered successfully!" })
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Registration failed!" });
    }
  }
}

// ---------------- User Login ----------------

exports.userLogin = async (req, res) => {

  try {
    let { email, password } = req.body
    let userfound = await User.findOne({ email })
    console.log(userfound);

    if (userfound) {
      try {
        const passwordMatch = await bcrypt.compare(password, userfound.password);
        console.log("passwordMatch:", passwordMatch, secretkey);
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Authentication failed' });
        }

        const token = jwt.sign({ userId: userfound._id, name: userfound.name }, secretkey, {
          expiresIn: '20d',
        });

        console.log("token: ", token);

        return res.status(200).json({ token });
      } catch (error) {
        return res.status(500).json({ error: 'Login failed' });
      }
    } else {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    console.log(error);

    res.status(400).send({
      msg: "Validation Error",
      error: error.message
    });
  }
}