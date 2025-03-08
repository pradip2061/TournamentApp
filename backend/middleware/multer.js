const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: './uploads/', // Ensure this folder exists
    filename: (req, file, cb) => {
      cb(null, `image_${Date.now()}${path.extname(file.originalname)}`);
    },
  });

  module.exports = {multer,storage}