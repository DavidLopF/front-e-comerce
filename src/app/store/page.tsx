import CatalogLayout from "@/modules/catalog/ui/CatalogLayout";

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la tienda */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestra Tienda</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra amplia selección de productos de alta calidad. 
              Encuentra exactamente lo que necesitas con nuestros filtros avanzados.
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal con filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <CatalogLayout />
      </div>
    </div>
  );
}
