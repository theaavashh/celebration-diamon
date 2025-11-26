"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const popupController_1 = require("../controllers/popupController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/active', popupController_1.getActivePopupImage);
router.get('/admin/all', authMiddleware_1.authMiddleware, popupController_1.getAllPopupImages);
router.post('/upload', authMiddleware_1.authMiddleware, popupController_1.upload.single('image'), popupController_1.uploadPopupImage);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, popupController_1.togglePopupImageStatus);
router.delete('/:id', authMiddleware_1.authMiddleware, popupController_1.deletePopupImage);
exports.default = router;
//# sourceMappingURL=popupRoutes.js.map