import { Product } from "@/modules/catalog/types/Product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  openCartOnAdd: boolean;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getShippingCost: () => number;
  getTotalWithShipping: () => number;
  setOpenCartOnAdd: (open: boolean) => void;
}
