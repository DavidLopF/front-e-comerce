import { useState, useEffect } from 'react';
import { StoreConfig } from '../types/StoreConfig';
import { configService } from '../services/ConfigService';

/**
 * Hook personalizado para obtener y usar la configuración de la tienda
 * Incluye caché local y manejo de errores
 */
export function useStoreConfig() {
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      // Intentar obtener del caché primero
      const cachedConfig = configService.getCachedConfig(60); // 60 minutos
      
      if (cachedConfig) {
        setConfig(cachedConfig);
        setLoading(false);
        return;
      }

      // Si no hay caché válido, obtener del servidor
      const freshConfig = await configService.getStoreConfig();
      setConfig(freshConfig);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      console.error('Error al cargar configuración de la tienda:', err);
    } finally {
      setLoading(false);
    }
  };

  const reloadConfig = async () => {
    configService.clearConfigCache();
    await loadConfig();
  };

  return {
    config,
    loading,
    error,
    reloadConfig,
  };
}

/**
 * Hook para aplicar el tema de colores de la tienda
 * Inyecta CSS custom properties basados en la configuración
 */
export function useTheme(config: StoreConfig | null) {
  useEffect(() => {
    if (!config) return;

    const root = document.documentElement;
    const colors = config.theme.colors;

    // Aplicar colores como CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Aplicar tipografía
    if (config.theme.typography) {
      const { fontFamily } = config.theme.typography;
      root.style.setProperty('--font-primary', fontFamily.primary);
      if (fontFamily.secondary) {
        root.style.setProperty('--font-secondary', fontFamily.secondary);
      }
    }

    // Aplicar border radius
    if (config.theme.layout?.borderRadius) {
      Object.entries(config.theme.layout.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value);
      });
    }

    // Aplicar max width
    if (config.theme.layout?.maxWidth) {
      root.style.setProperty('--max-width', config.theme.layout.maxWidth);
    }
  }, [config]);
}

/**
 * Hook para actualizar el metadata de la página
 */
export function useStoreSEO(config: StoreConfig | null) {
  useEffect(() => {
    if (!config?.seo) return;

    // Actualizar título
    if (config.seo.title) {
      document.title = config.seo.title;
    }

    // Actualizar meta description
    if (config.seo.description) {
      updateMetaTag('description', config.seo.description);
    }

    // Actualizar meta keywords
    if (config.seo.keywords) {
      updateMetaTag('keywords', config.seo.keywords.join(', '));
    }

    // Actualizar Open Graph image
    if (config.seo.ogImage) {
      updateMetaTag('og:image', config.seo.ogImage, 'property');
    }
  }, [config]);
}

function updateMetaTag(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attr}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}
