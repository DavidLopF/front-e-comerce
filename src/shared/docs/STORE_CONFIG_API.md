# Documentación del Endpoint de Configuración de Tienda

## Endpoint Principal

```
GET /api/store-config
```

Este endpoint retorna toda la configuración personalizable de la tienda, incluyendo colores, logo, hero, productos, etc.

---

## Estructura de Respuesta Exitosa

### HTTP 200 OK

```json
{
  "success": true,
  "version": "1.0.0",
  "lastUpdated": "2025-09-30T12:00:00Z",
  "data": {
    "store": {
      "name": "TechStore Pro",
      "description": "Tu tienda de tecnología de confianza",
      "slogan": "La mejor tecnología al mejor precio",
      "logo": {
        "url": "https://cdn.ejemplo.com/logos/techstore-logo.png",
        "alt": "TechStore Pro Logo",
        "width": 180,
        "height": 50
      },
      "favicon": "https://cdn.ejemplo.com/favicons/techstore-favicon.ico",
      "contactEmail": "contacto@techstore.com",
      "contactPhone": "+52 55 1234 5678",
      "socialMedia": {
        "facebook": "https://facebook.com/techstore",
        "instagram": "https://instagram.com/techstore",
        "twitter": "https://twitter.com/techstore",
        "tiktok": "https://tiktok.com/@techstore",
        "whatsapp": "https://wa.me/5255123456"
      }
    },
    
    "theme": {
      "colors": {
        "primary": "#3b82f6",
        "primaryHover": "#2563eb",
        "secondary": "#8b5cf6",
        "accent": "#f59e0b",
        "background": "#ffffff",
        "backgroundAlt": "#f9fafb",
        "textPrimary": "#111827",
        "textSecondary": "#6b7280",
        "textMuted": "#9ca3af",
        "success": "#10b981",
        "error": "#ef4444",
        "warning": "#f59e0b",
        "info": "#3b82f6",
        "border": "#e5e7eb",
        "shadow": "rgba(0, 0, 0, 0.1)",
        "overlay": "rgba(0, 0, 0, 0.5)"
      },
      "typography": {
        "fontFamily": {
          "primary": "'Inter', system-ui, sans-serif",
          "secondary": "'Playfair Display', Georgia, serif"
        },
        "fontSize": {
          "xs": "0.75rem",
          "sm": "0.875rem",
          "base": "1rem",
          "lg": "1.125rem",
          "xl": "1.25rem",
          "2xl": "1.5rem",
          "3xl": "1.875rem",
          "4xl": "2.25rem"
        }
      },
      "layout": {
        "borderRadius": {
          "sm": "0.25rem",
          "md": "0.5rem",
          "lg": "0.75rem",
          "xl": "1rem",
          "full": "9999px"
        },
        "maxWidth": "1280px"
      }
    },
    
    "hero": {
      "enabled": true,
      "autoplay": true,
      "autoplayInterval": 5000,
      "showArrows": true,
      "showDots": true,
      "slides": [
        {
          "id": 1,
          "title": "Bienvenidos a TechStore",
          "subtitle": "La mejor tecnología al mejor precio",
          "description": "Descubre nuestra amplia selección de productos tecnológicos de última generación",
          "imageUrl": "https://cdn.ejemplo.com/hero/slide-1-desktop.jpg",
          "imageUrlMobile": "https://cdn.ejemplo.com/hero/slide-1-mobile.jpg",
          "cta": {
            "text": "Ver Productos",
            "link": "/store",
            "style": "primary"
          },
          "secondaryCta": {
            "text": "Saber Más",
            "link": "/about",
            "style": "outline"
          },
          "order": 1,
          "isActive": true,
          "alignment": "left",
          "overlay": true,
          "overlayOpacity": 0.5,
          "backgroundColor": "#1e293b",
          "textColor": "#ffffff"
        },
        {
          "id": 2,
          "title": "Ofertas de Temporada",
          "subtitle": "Hasta 50% de descuento",
          "description": "Aprovecha nuestras ofertas especiales en productos seleccionados",
          "imageUrl": "https://cdn.ejemplo.com/hero/slide-2-desktop.jpg",
          "imageUrlMobile": "https://cdn.ejemplo.com/hero/slide-2-mobile.jpg",
          "cta": {
            "text": "Ver Ofertas",
            "link": "/store?filter=ofertas",
            "style": "accent"
          },
          "order": 2,
          "isActive": true,
          "alignment": "center",
          "overlay": true,
          "overlayOpacity": 0.6
        },
        {
          "id": 3,
          "title": "Nuevos Lanzamientos",
          "subtitle": "Lo último en tecnología",
          "description": "Descubre los productos más innovadores del mercado",
          "imageUrl": "https://cdn.ejemplo.com/hero/slide-3-desktop.jpg",
          "cta": {
            "text": "Explorar",
            "link": "/store?filter=nuevos",
            "style": "primary"
          },
          "order": 3,
          "isActive": true,
          "alignment": "right",
          "overlay": false
        }
      ]
    },
    
    "navigation": {
      "showSearch": true,
      "showCart": true,
      "menuItems": [
        {
          "id": "home",
          "label": "Inicio",
          "href": "/"
        },
        {
          "id": "store",
          "label": "Tienda",
          "href": "/store",
          "children": [
            {
              "id": "electronics",
              "label": "Electrónicos",
              "href": "/store?category=electronics"
            },
            {
              "id": "accessories",
              "label": "Accesorios",
              "href": "/store?category=accessories"
            }
          ]
        },
        {
          "id": "offers",
          "label": "Ofertas",
          "href": "/store?filter=ofertas",
          "badge": "Sale"
        },
        {
          "id": "cart",
          "label": "Carrito",
          "href": "/carrito"
        }
      ]
    },
    
    "features": {
      "enableWishlist": true,
      "enableReviews": true,
      "enableRelatedProducts": true,
      "enableCompare": false,
      "enableQuickView": true,
      "maxCartItems": 99,
      "showProductStock": true
    },
    
    "seo": {
      "title": "TechStore Pro - Tu tienda de tecnología",
      "description": "Encuentra los mejores productos de tecnología al mejor precio. Envíos a todo el país.",
      "keywords": ["tecnología", "electrónicos", "computadoras", "smartphones", "tablets"],
      "ogImage": "https://cdn.ejemplo.com/og/techstore-og-image.jpg"
    },
    
    "checkout": {
      "allowGuestCheckout": true,
      "requiredFields": ["name", "email", "phone", "address", "city", "postalCode"],
      "shippingMethods": [
        {
          "id": "standard",
          "name": "Envío Estándar",
          "description": "Entrega en 5-7 días hábiles",
          "priceCents": 9900,
          "estimatedDays": "5-7 días",
          "enabled": true
        },
        {
          "id": "express",
          "name": "Envío Express",
          "description": "Entrega en 1-2 días hábiles",
          "priceCents": 19900,
          "estimatedDays": "1-2 días",
          "enabled": true
        },
        {
          "id": "pickup",
          "name": "Recoger en Tienda",
          "description": "Recoge tu pedido sin costo adicional",
          "priceCents": 0,
          "estimatedDays": "1 día",
          "enabled": true
        }
      ],
      "paymentMethods": [
        {
          "id": "card",
          "name": "Tarjeta de Crédito/Débito",
          "type": "card",
          "icon": "https://cdn.ejemplo.com/icons/credit-card.svg",
          "enabled": true,
          "description": "Visa, Mastercard, American Express"
        },
        {
          "id": "paypal",
          "name": "PayPal",
          "type": "paypal",
          "icon": "https://cdn.ejemplo.com/icons/paypal.svg",
          "enabled": true
        },
        {
          "id": "oxxo",
          "name": "OXXO",
          "type": "cash",
          "icon": "https://cdn.ejemplo.com/icons/oxxo.svg",
          "enabled": true,
          "description": "Paga en cualquier tienda OXXO"
        },
        {
          "id": "transfer",
          "name": "Transferencia Bancaria",
          "type": "transfer",
          "icon": "https://cdn.ejemplo.com/icons/bank.svg",
          "enabled": true,
          "description": "Recibirás los datos bancarios por email"
        }
      ]
    }
  }
}
```

