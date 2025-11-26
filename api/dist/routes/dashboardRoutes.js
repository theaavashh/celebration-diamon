"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controllers/dashboardController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/stats', authMiddleware_1.authMiddleware, dashboardController_1.getDashboardStats);
router.get('/', async (_req, res) => {
    try {
        res.json({
            success: true,
            message: 'Dashboard endpoint',
            data: {
                stats: {},
                recent: []
            }
        });
    }
    catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data'
        });
    }
});
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map