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
            message: 'SEO settings endpoint',
            data: {}
        });
    }
    catch (error) {
        console.error('Error fetching SEO settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching SEO settings'
        });
    }
});
router.put('/', async (_req, res) => {
    try {
        res.json({
            success: true,
            message: 'SEO settings updated',
            data: _req.body
        });
    }
    catch (error) {
        console.error('Error updating SEO settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating SEO settings'
        });
    }
});
exports.default = router;
//# sourceMappingURL=seoRoutes.js.map