"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFaqSettings = exports.getFaqSettings = void 0;
const database_1 = __importDefault(require("../config/database"));
const getFaqSettings = async (_req, res) => {
    try {
        const settings = await database_1.default.fAQSectionSettings.findFirst();
        res.json({
            success: true,
            data: settings || {
                title: '',
                subtitle: '',
                isActive: true
            }
        });
    }
    catch (error) {
        console.error('Error fetching FAQ settings:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching FAQ settings'
        });
    }
};
exports.getFaqSettings = getFaqSettings;
const updateFaqSettings = async (req, res) => {
    try {
        const { title, subtitle, isActive = true } = req.body;
        if (!title || typeof title !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }
        const existingSettings = await database_1.default.fAQSectionSettings.findFirst();
        const updatedSettings = existingSettings
            ? await database_1.default.fAQSectionSettings.update({
                where: { id: existingSettings.id },
                data: {
                    title: title.trim(),
                    subtitle: subtitle?.trim() || null,
                    isActive,
                    updatedAt: new Date()
                }
            })
            : await database_1.default.fAQSectionSettings.create({
                data: {
                    title: title.trim(),
                    subtitle: subtitle?.trim() || null,
                    isActive
                }
            });
        res.json({
            success: true,
            data: updatedSettings,
            message: 'FAQ settings updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating FAQ settings:', error);
        res.status(500).json({
            success: false,
            error: 'Error updating FAQ settings'
        });
    }
};
exports.updateFaqSettings = updateFaqSettings;
//# sourceMappingURL=faqSettingsController.js.map