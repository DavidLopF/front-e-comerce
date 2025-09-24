'use client';

import { useState, useMemo, useEffect } from 'react';
import { Product } from '../types/Product';
import { productService } from '../services/ProductSevice';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';

interface FilterState {
  category: string;
  priceRange: [number, number];
  searchTerm: string;
  sortBy: string;
}

export default function CatalogLayout() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    priceRange: [0, 200000], // Rango en centavos (0 a $2000)
    searchTerm: '',
    sortBy: 'name'
  });

  useEffect(() => {
    // Cargar productos
    const loadProducts = async () => {
      try {
        console.log('🔄 Cargando productos...');
        const productsData = await productService.list();
        console.log('✅ Productos cargados:', productsData);
        setProducts(productsData);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

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
        product.code.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por categoría
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filtro por rango de precios
    filtered = filtered.filter(product =>
      product.priceCents >= filters.priceRange[0] && product.priceCents <= filters.priceRange[1]
    );

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

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar con filtros */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded mb-2 w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar con filtros */}
      <div className="lg:w-80 flex-shrink-0">
        <ProductFilters 
          onFiltersChange={handleFiltersChange}
          categories={categories}
        />
      </div>

      {/* Contenido principal */}
      <div className="flex-1">
        {/* Header del catálogo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nuestros Productos
          </h1>
          <p className="text-gray-600">
            Encuentra exactamente lo que buscas entre {filteredProducts.length} productos disponibles
          </p>
        </div>

        {/* Resultados */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500 mb-4">
              Intenta ajustar los filtros para ver más resultados
            </p>
            <button
              onClick={() => setFilters({
                category: '',
                priceRange: [0, 200000], // Rango en centavos (0 a $2000)
                searchTerm: '',
                sortBy: 'name'
              })}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            {/* Información de resultados */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Mostrando {filteredProducts.length} de {products.length} productos
              </p>
              
              {/* Vista de grid/list toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Vista:</span>
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Paginación (opcional) */}
            {filteredProducts.length > 12 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md">
                    1
                  </button>
                  <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Siguiente
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
