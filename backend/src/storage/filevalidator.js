import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.constant.js";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "../constants/fileUpload.constant.js";

// Memory storage, not disk storage — the buffer exists only long enough
// to stream straight into MinIO via storage.service.uploadObject. The
// file is never written to the app server's local filesystem, so
// there's no temp-file cleanup path to get wrong.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, `Unsupported file type: ${file.mimetype}`));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});


const handleUpload = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return next(new ApiError(HTTP_STATUS.BAD_REQUEST, err.message));
      }
      return next(err); // already an ApiError from fileFilter, or unknown
    }
    next();
  });
};

export const uploadSingleFile = handleUpload(upload.single("file"));