"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const galleryController_1 = require("../controllers/galleryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const galleryValidation_1 = require("../validation/galleryValidation");
const zod_1 = require("zod");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/gallery');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'gallery-item-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg/;
        const allowedVideoTypes = /mp4|webm|ogg|mov/;
        const extname = path_1.default.extname(file.originalname).toLowerCase();
        const isImage = allowedImageTypes.test(extname) && file.mimetype.startsWith('image/');
        const isVideo = allowedVideoTypes.test(extname) && file.mimetype.startsWith('video/');
        if (isImage || isVideo) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image and video files are allowed!'));
        }
    }
});
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError && error.errors) {
                const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: errorMessages,
                    issues: error.errors
                });
            }
            next(error);
        }
    };
};
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError && error.errors) {
                const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
                return res.status(400).json({
                    success: false,
                    error: 'Query validation failed',
                    details: errorMessages,
                    issues: error.errors
                });
            }
            next(error);
        }
    };
};
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError && error.errors) {
                const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
                return res.status(400).json({
                    success: false,
                    error: 'Parameter validation failed',
                    details: errorMessages,
                    issues: error.errors
                });
            }
            next(error);
        }
    };
};
router.get('/', validateQuery(galleryValidation_1.GalleryQuerySchema), galleryController_1.getAllGalleries);
router.get('/admin', authMiddleware_1.authMiddleware, validateQuery(galleryValidation_1.GalleryQuerySchema), galleryController_1.getAllGalleriesAdmin);
router.get('/:id', validateParams(galleryValidation_1.GalleryIdSchema), galleryController_1.getGalleryById);
router.post('/', authMiddleware_1.authMiddleware, validateRequest(galleryValidation_1.CreateGalleryRequestSchema), galleryController_1.createGallery);
router.put('/:id', authMiddleware_1.authMiddleware, validateParams(galleryValidation_1.GalleryIdSchema), validateRequest(galleryValidation_1.UpdateGalleryRequestSchema), galleryController_1.updateGallery);
router.delete('/:id', authMiddleware_1.authMiddleware, validateParams(galleryValidation_1.GalleryIdSchema), galleryController_1.deleteGallery);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, validateParams(galleryValidation_1.GalleryIdSchema), galleryController_1.toggleGalleryStatus);
router.post('/upload-image', authMiddleware_1.authMiddleware, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file provided'
            });
        }
        const fileUrl = `/uploads/gallery/${req.file.filename}`;
        const fileType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
        res.status(200).json({
            success: true,
            data: {
                imageUrl: fileUrl,
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimeType: req.file.mimetype,
                fileType: fileType
            },
            message: 'File uploaded successfully'
        });
    }
    catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload file'
        });
    }
});
exports.default = router;
//# sourceMappingURL=galleryRoutes.js.map