---

## Estructura de Respuesta con Error

### HTTP 4xx/5xx

```json
{
  "success": false,
  "error": {
    "code": "CONFIG_NOT_FOUND",
    "message": "No se encontró la configuración para esta tienda"
  }
}
```

### Códigos de Error Comunes

| Código | HTTP Status | Descripción |
|--------|-------------|-------------|
| `CONFIG_NOT_FOUND` | 404 | No se encontró configuración para el dominio/ID |
| `UNAUTHORIZED` | 401 | Falta autenticación o token inválido |
| `FORBIDDEN` | 403 | No tienes permisos para acceder a esta configuración |
| `INVALID_DOMAIN` | 400 | El dominio proporcionado no es válido |
| `SERVER_ERROR` | 500 | Error interno del servidor |

---

## Endpoint Alternativo (Multi-tenant)

Si tienes múltiples tiendas, puedes usar un endpoint con parámetro:

```
GET /api/store-config/:storeId
```

O usar subdominios/dominios:

```
GET /api/store-config
Header: X-Store-Domain: mitienda.com
```

---

## Caché y Actualización

### Headers Recomendados

```
Cache-Control: public, max-age=3600, s-maxage=7200
ETag: "config-version-1.0.0-hash"
Last-Modified: Tue, 30 Sep 2025 12:00:00 GMT
```

