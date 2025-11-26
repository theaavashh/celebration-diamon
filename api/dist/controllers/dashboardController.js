"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const database_1 = __importDefault(require("../config/database"));
const getDashboardStats = async (req, res) => {
    try {
        const [totalProducts, totalQuoteRequests, totalCollections, activeGalleries, activeTestimonials, totalGalleries, recentQuoteRequests, categories] = await Promise.all([
            database_1.default.product.count({ where: { isActive: true } }),
            database_1.default.quoteRequest.count(),
            database_1.default.collection.count(),
            database_1.default.gallery.count({ where: { isActive: true } }),
            database_1.default.testimonial.count({ where: { isActive: true } }),
            database_1.default.gallery.count(),
            database_1.default.quoteRequest.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setDate(new Date().getDate() - 30))
                    }
                }
            }),
            database_1.default.category.findMany({
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
        const lastMonthStart = new Date();
        lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
        lastMonthStart.setDate(1);
        lastMonthStart.setHours(0, 0, 0, 0);
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);
        const [lastMonthQuotes, thisMonthQuotes] = await Promise.all([
            database_1.default.quoteRequest.count({
                where: {
                    createdAt: {
                        gte: lastMonthStart,
                        lt: thisMonthStart
                    }
                }
            }),
            database_1.default.quoteRequest.count({
                where: {
                    createdAt: {
                        gte: thisMonthStart
                    }
                }
            })
        ]);
        const quoteRequestsGrowth = lastMonthQuotes > 0
            ? ((thisMonthQuotes - lastMonthQuotes) / lastMonthQuotes) * 100
            : (thisMonthQuotes > 0 ? 100 : 0);
        const recentQuotes = await database_1.default.quote.findMany({
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
        const recentQuoteRequestsList = await database_1.default.quoteRequest.findMany({
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