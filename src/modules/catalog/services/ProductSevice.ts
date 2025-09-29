import { api } from "../../../shared/api/client";
import { Product } from "../types/Product";

export const productService = {
  list: async (): Promise<Product[]> => {
    return api.get("/products") as unknown as Product[]; 
  },
  getBySlug: async (slug: string): Promise<Product | null> => {
    try {
      return await api.get(`/products/${slug}`) as unknown as Product;
    } catch (error) {
      console.error("Error fetching product by slug:", error);
      return null;
    }
  },
};
