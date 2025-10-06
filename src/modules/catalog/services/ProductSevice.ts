import { api } from "../../../shared/api/client";
import { Product } from "../types/Product";

// Cache simple para evitar llamadas duplicadas en la misma sesión
let productsCache: Product[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 segundos

export const productService = {
  list: async (forceRefresh: boolean = false): Promise<Product[]> => {
    const now = Date.now();
    
    // Si tenemos cache válido y no se fuerza refresh, usar cache
    if (!forceRefresh && productsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('🚀 ProductService: Usando productos desde cache');
      return productsCache;
    }
    
    console.log('🔄 ProductService: Llamando a API /products');
    const products = await api.get("/products") as unknown as Product[];
    
    // Actualizar cache
    productsCache = products;
    cacheTimestamp = now;
    
    console.log('✅ ProductService: Productos cargados y cacheados:', products.length);
    return products;
  },
  getBySlug: async (slug: string): Promise<Product | null> => {
    try {
      return await api.get(`/products/${slug}`) as unknown as Product;
    } catch (error) {
      console.error("Error fetching product by slug:", error);
      return null;
    }
  },
  getFeatured: async (limit: number = 3): Promise<Product[]> => {
    try {
      const products = await productService.list();
      // Obtener productos destacados (los primeros 'limit' productos activos)
      const featured = products.filter(product => product.active).slice(0, limit);
      console.log('🌟 ProductService: Productos destacados:', featured.length);
      return featured;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  },
  clearCache: () => {
    productsCache = null;
    cacheTimestamp = 0;
    console.log('🗑️ ProductService: Cache limpiado');
  }
};
