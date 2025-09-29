import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartState, CartItem } from '../types/Cart';
import { Product } from '@/modules/catalog/types/Product';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      openCartOnAdd: false,
      
      addItem: (product: Product, quantity: number) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            // Si el producto ya existe, incrementar la cantidad
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // Si no existe, agregarlo al carrito
          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            // Si la cantidad es 0 o menos, eliminar el item
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.product.id === productId
                ? { ...item, quantity }
                : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.discount && item.product.discount > 0
            ? item.product.priceCents * (100 - item.product.discount) / 100
            : item.product.priceCents;
          return total + (price * item.quantity);
        }, 0);
      },

      setOpenCartOnAdd: (open: boolean) => {
        set({ openCartOnAdd: open });
      },
    }),
    {
      name: 'cart-storage', // nombre único para el localStorage
      storage: createJSONStorage(() => localStorage), // usar localStorage para persistencia
    }
  )
);
