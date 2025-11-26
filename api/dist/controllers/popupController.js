"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePopupImage = exports.togglePopupImageStatus = exports.uploadPopupImage = exports.getAllPopupImages = exports.getActivePopupImage = exports.upload = void 0;
const database_1 = __importDefault(require("../config/database"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads/popup');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `popup-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
exports.upload = upload;
const getActivePopupImage = async (req, res) => {
    try {
        const popupImage = await database_1.default.popupImage.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        if (!popupImage) {
            return res.status(404).json({
                success: false,
                message: 'No active popup image found'
            });
        }
        res.json({
            success: true,
            data: popupImage
        });
    }
    catch (error) {
        console.error('Error fetching active popup image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch popup image',
            error: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
    }
};
exports.getActivePopupImage = getActivePopupImage;
const getAllPopupImages = async (req, res) => {
    try {
        const popupImages = await database_1.default.popupImage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            data: popupImages,
            count: popupImages.length
        });
    }
    catch (error) {
        console.error('Error fetching popup images:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch popup images',
            error: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
    }
};
exports.getAllPopupImages = getAllPopupImages;
const uploadPopupImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }
        await database_1.default.popupImage.updateMany({
            where: { isActive: true },
            data: { isActive: false }
        });
        const popupImage = await database_1.default.popupImage.create({
            data: {
                fileName: req.file.filename,
                originalName: req.file.originalname,
                filePath: req.file.path,
                mimeType: req.file.mimetype,
                fileSize: req.file.size,
                isActive: true
            }
        });
        res.status(201).json({
            success: true,
            message: 'Popup image uploaded successfully',
            data: popupImage
        });
    }
    catch (error) {
        console.error('Error uploading popup image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload popup image',
            error: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
    }
};
exports.uploadPopupImage = uploadPopupImage;
const togglePopupImageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const existingImage = await database_1.default.popupImage.findUnique({
            where: { id }
        });
        if (!existingImage) {
            return res.status(404).json({
                success: false,
                message: 'Popup image not found'
            });
        }
        if (!existingImage.isActive) {
            await database_1.default.popupImage.updateMany({
                where: { isActive: true },
                data: { isActive: false }
            });
        }
        const updatedImage = await database_1.default.popupImage.update({
            where: { id },
            data: {
                isActive: !existingImage.isActive
            }
        });
        res.json({
            success: true,
            message: `Popup image ${updatedImage.isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedImage
        });
    }
    catch (error) {
        console.error('Error toggling popup image status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle popup image status',
            error: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
    }
};
exports.togglePopupImageStatus = togglePopupImageStatus;
const deletePopupImage = async (req, res) => {
    try {
        const { id } = req.params;
        const existingImage = await database_1.default.popupImage.findUnique({
            where: { id }
        });
        if (!existingImage) {
            return res.status(404).json({
                success: false,
                message: 'Popup image not found'
            });
        }
        if (fs_1.default.existsSync(existingImage.filePath)) {
            fs_1.default.unlinkSync(existingImage.filePath);
        }
        await database_1.default.popupImage.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Popup image deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting popup image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete popup image',
            error: process.env['NODE_ENV'] === 'development' ? error.message : undefined
        });
    }
};
exports.deletePopupImage = deletePopupImage;
//# sourceMappingURL=popupController.js.map