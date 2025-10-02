import { api } from "../api/client";
import { StoreConfig, StoreConfigResponse } from "../types/StoreConfig";

export const configService = {
  /**
   * Obtiene la configuración completa de la tienda
   * @param storeId - ID o slug de la tienda (opcional, se detecta automáticamente)
   * @returns Promise con la configuración de la tienda
   */
  getStoreConfig: async (storeId?: string): Promise<StoreConfig> => {
    try {
      // Determinar el storeId si no se proporciona
      let finalStoreId = storeId;
      
      if (!finalStoreId && typeof window !== 'undefined') {
        // Intentar obtener de la URL o localStorage
        const urlParams = new URLSearchParams(window.location.search);
        finalStoreId = urlParams.get('store') || 
                      localStorage.getItem('current-store') ||
                      //variable de entorno
                      process.env.NEXT_STORE_NAME 
                      
      }
      
      // Construir la URL del endpoint
      const endpoint = finalStoreId ? `/common/store-config?store=${finalStoreId}` : '/common/store-config';
      
      const response = await api.get<StoreConfigResponse>(endpoint);
      
      // Guardar en localStorage para caché
      if (typeof window !== 'undefined' && response.data) {
        localStorage.setItem('store-config', JSON.stringify({
          data: response.data,
          version: response.version || '1.0.0',
          lastUpdated: response.lastUpdated || new Date().toISOString(),
          storeId: finalStoreId
        }));
        
        // Guardar el storeId actual
        if (finalStoreId) {
          localStorage.setItem('current-store', finalStoreId);
        }
      }
      
      return response.data;
    } catch (error) {
      console.warn('Error al obtener configuración de la tienda, usando configuración mock:', error);
      return getMockConfig();
    }
  },

  /**
   * Obtiene la configuración del caché si está disponible y es válida
   * @param maxAgeMinutes Edad máxima del caché en minutos (default: 60)
   * @returns La configuración cacheada o null si no es válida
   */
  getCachedConfig: (maxAgeMinutes: number = 60): StoreConfig | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem('store-config');
      if (!cached) return null;
      
      const { data, lastUpdated } = JSON.parse(cached);
      const cacheAge = Date.now() - new Date(lastUpdated).getTime();
      const maxAge = maxAgeMinutes * 60 * 1000;
      
      if (cacheAge < maxAge) {
        return data;
      }
      
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Limpia el caché de configuración
   */
  clearConfigCache: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('store-config');
    }
  }
};

// Configuración mock para desarrollo/fallback
function getMockConfig(): StoreConfig {
  return {
    store: {
      name: "TechStore",
      description: "Tu tienda de tecnología de confianza",
      slogan: "La mejor tecnología al mejor precio",
      logo: {
        url: "/logo.svg",
        alt: "TechStore Logo",
        width: 180,
        height: 50,
      },
      favicon: "/favicon.ico",
      contactEmail: "contacto@techstore.com",
      contactPhone: "+52 55 1234 5678",
      socialMedia: {
        facebook: "https://facebook.com/techstore",
        instagram: "https://instagram.com/techstore",
        twitter: "https://twitter.com/techstore",
        whatsapp: "https://wa.me/5255123456",
      }
    },
    theme: {
      colors: {
        primary: "#3b82f6",
        primaryHover: "#2563eb",
        secondary: "#8b5cf6",
        secondaryHover: "#7c3aed",
        accent: "#f59e0b",
        background: "#ffffff",
        backgroundAlt: "#f9fafb",
        textPrimary: "#111827",
        textSecondary: "#6b7280",
        textMuted: "#9ca3af",
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
        border: "#e5e7eb",
        shadow: "rgba(0, 0, 0, 0.1)",
        overlay: "rgba(0, 0, 0, 0.5)",
      },
      typography: {
        fontFamily: {
          primary: "system-ui, -apple-system, sans-serif",
          secondary: "Georgia, serif",
        },
        fontSize: {
          xs: "0.75rem",
          sm: "0.875rem",
          base: "1rem",
          lg: "1.125rem",
          xl: "1.25rem",
          '2xl': "1.5rem",
          '3xl': "1.875rem",
          '4xl': "2.25rem",
        }
      },
      layout: {
        borderRadius: {
          sm: "0.25rem",
          md: "0.5rem",
          lg: "0.75rem",
          xl: "1rem",
          full: "9999px",
        },
        maxWidth: "1280px",
      }
    },
    hero: {
      enabled: true,
      autoplay: true,
      autoplayInterval: 5000,
      showArrows: true,
      showDots: true,
      slides: [
        {
          id: 1,
          title: "Bienvenidos a TechStore",
          subtitle: "La mejor tecnología al mejor precio",
          description: "Descubre nuestra amplia selección de productos de alta calidad",
          imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
          imageUrlMobile: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          cta: {
            text: "Ver Productos",
            link: "#catalogo",
            style: "primary"
          },
          order: 1,
          isActive: true,
          alignment: "left",
          overlay: true,
          overlayOpacity: 0.5,
        }
      ]
    },
    navigation: {
      showSearch: true,
      showCart: true,
      menuItems: [
        {
          id: "home",
          label: "Inicio",
          href: "/",
        },
        {
          id: "store",
          label: "Tienda",
          href: "/store",
        },
        {
          id: "cart",
          label: "Carrito",
          href: "/carrito",
        }
      ]
    },
    features: {
      enableWishlist: true,
      enableReviews: true,
      enableRelatedProducts: true,
      enableCompare: false,
      enableQuickView: true,
      maxCartItems: 99,
      showProductStock: true,
    },
    seo: {
      title: "TechStore - Tu tienda de tecnología",
      description: "Encuentra los mejores productos de tecnología al mejor precio",
      keywords: ["tecnología", "electrónicos", "computadoras", "smartphones"],
      ogImage: "/og-image.jpg",
    },
    checkout: {
      allowGuestCheckout: true,
      requiredFields: ["name", "email", "phone", "address"],
      shippingMethods: [
        {
          id: "standard",
          name: "Envío Estándar",
          description: "Entrega en 5-7 días hábiles",
          priceCents: 9900,
          estimatedDays: "5-7 días",
          enabled: true,
        },
        {
          id: "express",
          name: "Envío Express",
          description: "Entrega en 1-2 días hábiles",
          priceCents: 19900,
          estimatedDays: "1-2 días",
          enabled: true,
        },
      ],
      paymentMethods: [
        {
          id: "card",
          name: "Tarjeta de Crédito/Débito",
          type: "card",
          enabled: true,
        },
        {
          id: "paypal",
          name: "PayPal",
          type: "paypal",
          enabled: true,
        },
        {
          id: "transfer",
          name: "Transferencia Bancaria",
          type: "transfer",
          enabled: true,
          description: "Recibirás los datos bancarios por email",
        },
      ]
    }
  };
}
