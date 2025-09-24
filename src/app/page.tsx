// src/app/page.tsx
import HeroSection from "@/modules/catalog/ui/HeroSection";
import CatalogLayout from "@/modules/catalog/ui/CatalogLayout";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HeroSection />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CatalogLayout />
      </div>
    </div>
  );
}
