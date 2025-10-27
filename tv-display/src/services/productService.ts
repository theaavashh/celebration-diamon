import TV_DISPLAY_CONFIG from '@/config/tvConfig';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  images?: string[];
  stock: number;
  isActive: boolean;
}

export const productService = {
  async fetchProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${TV_DISPLAY_CONFIG.apiBaseUrl}/products`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Ensure the response has the correct structure
      if (Array.isArray(data)) {
        return data.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
          images: product.imageUrl ? [product.imageUrl] : product.images || ['/diamond-placeholder.svg'],
          stock: product.stock || 0,
          isActive: product.isActive !== undefined ? product.isActive : true,
        }));
      }
      
      // If the response is an object with a products array
      if (data.products && Array.isArray(data.products)) {
        return data.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
          images: product.imageUrl ? [product.imageUrl] : product.images || ['/diamond-placeholder.svg'],
          stock: product.stock || 0,
          isActive: product.isActive !== undefined ? product.isActive : true,
        }));
      }
      
      throw new Error('Invalid API response format');
    } catch (error) {
      console.error('Error fetching products from API:', error);
      
      // Return fallback products
      return TV_DISPLAY_CONFIG.fallbackProducts.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: undefined,
        images: product.images || ['/diamond-placeholder.svg'],
        stock: product.stock || 0,
        isActive: product.isActive,
      }));
    }
  }
};

export default productService;
