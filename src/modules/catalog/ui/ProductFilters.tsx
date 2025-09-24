'use client';

import { useState } from 'react';

interface FilterState {
  category: string;
  priceRange: [number, number];
  searchTerm: string;
  sortBy: string;
}

interface ProductFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  categories: string[];
}

export default function ProductFilters({ onFiltersChange, categories }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    priceRange: [0, 2000],
    searchTerm: '',
    sortBy: 'name'
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: [0, 2000],
      searchTerm: '',
      sortBy: 'name'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Limpiar todo
        </button>
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar productos
        </label>
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          placeholder="Escribe aquí..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Categorías */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Categoría
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={filters.category === ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="mr-3 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Todas las categorías</span>
          </label>
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rango de precios */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Rango de precios
        </label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mínimo"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Máximo"
            />
          </div>
          <div className="text-sm text-gray-600">
            ${filters.priceRange[0].toLocaleString('es-CO')} - ${filters.priceRange[1].toLocaleString('es-CO')}
          </div>
        </div>
      </div>

      {/* Ordenar por */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Ordenar por
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="name">Nombre (A-Z)</option>
          <option value="name-desc">Nombre (Z-A)</option>
          <option value="price">Precio (Menor a Mayor)</option>
          <option value="price-desc">Precio (Mayor a Menor)</option>
        </select>
      </div>

      {/* Resultados */}
      <div className="pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Filtros activos:</span>
          <div className="mt-2 space-y-1">
            {filters.searchTerm && (
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                Búsqueda: "{filters.searchTerm}"
              </span>
            )}
            {filters.category && (
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">
                {filters.category}
              </span>
            )}
            <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
              ${filters.priceRange[0].toLocaleString('es-CO')} - ${filters.priceRange[1].toLocaleString('es-CO')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
