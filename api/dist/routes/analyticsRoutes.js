"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', async (_req, res) => {
    try {
        res.json({
            success: true,
            message: 'Analytics endpoint',
            data: {}
        });
    }
    catch (error) {
        console.error('Error fetching analytics data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics data'
        });
    }
});
exports.default = router;
//# sourceMappingURL=analyticsRoutes.js.map