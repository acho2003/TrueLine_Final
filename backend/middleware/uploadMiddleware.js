const multer = require('multer');
const path = require('path');

// Configure how files are stored
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Specifies that files should be saved in the 'uploads/' directory
  },
  filename(req, file, cb) {
    // Creates a unique filename to avoid naming conflicts
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Function to check that only image files are uploaded
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Success
  } else {
    cb('Error: Images Only!'); // Throws an error if the file is not an image
  }
}

// Initialize multer with the storage and file filter configurations
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;

