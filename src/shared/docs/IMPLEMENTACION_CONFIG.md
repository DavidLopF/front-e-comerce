# Guía de Implementación: Sistema de Configuración de Tienda

## 📋 Resumen

Este sistema permite que tu e-commerce sea completamente personalizable a través de un endpoint API, facilitando la venta a múltiples clientes con diferentes configuraciones de marca, colores, productos, etc.

---

## 🏗️ Arquitectura

### Estructura de Archivos Creados

```
src/
├── shared/
│   ├── types/
│   │   └── StoreConfig.ts          # Tipos TypeScript para toda la configuración
│   ├── services/
│   │   └── ConfigService.ts        # Servicio para obtener la configuración
│   ├── hooks/
│   │   └── useStoreConfig.ts       # Hooks React para usar la configuración
│   ├── providers/
│   │   └── StoreConfigProvider.tsx # Context Provider para la configuración
│   └── docs/
│       ├── STORE_CONFIG_API.md     # Documentación completa del API
│       └── store-config-example.json # Ejemplo de respuesta JSON
```

---

## 🚀 Implementación Paso a Paso

### Paso 1: Configurar el Provider en el Layout Principal

Edita `src/app/layout.tsx`:

```typescript
import { StoreConfigProvider } from "@/shared/providers/StoreConfigProvider";
import Navbar from "@/shared/ui/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <StoreConfigProvider>
          <Navbar />
          {children}
        </StoreConfigProvider>
      </body>
    </html>
  );
}
```

### Paso 2: Usar la Configuración en Componentes

```typescript
'use client';

import { useStoreConfigContext } from '@/shared/providers/StoreConfigProvider';

export default function MiComponente() {
  const { config, loading, error } = useStoreConfigContext();

  if (loading) return <div>Cargando configuración...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!config) return null;

  return (
    <div>
      <h1>{config.store.name}</h1>
      <p>{config.store.description}</p>
      
      {/* Usar colores del tema */}
      <button
        style={{
          backgroundColor: config.theme.colors.primary,
          color: '#fff'
        }}
      >
        Comprar Ahora
      </button>
    </div>
  );
}
```

### Paso 3: Aplicar Tema Global con CSS Variables

Crea `src/app/globals.css` con las variables CSS:

```css
:root {
  /* Los colores se inyectan dinámicamente desde el StoreConfigProvider */
  /* Pero puedes definir fallbacks aquí */
  --color-primary: #3b82f6;
  --color-primaryHover: #2563eb;
  --color-background: #ffffff;
  --color-text: #111827;
  
  /* Tipografía */
  --font-primary: system-ui, -apple-system, sans-serif;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  
  /* Max width */
  --max-width: 1280px;
}

/* Usa las variables en tus estilos */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: var(--color-primaryHover);
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
}
```

### Paso 4: Actualizar el Hero Section

Modifica `src/modules/catalog/ui/HeroSection.tsx` para usar la configuración:

```typescript
'use client';

import { useStoreConfigContext } from '@/shared/providers/StoreConfigProvider';

export default function HeroSection() {
  const { config } = useStoreConfigContext();

  if (!config?.hero.enabled || config.hero.slides.length === 0) {
    return null;
  }

  const slides = config.hero.slides.filter(slide => slide.isActive);

  return (
    <section className="hero-section">
      {slides.map((slide) => (
        <div
          key={slide.id}
          className="hero-slide"
          style={{
            backgroundImage: `url(${slide.imageUrl})`,
            backgroundColor: slide.backgroundColor,
            color: slide.textColor,
          }}
        >
          <div className={`hero-content text-${slide.alignment}`}>
            {slide.subtitle && <p className="subtitle">{slide.subtitle}</p>}
            <h1>{slide.title}</h1>
            {slide.description && <p>{slide.description}</p>}
            
            {slide.cta && (
              <a
                href={slide.cta.link}
                className={`btn btn-${slide.cta.style}`}
              >
                {slide.cta.text}
              </a>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
```

### Paso 5: Actualizar el Navbar

Modifica `src/shared/ui/Navbar.tsx`:

```typescript
'use client';

import { useStoreConfigContext } from '@/shared/providers/StoreConfigProvider';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const { config } = useStoreConfigContext();

  if (!config) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <Image
            src={config.store.logo.url}
            alt={config.store.logo.alt}
            width={config.store.logo.width || 180}
            height={config.store.logo.height || 50}
          />
        </Link>

        {/* Menú */}
        <ul className="navbar-menu">
          {config.navigation?.menuItems?.map((item) => (
            <li key={item.id}>
              <Link href={item.href}>
                {item.label}
                {item.badge && <span className="badge">{item.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* Carrito y búsqueda */}
        <div className="navbar-actions">
          {config.navigation?.showSearch && <SearchButton />}
          {config.navigation?.showCart && <CartButton />}
        </div>
      </div>
    </nav>
  );
}
```

---

## 🔧 Configuración del Backend

### Opción 1: API en Node.js/Express

