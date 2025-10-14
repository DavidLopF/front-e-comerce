import { NextRequest, NextResponse } from 'next/server';
import { StoreConfigResponse } from '@/shared/types/StoreConfig';

// Datos mock para desarrollo
const MOCK_STORE_CONFIG = {
  store: {
    name: "TechStore Pro",
    description: "Tu tienda de tecnología de confianza con los mejores productos",
    slogan: "Tecnología al alcance de todos",
    logo: {
      url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200",
      alt: "Logo de TechStore Pro",
      width: 180,
      height: 50
    },
    favicon: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=32",
    contactEmail: "contacto@techstore.com",
    contactPhone: "+57 300 123 4567",
    socialMedia: {
      facebook: "https://facebook.com/techstore",
      instagram: "https://instagram.com/techstore",
      twitter: "https://twitter.com/techstore",
      whatsapp: "+57 300 123 4567"
    }
  },
  theme: {
    colors: {
      // Colores principales
      primary: "#F54927",
      primaryHover: "#E03E1F",
      secondary: "#918E44",
      secondaryHover: "#7A7A3A",
      accent: "#f59e0b",
      
      // Colores de fondo
      background: "#ffffff",
      backgroundAlt: "#f8fafc",
      
      // Colores de texto
      textPrimary: "#1f2937",
      textSecondary: "#6b7280",
      textMuted: "#9ca3af",
      
      // Colores de estado
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
      
      // Colores de UI
      border: "#e5e7eb",
      shadow: "rgba(0, 0, 0, 0.1)",
      overlay: "rgba(0, 0, 0, 0.5)"
    }
  },
  hero: {
    enabled: true,
    slides: [
      {
        id: "slide-1",
        title: "¡Nuevos Auriculares Premium!",
        subtitle: "Sonido de Alta Calidad",
        description: "Descubre la mejor experiencia de audio con nuestros auriculares inalámbricos",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920",
        imageUrlMobile: undefined,
        cta: {
          text: "Comprar Ahora",
          link: "/products/auriculares-inalambricos-premium",
          style: "primary" as const
        },
        alignment: "left" as const,
        backgroundColor: undefined,
        textColor: "#ffffff",
        overlay: true,
        overlayOpacity: 0.4,
        order: 1,
        isActive: true
      },
      {
        id: "slide-2",
        title: "Gaming de Última Generación",
        subtitle: "Laptops Potentes",
        description: "Equípate con la mejor tecnología para gaming profesional",
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920",
        imageUrlMobile: undefined,
        cta: {
          text: "Ver Ofertas",
          link: "/products/laptop-gaming-ultra",
          style: "primary" as const
        },
        secondaryCta: {
          text: "Explorar",
          link: "/products",
          style: "outline" as const
        },
        alignment: "center" as const,
        backgroundColor: "#000000",
        textColor: "#ffffff",
        overlay: true,
        overlayOpacity: 0.5,
        order: 2,
        isActive: true
      },
      {
        id: "slide-3",
        title: "Fotografía Profesional",
        subtitle: "Captura cada momento",
        description: "Cámaras 4K con la mejor tecnología del mercado",
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1920",
        imageUrlMobile: undefined,
        cta: {
          text: "Descubrir",
          link: "/products/camara-digital-4k",
          style: "secondary" as const
        },
        alignment: "right" as const,
        backgroundColor: undefined,
        textColor: "#ffffff",
        overlay: true,
        overlayOpacity: 0.3,
        order: 3,
        isActive: true
      }
    ]
  }
};

/**
 * Endpoint para obtener la configuración de la tienda
 * GET /api/store-config
 * 
 * Identifica la tienda por:
 * 1. Dominio (header host)
 * 2. Parámetro storeId en query
 * 3. Header X-Store-ID
 */
export async function GET(_request: NextRequest) {
  try {
    // Por ahora usamos datos mock para desarrollo
    // En producción, aquí conectarías con tu base de datos
    const storeConfig = MOCK_STORE_CONFIG;
    
    console.log('✅ Configuración mock cargada para tienda:', storeConfig.store.name);

    // Respuesta exitosa
    const response: StoreConfigResponse = {
      success: true,
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      data: storeConfig
    };

    return NextResponse.json(response, {
      headers: {
        // Cache por 1 hora, stale-while-revalidate por 2 horas
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        // ETag para invalidación de caché
        'ETag': `"config-${storeConfig.store.name}-${Date.now()}"`,
        // CORS si es necesario
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, X-Store-ID'
      }
    });

  } catch (error) {
    console.error('❌ Error en endpoint store-config:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Error interno del servidor'
        }
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

/**
 * Endpoint para invalidar caché (opcional)
 * POST /api/store-config/invalidate
 * 
 * Requiere autenticación de administrador
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación (implementar según tu sistema)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Token requerido' } },
        { status: 401 }
      );
    }

    const { action } = await request.json();
    
    if (action === 'invalidate') {
      // Aquí podrías implementar lógica para invalidar caché
      // Por ejemplo, notificar a Redis, CDN, etc.
      
      return NextResponse.json({
        success: true,
        message: 'Caché invalidado exitosamente'
      });
    }

    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ACTION', message: 'Acción no válida' } },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ Error en invalidación de caché:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Error interno del servidor'
        }
      },
      { status: 500 }
    );
  }
}

// Manejar OPTIONS para CORS
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID',
      'Access-Control-Max-Age': '86400'
    }
  });
}
