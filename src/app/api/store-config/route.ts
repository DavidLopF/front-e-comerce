import { NextRequest, NextResponse } from 'next/server';
import { PrismaConfigService } from '@/shared/services/PrismaConfigService';
import { StoreConfigResponse } from '@/shared/types/StoreConfig';

/**
 * Endpoint para obtener la configuración de la tienda
 * GET /api/store-config
 * 
 * Identifica la tienda por:
 * 1. Dominio (header host)
 * 2. Parámetro storeId en query
 * 3. Header X-Store-ID
 */
export async function GET(request: NextRequest) {
  try {
    let storeConfig = null;
    
    // Método 1: Por dominio (header host)
    const host = request.headers.get('host');
    if (host) {
      console.log('🔍 Buscando tienda por dominio:', host);
      storeConfig = await PrismaConfigService.getStoreConfigByDomain(host);
    }

    // Método 2: Por parámetro storeId en query
    if (!storeConfig) {
      const { searchParams } = new URL(request.url);
      const storeId = searchParams.get('storeId');
      
      if (storeId) {
        console.log('🔍 Buscando tienda por ID:', storeId);
        storeConfig = await PrismaConfigService.getStoreConfigById(storeId);
      }
    }

    // Método 3: Por header personalizado X-Store-ID
    if (!storeConfig) {
      const storeIdFromHeader = request.headers.get('x-store-id');
      
      if (storeIdFromHeader) {
        console.log('🔍 Buscando tienda por header X-Store-ID:', storeIdFromHeader);
        storeConfig = await PrismaConfigService.getStoreConfigById(storeIdFromHeader);
      }
    }

    // Si no se encontró configuración
    if (!storeConfig) {
      console.warn('⚠️ No se encontró configuración para:', {
        host,
        searchParams: Object.fromEntries(new URL(request.url).searchParams),
        headers: {
          'x-store-id': request.headers.get('x-store-id')
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFIG_NOT_FOUND',
            message: 'No se encontró configuración para esta tienda'
          }
        },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'public, max-age=300' // Cache por 5 minutos en caso de error
          }
        }
      );
    }

    console.log('✅ Configuración encontrada para tienda:', storeConfig.store.name);

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
export async function OPTIONS(request: NextRequest) {
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
