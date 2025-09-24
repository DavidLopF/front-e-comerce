import { api } from "../../../shared/api/client";

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  cta: string;
  ctaLink: string;
  order: number;
  isActive: boolean;
}

export const heroService = {
  getSlides: async (): Promise<HeroSlide[]> => {
    try {
      return await api.get<HeroSlide[]>("/hero-slides");
    } catch (error) {
      // Fallback a datos mock si la API no está disponible
      console.warn('Error al obtener slides del hero, usando datos mock:', error);
      return getMockSlides();
    }
  }
};

// Datos mock para desarrollo
function getMockSlides(): HeroSlide[] {
  return [
    {
      id: 1,
      title: "Bienvenidos a Nuestra Tienda",
      subtitle: "Descubre productos de calidad excepcional",
      description: "Encuentra todo lo que necesitas con la mejor tecnología y diseño",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Explorar Productos",
      ctaLink: "#catalogo",
      order: 1,
      isActive: true
    },
    {
      id: 2,
      title: "Tecnología de Vanguardia",
      subtitle: "Los últimos dispositivos tecnológicos",
      description: "Desde smartphones hasta laptops gaming, tenemos lo mejor para ti",
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Ver Tecnología",
      ctaLink: "#catalogo",
      order: 2,
      isActive: true
    },
    {
      id: 3,
      title: "Calidad Garantizada",
      subtitle: "Productos seleccionados cuidadosamente",
      description: "Cada producto pasa por rigurosos controles de calidad",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      cta: "Conocer Más",
      ctaLink: "#catalogo",
      order: 3,
      isActive: true
    }
  ];
}
