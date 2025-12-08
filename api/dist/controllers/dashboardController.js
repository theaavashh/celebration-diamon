"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const database_1 = __importDefault(require("../config/database"));
const getDashboardStats = async (req, res) => {
    try {
        const safeCount = async (model) => {
            try {
                if (model && typeof model.count === 'function') {
                    return await model.count();
                }
            }
            catch { }
            return 0;
        };
        const safeCountWhere = async (model, where) => {
            try {
                if (model && typeof model.count === 'function') {
                    return await model.count({ where });
                }
            }
            catch { }
            return 0;
        };
        const safeFindMany = async (model, args) => {
            try {
                if (model && typeof model.findMany === 'function') {
                    return await model.findMany(args);
                }
            }
            catch { }
            return [];
        };
        const [totalProducts, totalQuoteRequests, activeGalleries, activeTestimonials, totalGalleries, recentQuoteRequests, categories] = await Promise.all([
            safeCountWhere(database_1.default.product, { isActive: true }),
            safeCount(database_1.default.quoteRequest),
            safeCountWhere(database_1.default.gallery, { isActive: true }),
            safeCountWhere(database_1.default.testimonial, { isActive: true }),
            safeCount(database_1.default.gallery),
            safeCountWhere(database_1.default.quoteRequest, {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 30))
                }
            }),
            safeFindMany(database_1.default.category, {
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' },
                take: 5,
                select: {
                    id: true,
                    title: true,
                    imageUrl: true,
                    isActive: true,
                    sortOrder: true
                }
            })
        ]);
        let totalCollections = 0;
        try {
            totalCollections = await database_1.default.collection.count();
        }
        catch {
            totalCollections = 0;
        }
        const lastMonthStart = new Date();
        lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
        lastMonthStart.setDate(1);
        lastMonthStart.setHours(0, 0, 0, 0);
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);
        const [lastMonthQuotes, thisMonthQuotes] = await Promise.all([
            safeCountWhere(database_1.default.quoteRequest, {
                createdAt: {
                    gte: lastMonthStart,
                    lt: thisMonthStart
                }
            }),
            safeCountWhere(database_1.default.quoteRequest, {
                createdAt: {
                    gte: thisMonthStart
                }
            })
        ]);
        const quoteRequestsGrowth = lastMonthQuotes > 0
            ? ((thisMonthQuotes - lastMonthQuotes) / lastMonthQuotes) * 100
            : (thisMonthQuotes > 0 ? 100 : 0);
        const recentQuotes = await safeFindMany(database_1.default.quote, {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            take: 5,
            select: {
                id: true,
                text: true,
                author: true,
                isActive: true
            }
        });
        const recentQuoteRequestsList = await safeFindMany(database_1.default.quoteRequest, {
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                name: true,
                email: true,
                productId: true,
                status: true,
                createdAt: true,
                product: {
                    select: {
                        name: true
                    }
                }
            }
        });
        const stats = {
            overview: {
                totalProducts,
                totalQuoteRequests,
                totalCollections,
                totalVisitors: 0,
                activeGalleries,
                activeTestimonials,
                recentQuoteRequests,
                totalGalleries
            },
            growth: {
                quoteRequests: {
                    percentage: Math.round(quoteRequestsGrowth * 100) / 100,
                    current: thisMonthQuotes,
                    previous: lastMonthQuotes
                }
            },
            categories,
            recentQuotes,
            recentQuoteRequests: recentQuoteRequestsList
        };
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=dashboardController.js.map