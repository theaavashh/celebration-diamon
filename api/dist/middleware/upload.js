"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMixedFiles = exports.uploadProductImages = exports.uploadHeroImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ensureDirectoryExists = (dirPath) => {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const fieldName = file.fieldname;
        let destination = 'uploads/';
        if (fieldName === 'icon' && (req.path.includes('/categories') || req.originalUrl.includes('/categories'))) {
            destination = 'uploads/categories/icons/';
        }
        else if (fieldName === 'image' && (req.path.includes('/categories') || req.originalUrl.includes('/categories'))) {
            destination = 'uploads/categories/images/';
        }
        else if ((fieldName === 'navImage1' || fieldName === 'navImage2') && (req.path.includes('/categories') || req.originalUrl.includes('/categories'))) {
            destination = 'uploads/categories/nav-images/';
        }
        else if (fieldName === 'image' && (req.path.includes('/hero') || req.originalUrl.includes('/hero'))) {
            destination = 'uploads/hero/';
        }
        else if (fieldName === 'images' && (req.path.includes('/products') || req.originalUrl.includes('/products'))) {
            destination = 'uploads/products/';
        }
        else if (fieldName === 'image' && (req.path.includes('/services') || req.originalUrl.includes('/services'))) {
            destination = 'uploads/services/';
        }
        else if (fieldName === 'image' && (req.path.includes('/testimonials') || req.originalUrl.includes('/testimonials'))) {
            destination = 'uploads/testimonials/';
        }
        else if (fieldName === 'image' && (req.path.includes('/about-us') || req.originalUrl.includes('/about-us'))) {
            destination = 'uploads/about-us/';
        }
        else if (fieldName === 'image' && (req.path.includes('/stores') || req.originalUrl.includes('/stores'))) {
            destination = 'uploads/stores/';
        }
        else if (fieldName === 'images') {
            destination = 'uploads/products/';
        }
        else {
            destination = 'uploads/';
        }
        ensureDirectoryExists(destination);
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image and video files are allowed!'));
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024,
    }
});
exports.default = upload;
exports.uploadHeroImage = upload.single('image');
exports.uploadProductImages = upload.array('images', 10);
exports.uploadMixedFiles = upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'video', maxCount: 1 }
]);
//# sourceMappingURL=upload.js.map