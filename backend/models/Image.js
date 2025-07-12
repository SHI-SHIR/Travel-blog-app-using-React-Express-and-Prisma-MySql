const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  image: {
    type: String, // base64 or URL string
    required: true,
  },
  // add more fields if needed (e.g. title, description, uploadedBy, etc.)
});

module.exports = mongoose.model('Image', ImageSchema);