### Endpoint para Invalidar Caché

```
POST /api/store-config/invalidate
Authorization: Bearer <admin-token>
```

---

## Consideraciones de Implementación

### Backend

1. **Base de Datos**: Almacenar en una tabla `store_configurations` con columnas JSON
2. **Validación**: Validar que los colores sean hexadecimales válidos
3. **CDN**: Servir las imágenes desde un CDN
4. **Versioning**: Mantener versiones de configuración para rollback
5. **Caché**: Implementar caché en Redis o similar
6. **Multi-tenant**: Identificar tienda por dominio, subdominio o ID

### Frontend

1. **Caché Local**: Guardar configuración en localStorage
2. **Fallback**: Tener configuración por defecto si falla el endpoint
3. **Validación**: Validar tipos de datos recibidos
4. **Hot Reload**: Permitir actualizar tema sin recargar página
5. **CSS Variables**: Inyectar colores como CSS custom properties

---

## Ejemplo de Uso en el Frontend

```typescript
import { configService } from '@/shared/services/ConfigService';

// En un componente o layout
async function loadStoreConfig() {
  try {
    // Intentar obtener del caché primero (válido por 60 min)
    let config = configService.getCachedConfig(60);
    
    if (!config) {
      // Si no hay caché, obtener del servidor
      config = await configService.getStoreConfig();
    }
    
    // Aplicar configuración
    applyTheme(config.theme);
    updateMetadata(config.seo);
    
    return config;
  } catch (error) {
    console.error('Error cargando configuración:', error);
    // Usar configuración por defecto
  }
}

// Aplicar colores del tema
function applyTheme(theme) {
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
}
```

---

## Ventajas de este Enfoque

✅ **Centralizado**: Toda la configuración en un solo endpoint
✅ **Escalable**: Fácil agregar nuevas opciones de personalización
✅ **Performance**: Sistema de caché multinivel (browser + localStorage + server)
✅ **Multi-tenant**: Soporta múltiples tiendas desde el mismo código
✅ **Flexible**: Cada tienda puede tener configuración completamente diferente
✅ **Tipo-seguro**: TypeScript proporciona autocompletado y validación
✅ **Fallback**: Siempre tiene configuración por defecto si falla el API
