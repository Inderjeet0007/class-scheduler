import multer from "multer";
import path from "path";

// Configure multer to store CSVs in /uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, process.env.UPLOAD_DIR);
  },
  filename(req, file, cb) {
    cb(null, `upload-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Only accept CSV files
function checkFileType(file, cb) {
  const filetypes = /csv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) return cb(null, true);
  else cb("CSV files only!");
}

export const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});
