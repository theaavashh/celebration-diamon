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
            message: 'Admin endpoint',
            data: {}
        });
    }
    catch (error) {
        console.error('Error fetching admin data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admin data'
        });
    }
});
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map