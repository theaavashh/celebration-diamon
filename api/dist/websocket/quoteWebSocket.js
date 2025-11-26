"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupQuoteWebSocket = setupQuoteWebSocket;
exports.getActiveQuotes = getActiveQuotes;
exports.getQuoteById = getQuoteById;
const socket_io_1 = require("socket.io");
const activeQuoteRequests = new Map();
const adminConnections = new Set();
const clientConnections = new Map();
function setupQuoteWebSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: [
                'http://localhost:3000',
                'http://localhost:3001',
                'http://localhost:3002',
                'http://localhost:3003',
                'http://localhost:3004'
            ],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        socket.on('admin:connect', () => {
            adminConnections.add(socket);
            console.log('Admin connected:', socket.id);
            const pendingQuotes = Array.from(activeQuoteRequests.values())
                .filter(quote => quote.status === 'pending');
            socket.emit('admin:quotes', pendingQuotes);
        });
        socket.on('client:connect', (data) => {
            const userId = data?.userId || socket.id;
            clientConnections.set(userId, socket);
            console.log('Client connected:', userId);
        });
        socket.on('client:request-quote', (data) => {
            const quoteId = `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const quoteRequest = {
                id: quoteId,
                productId: data.productId,
                productTitle: data.productTitle,
                productImage: data.productImage,
                userId: data.userId || socket.id,
                timestamp: new Date(),
                status: 'pending'
            };
            activeQuoteRequests.set(quoteId, quoteRequest);
            adminConnections.forEach(adminSocket => {
                adminSocket.emit('admin:new-quote', quoteRequest);
            });
            socket.emit('client:quote-requested', {
                success: true,
                quoteId,
                message: 'Quote request submitted successfully'
            });
            console.log('Quote request received:', quoteId);
        });
        socket.on('admin:set-price', (data) => {
            const quoteRequest = activeQuoteRequests.get(data.quoteId);
            if (!quoteRequest) {
                socket.emit('admin:error', {
                    message: 'Quote request not found'
                });
                return;
            }
            quoteRequest.price = data.price;
            quoteRequest.status = 'quoted';
            const clientSocket = clientConnections.get(quoteRequest.userId || '');
            if (clientSocket) {
                clientSocket.emit('client:quote-received', {
                    quoteId: quoteRequest.id,
                    productId: quoteRequest.productId,
                    productTitle: quoteRequest.productTitle,
                    productImage: quoteRequest.productImage,
                    price: data.price,
                    timestamp: quoteRequest.timestamp
                });
            }
            adminConnections.forEach(adminSocket => {
                adminSocket.emit('admin:quote-updated', quoteRequest);
            });
            console.log('Price set for quote:', data.quoteId, 'Price:', data.price);
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            adminConnections.delete(socket);
            for (const [userId, clientSocket] of clientConnections.entries()) {
                if (clientSocket.id === socket.id) {
                    clientConnections.delete(userId);
                    break;
                }
            }
        });
    });
    return io;
}
function getActiveQuotes() {
    return Array.from(activeQuoteRequests.values());
}
function getQuoteById(quoteId) {
    return activeQuoteRequests.get(quoteId);
}
//# sourceMappingURL=quoteWebSocket.js.map