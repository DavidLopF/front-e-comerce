import { api } from "../../../shared/api/client";
import { Product } from "../types/Product";

export const productService = {
  list: async (): Promise<Product[]> => {
    return api.get("/products"); 
  },
};
