// Tipos para la configuración completa de la tienda

export interface StoreConfig {
  // Información básica de la tienda
  store: {
    name: string;
    description: string;
    slogan?: string;
    logo: {
      url: string;
      alt: string;
      width?: number;
      height?: number;
    };
    favicon?: string;
    contactEmail?: string;
    contactPhone?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      tiktok?: string;
      whatsapp?: string;
    };
  };

  // Configuración de colores del tema
  theme: {
    colors: {
      // Colores principales
      primary: string;        // Color principal de la marca
      primaryHover: string;   // Color principal en hover
      secondary: string;      // Color secundario
      secondaryHover: string; // Color secundario en hover
      accent: string;         // Color de acento para CTAs importantes
      
      // Colores de fondo
      background: string;     // Fondo principal
      backgroundAlt: string;  // Fondo alternativo/secundario
      
      // Colores de texto
      textPrimary: string;    // Texto principal
      textSecondary: string;  // Texto secundario/subtítulos
      textMuted: string;      // Texto deshabilitado/placeholder
      
      // Colores de estado
      success: string;        // Verde para éxito
      error: string;          // Rojo para errores
      warning: string;        // Amarillo para advertencias
      info: string;           // Azul para información
      
      // Colores de UI
      border: string;         // Bordes
      shadow: string;         // Sombras
      overlay: string;        // Overlay/backdrop
    };
    
    // Configuración de tipografía
    typography?: {
      fontFamily: {
        primary: string;      // Fuente principal
        secondary?: string;   // Fuente secundaria (títulos, etc)
      };
      fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
      };
    };
    
    // Configuración de espaciado y bordes
    layout?: {
      borderRadius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        full: string;
      };
      maxWidth: string;       // Ancho máximo del contenedor
    };
  };

  // Configuración del Hero/Banner principal
  hero: {
    enabled: boolean;
    slides: HeroSlideConfig[];
    autoplay?: boolean;
    autoplayInterval?: number; // en milisegundos
    showArrows?: boolean;
    showDots?: boolean;
  };

  // Configuración de navegación
  navigation?: {
    showSearch?: boolean;
    showCart?: boolean;
    menuItems?: MenuItem[];
  };

  // Configuración de características
  features?: {
    enableWishlist?: boolean;
    enableReviews?: boolean;
    enableRelatedProducts?: boolean;
    enableCompare?: boolean;
    enableQuickView?: boolean;
    maxCartItems?: number;
    showProductStock?: boolean;
  };

  // SEO y Metadata
  seo?: {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
  };

  // Configuración de checkout y pagos
  checkout?: {
    allowGuestCheckout?: boolean;
    requiredFields?: string[];
    shippingMethods?: ShippingMethod[];
    paymentMethods?: PaymentMethod[];
  };
}

export interface HeroSlideConfig {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  imageUrlMobile?: string; // Imagen específica para móviles
  cta?: {
    text: string;
    link: string;
    style?: 'primary' | 'secondary' | 'outline' | 'accent';
  };
  secondaryCta?: {
    text: string;
    link: string;
    style?: 'primary' | 'secondary' | 'outline' | 'accent';
  };
  order: number;
  isActive: boolean;
  backgroundColor?: string; // Color de fondo del slide
  textColor?: string;       // Color del texto del slide
  alignment?: 'left' | 'center' | 'right';
  overlay?: boolean;        // Si tiene overlay oscuro sobre la imagen
  overlayOpacity?: number;  // Opacidad del overlay (0-1)
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: MenuItem[]; // Para submenús
  badge?: string;        // Para mostrar badges (ej: "Nuevo", "Sale")
}

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  estimatedDays?: string;
  enabled: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'paypal' | 'transfer' | 'cash' | 'other';
  icon?: string;
  enabled: boolean;
  description?: string;
}

// Ejemplo de respuesta exitosa del endpoint
export interface StoreConfigResponse {
  success: boolean;
  data: StoreConfig;
  version?: string;        // Versión de la configuración para caché
  lastUpdated?: string;    // Timestamp de última actualización
}

// Ejemplo de respuesta con error
export interface StoreConfigErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
