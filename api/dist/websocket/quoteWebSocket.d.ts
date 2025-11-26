import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
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
export declare function setupQuoteWebSocket(server: HTTPServer): SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare function getActiveQuotes(): QuoteRequest[];
export declare function getQuoteById(quoteId: string): QuoteRequest | undefined;
export {};
//# sourceMappingURL=quoteWebSocket.d.ts.map