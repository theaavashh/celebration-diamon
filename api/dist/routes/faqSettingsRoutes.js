"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const faqSettingsController_1 = require("../controllers/faqSettingsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', faqSettingsController_1.getFaqSettings);
router.get('/admin', authMiddleware_1.authMiddleware, faqSettingsController_1.getFaqSettings);
router.put('/', authMiddleware_1.authMiddleware, faqSettingsController_1.updateFaqSettings);
router.put('/admin', authMiddleware_1.authMiddleware, faqSettingsController_1.updateFaqSettings);
exports.default = router;
//# sourceMappingURL=faqSettingsRoutes.js.map