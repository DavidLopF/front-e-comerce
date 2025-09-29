"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "../types/Product";
import { formatPriceCOP } from "@/shared/utils/priceFormatter";
import { useCartStore } from "@/shared/store/cartStore";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.imageUrl || "");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const cartTotalItems = useCartStore((state) => state.getTotalItems());

  const handleAddToCart = () => {
    addItem(product, quantity);
    setShowSuccessMessage(true);
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
    
    // Resetear la cantidad a 1
    setQuantity(1);
  };

  // Ya no necesitamos esta función, usamos formatPriceCOP directamente

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/store" className="hover:text-blue-600">
              Tienda
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Miniaturas (si hubiera más imágenes) */}
            {product.imageUrl && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedImage(product.imageUrl || "")}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === product.imageUrl ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Título y precio */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  {product.discount && product.discount > 0 ? (
                    <>
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPriceCOP(product.priceCents * (100 - product.discount) / 100)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPriceCOP(product.priceCents)}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPriceCOP(product.priceCents)}
                    </span>
                  )}
                </div>
                {product.discount && product.discount > 0 && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    -{product.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del producto</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID del producto:</span>
                  <span className="text-gray-900 font-mono text-sm">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="text-gray-900">{product.category || "Sin categoría"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    product.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {product.active ? "Disponible" : "No disponible"}
                  </span>
                </div>
              </div>
            </div>

            {/* Selector de cantidad */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cantidad</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 transition-colors font-bold"
                    disabled={quantity <= 1}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-16 px-4 py-3 text-center text-lg font-bold text-gray-900 border-x-2 border-gray-300 bg-gray-50"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors font-bold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-500">Total:</span>
                  <span className="block text-xl font-bold text-gray-900">
                    {formatPriceCOP((product.discount && product.discount > 0 ? product.priceCents * (100 - product.discount) / 100 : product.priceCents) * quantity)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mensaje de éxito */}
            {showSuccessMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center space-x-3 animate-fade-in">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">¡Producto agregado al carrito! ({cartTotalItems} {cartTotalItems === 1 ? 'producto' : 'productos'})</span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.active}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center space-x-3 ${
                  product.active
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span>{product.active ? "Agregar al carrito" : "Producto no disponible"}</span>
              </button>

              <button className="w-full py-4 px-6 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Agregar a favoritos</span>
              </button>
            </div>

            {/* Información de envío */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900">Envío gratis</p>
                  <p className="text-sm text-blue-700">En compras superiores a {formatPriceCOP(5000000)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
