
"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "../types/Product";
import { formatPriceCOP } from "@/shared/utils/priceFormatter";
import { useCartStore } from "@/shared/store/cartStore";

export default function ProductCard({ product }: { product: Product }) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar que se ejecute el link
    e.stopPropagation(); // Evitar que se propague al contenedor
    
    addItem(product, 1);
    setShowSuccessMessage(true);
    
    // Ocultar el mensaje después de 2 segundos
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col relative">
      <Link href={`/producto/${product.slug}`} className="h-full flex flex-col">
        {/* Imagen del producto */}
        <div className="relative overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Badge de descuento (opcional) */}
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Nuevo
            </span>
          </div>

          {/* Botón de favoritos */}
          <button className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Contenido del producto */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Título con altura fija */}
          <div className="h-16 flex items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
              {product.name}
            </h3>
          </div>
          
          {/* Descripción con altura fija */}
          <div className="h-10 flex items-start mb-4">
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          {/* Precio */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {product.discount && product.discount > 0 ? (
                <>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPriceCOP(product.priceCents * (100 - product.discount) / 100)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPriceCOP(product.priceCents)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {formatPriceCOP(product.priceCents)}
                </span>
              )}
            </div>
            {product.discount && product.discount > 0 && (
              <div className="text-sm text-green-600 font-medium">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Botón de agregar al carrito - siempre al final */}
          <div className="mt-auto">
            <button 
              onClick={handleAddToCart}
              disabled={!product.active}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                product.active
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span>{product.active ? "Agregar al carrito" : "No disponible"}</span>
            </button>
          </div>
        </div>
      </Link>

      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="absolute top-4 left-4 right-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-lg flex items-center space-x-2 animate-fade-in z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold">¡Agregado!</span>
        </div>
      )}
    </div>
  );
}
