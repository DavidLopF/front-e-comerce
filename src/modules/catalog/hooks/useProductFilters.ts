'use client';

import { useState, useMemo } from 'react';
import { Product } from '../types/Product';

interface FilterState {
  category: string;
  priceRange: [number, number];
  searchTerm: string;
  sortBy: string;
}

export function useProductFilters(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    priceRange: [0, 2000],
    searchTerm: '',
    sortBy: 'name'
  });

  // Obtener categorías únicas de los productos
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [products]);

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filtro por búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.slug.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por categoría
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filtro por rango de precios
    filtered = filtered.filter(product => {
      // priceCents ya está en pesos, no necesita dividirse
      const priceInPesos = product.priceCents;
      return priceInPesos >= filters.priceRange[0] && priceInPesos <= filters.priceRange[1];
    });

    // Ordenar productos
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price':
          return a.priceCents - b.priceCents;
        case 'price-desc':
          return b.priceCents - a.priceCents;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 2000],
      searchTerm: '',
      sortBy: 'name'
    });
  };

  return {
    filters,
    filteredProducts,
    categories,
    updateFilters,
    clearFilters
  };
}
