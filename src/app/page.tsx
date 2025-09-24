// src/app/page.tsx
import HeroSection from "@/modules/catalog/ui/HeroSection";
import CatalogLayout from "@/modules/catalog/ui/CatalogLayout";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Pantalla completa */}
      <HeroSection />

      {/* Main Content */}
      <div id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CatalogLayout />
      </div>
    </div>
  );
}
