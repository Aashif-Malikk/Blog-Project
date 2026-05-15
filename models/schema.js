const mongoose = require("mongoose");

const sellingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imgSrc: { type: String, required: true },
    /** Frontend sends an object { name, size, dimensions } — use Mixed, not String */
    fileMeta: { type: mongoose.Schema.Types.Mixed, default: {} },
    tags: { type: String, default: '' },
    price: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

// 2. User Schema Configuration
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// 3. Multi-Module Export
module.exports = {
  User: mongoose.model("User", userSchema),
  Image: mongoose.model("Image", sellingSchema)
};

