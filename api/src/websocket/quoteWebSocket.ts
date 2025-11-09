import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { ApiResponse } from '../types';

interface QuoteRequest {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  userId?: string;
  timestamp: Date;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  price?: number;
}

// Store active quote requests
const activeQuoteRequests = new Map<string, QuoteRequest>();
// Store admin connections
const adminConnections = new Set<Socket>();
// Store client connections (inhouse-digital-browser)
const clientConnections = new Map<string, Socket>();

export function setupQuoteWebSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
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

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Handle admin connection
    socket.on('admin:connect', () => {
      adminConnections.add(socket);
      console.log('Admin connected:', socket.id);
      
      // Send all pending quote requests to the admin
      const pendingQuotes = Array.from(activeQuoteRequests.values())
        .filter(quote => quote.status === 'pending');
      
      socket.emit('admin:quotes', pendingQuotes);
    });

    // Handle client (inhouse-digital-browser) connection
    socket.on('client:connect', (data: { userId?: string }) => {
      const userId = data?.userId || socket.id;
      clientConnections.set(userId, socket);
      console.log('Client connected:', userId);
    });

    // Handle quote request from client
    socket.on('client:request-quote', (data: {
      productId: string;
      productTitle: string;
      productImage: string;
      userId?: string;
    }) => {
      const quoteId = `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const quoteRequest: QuoteRequest = {
        id: quoteId,
        productId: data.productId,
        productTitle: data.productTitle,
        productImage: data.productImage,
        userId: data.userId || socket.id,
        timestamp: new Date(),
        status: 'pending'
      };

      activeQuoteRequests.set(quoteId, quoteRequest);

      // Notify all connected admins
      adminConnections.forEach(adminSocket => {
        adminSocket.emit('admin:new-quote', quoteRequest);
      });

      // Confirm to client
      socket.emit('client:quote-requested', {
        success: true,
        quoteId,
        message: 'Quote request submitted successfully'
      });

      console.log('Quote request received:', quoteId);
    });

    // Handle price update from admin
    socket.on('admin:set-price', (data: {
      quoteId: string;
      price: number;
    }) => {
      const quoteRequest = activeQuoteRequests.get(data.quoteId);
      
      if (!quoteRequest) {
        socket.emit('admin:error', {
          message: 'Quote request not found'
        });
        return;
      }

      // Update quote request
      quoteRequest.price = data.price;
      quoteRequest.status = 'quoted';

      // Notify the client who requested the quote
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

      // Notify all admins of the update
      adminConnections.forEach(adminSocket => {
        adminSocket.emit('admin:quote-updated', quoteRequest);
      });

      console.log('Price set for quote:', data.quoteId, 'Price:', data.price);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Remove from admin connections
      adminConnections.delete(socket);
      
      // Remove from client connections
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

export function getActiveQuotes(): QuoteRequest[] {
  return Array.from(activeQuoteRequests.values());
}

export function getQuoteById(quoteId: string): QuoteRequest | undefined {
  return activeQuoteRequests.get(quoteId);
}







