"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const topBannerController_1 = require("../controllers/topBannerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/active', topBannerController_1.getActiveTopBanners);
router.get('/admin/all', authMiddleware_1.authMiddleware, topBannerController_1.getAllTopBanners);
router.post('/admin/create', authMiddleware_1.authMiddleware, topBannerController_1.createTopBanner);
router.put('/admin/:id', authMiddleware_1.authMiddleware, topBannerController_1.updateTopBanner);
router.delete('/admin/:id', authMiddleware_1.authMiddleware, topBannerController_1.deleteTopBanner);
router.patch('/admin/:id/toggle', authMiddleware_1.authMiddleware, topBannerController_1.toggleTopBannerStatus);
exports.default = router;
//# sourceMappingURL=topBannerRoutes.js.map