```javascript
// server.js
const express = require('express');
const app = express();

// Base de datos de configuraciones (en producción, esto vendría de MongoDB/PostgreSQL)
const storeConfigs = new Map();

// GET /api/store-config
// Identifica la tienda por dominio, subdominio o header
app.get('/api/store-config', async (req, res) => {
  try {
    // Opción 1: Por dominio/subdominio
    const domain = req.hostname; // ej: "tienda1.miapp.com"
    
    // Opción 2: Por header personalizado
    // const storeId = req.headers['x-store-id'];
    
    // Opción 3: Por parámetro de query
    // const storeId = req.query.storeId;
    
    // Buscar configuración en base de datos
    const config = await getStoreConfigFromDB(domain);
    
    if (!config) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CONFIG_NOT_FOUND',
          message: 'No se encontró configuración para este dominio'
        }
      });
    }
    
    // Retornar configuración
    res.json({
      success: true,
      version: config.version || '1.0.0',
      lastUpdated: config.updatedAt || new Date().toISOString(),
      data: config
    });
    
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

// Función para obtener configuración de base de datos
async function getStoreConfigFromDB(domain) {
  // Aquí implementarías la lógica para obtener de tu base de datos
  // Por ejemplo con Prisma, Mongoose, etc.
  
  // Ejemplo con PostgreSQL:
  // const result = await db.query(
  //   'SELECT config FROM store_configurations WHERE domain = $1',
  //   [domain]
  // );
  // return result.rows[0]?.config;
  
  return {
    store: {
      name: "Mi Tienda",
      // ... resto de la configuración
    }
  };
}

app.listen(3001, () => {
  console.log('API corriendo en puerto 3001');
});
```

### Opción 2: API Routes en Next.js

Crea `src/app/api/store-config/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { StoreConfigResponse } from '@/shared/types/StoreConfig';

export async function GET(request: NextRequest) {
  try {
    // Obtener dominio o identificador de la tienda
    const domain = request.headers.get('host');
    
    // O por parámetro
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    
    // Buscar configuración en base de datos
    const config = await getStoreConfig(domain || storeId);
    
    if (!config) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFIG_NOT_FOUND',
            message: 'Configuración no encontrada'
          }
        },
        { status: 404 }
      );
    }
    
    const response: StoreConfigResponse = {
      success: true,
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      data: config
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
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

async function getStoreConfig(identifier: string | null) {
  // Implementar lógica de base de datos aquí
  // Por ejemplo con Prisma:
  // return await prisma.storeConfig.findUnique({
  //   where: { domain: identifier }
  // });
  
  return null;
}
```

---

## 💾 Esquema de Base de Datos

### PostgreSQL

```sql
CREATE TABLE store_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id VARCHAR(255) UNIQUE NOT NULL,
  domain VARCHAR(255) UNIQUE,
  config JSONB NOT NULL,
  version VARCHAR(50) DEFAULT '1.0.0',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar performance
CREATE INDEX idx_store_domain ON store_configurations(domain);
CREATE INDEX idx_store_id ON store_configurations(store_id);
CREATE INDEX idx_active ON store_configurations(is_active);
```

### MongoDB

```javascript
const StoreConfigSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
    unique: true
  },
  domain: {
    type: String,
    unique: true,
    sparse: true
  },
  config: {
    type: Object,
    required: true
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const StoreConfig = mongoose.model('StoreConfig', StoreConfigSchema);
```

---

## 🎨 Ventajas de este Sistema

✅ **Multi-tenant**: Una sola aplicación sirve a múltiples tiendas
✅ **Personalización Total**: Cada cliente puede tener su propia marca
✅ **Sin Re-deploy**: Los cambios de configuración no requieren redesplegar
✅ **Performance**: Sistema de caché multinivel (browser + localStorage + CDN)
✅ **Type-Safe**: TypeScript asegura que la configuración sea correcta
✅ **Escalable**: Fácil agregar nuevas opciones de personalización
✅ **Comercializable**: Perfecto para vender como SaaS

---

## 📊 Modelo de Negocio

### Ejemplo de Planes

1. **Plan Básico** ($29/mes)
   - Configuración de colores
   - Logo personalizado
   - Hasta 50 productos
   - 1 slide de hero

2. **Plan Profesional** ($79/mes)
   - Todo lo del básico
   - Hero carousel (múltiples slides)
   - Hasta 500 productos
   - Métodos de pago personalizados
   - Dominio personalizado

3. **Plan Enterprise** ($199/mes)
   - Sin límites
   - API completa
   - Soporte prioritario
   - Múltiples idiomas

---

## 🔐 Consideraciones de Seguridad

1. **Validación**: Validar todos los datos de configuración en el backend
2. **Sanitización**: Limpiar URLs y HTML para prevenir XSS
3. **Rate Limiting**: Limitar requests al endpoint de configuración
4. **CORS**: Configurar CORS apropiadamente
5. **CDN**: Servir imágenes desde CDN con políticas de seguridad

---

## 📈 Próximos Pasos

1. Implementar el endpoint en tu backend
2. Crear panel de administración para editar configuraciones
3. Agregar validación de colores (hexadecimales válidos)
4. Implementar sistema de previsualización en tiempo real
5. Agregar soporte para múltiples idiomas
6. Crear herramienta de migración de configuraciones

---

## 🆘 Soporte

Si tienes preguntas sobre la implementación, revisa:
- `STORE_CONFIG_API.md` - Documentación completa del API
- `store-config-example.json` - Ejemplo completo de respuesta
- Los archivos de tipos en `StoreConfig.ts` para todas las opciones disponibles
