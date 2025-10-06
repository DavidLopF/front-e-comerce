'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/modules/catalog/types/Product';
import { productService } from '@/modules/catalog/services/ProductSevice';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  getFeatured: (limit?: number) => Product[];
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 ProductProvider: Cargando productos...');
      const productsData = await productService.list();
      setProducts(productsData);
      console.log('✅ ProductProvider: Productos cargados:', productsData.length, productsData);
    } catch (err) {
      console.error('❌ ProductProvider: Error cargando productos:', err);
      setError('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Siempre cargar productos en cada recarga de página
    loadProducts();
  }, []);

  const getFeatured = (limit: number = 3): Product[] => {
    return products.filter(product => product.active).slice(0, limit);
  };

  const refreshProducts = async () => {
    setLoading(true);
    await loadProducts();
  };

  const value: ProductContextType = {
    products,
    loading,
    error,
    getFeatured,
    refreshProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext(): ProductContextType {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext debe ser usado dentro de un ProductProvider');
  }
  return context;
}