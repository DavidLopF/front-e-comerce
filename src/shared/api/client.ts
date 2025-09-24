// Datos mock para desarrollo local
const mockProducts = [
  {
    id: "1",
    slug: "laptop-gaming-pro",
    name: "Laptop Gaming Pro",
    priceCents: 129999,
    description: "Laptop de alto rendimiento para gaming y trabajo profesional",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
    category: "Electrónicos",
    active: true,
  },
  {
    id: "2", 
    slug: "smartphone-galaxy-s24",
    name: "Smartphone Galaxy S24",
    priceCents: 89999,
    description: "El último smartphone con tecnología de vanguardia",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    category: "Electrónicos",
    active: true,
  },
  {
    id: "3",
    slug: "auriculares-inalambricos",
    name: "Auriculares Inalámbricos",
    priceCents: 19999,
    description: "Auriculares con cancelación de ruido y sonido premium",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    category: "Accesorios",
    active: true,
  },
  {
    id: "4",
    slug: "tablet-pro-12-9",
    name: "Tablet Pro 12.9",
    priceCents: 69999,
    description: "Tablet profesional con pantalla de alta resolución",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
    category: "Electrónicos",
    active: true,
  },
  {
    id: "5",
    slug: "smartwatch-series-8",
    name: "Smartwatch Series 8",
    priceCents: 39999,
    description: "Reloj inteligente con monitoreo de salud avanzado",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    category: "Accesorios",
    active: true,
  },
  {
    id: "6",
    slug: "camara-dslr-pro",
    name: "Cámara DSLR Pro",
    priceCents: 159999,
    description: "Cámara profesional para fotografía y video",
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
    category: "Fotografía",
    active: true,
  },
];

const getApiUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl || baseUrl.trim() === '') {
    console.warn('NEXT_PUBLIC_API_URL no está definida o está vacía. Usando datos mock para desarrollo.');
    return null;
  }
  return baseUrl;
};

const isMockMode = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return !apiUrl || apiUrl.trim() === '';
};

export const api = {
  get: async <T>(url: string, init?: RequestInit): Promise<T> => {
    console.log('🔍 Debug API call:', {
      url,
      envVar: process.env.NEXT_PUBLIC_API_URL,
      isMockMode: isMockMode(),
      envVarType: typeof process.env.NEXT_PUBLIC_API_URL
    });

    // Si no hay URL de API configurada, usar datos mock
    if (isMockMode()) {
      console.log('📦 Usando datos mock para:', url);
      if (url === "/products") {
        return mockProducts as T;
      }
      throw new Error(`Endpoint mock no disponible: ${url}`);
    }

    const apiUrl = getApiUrl();
    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL no está configurada');
    }

    console.log('🌐 Haciendo fetch a:', `${apiUrl}${url}`);
    
    try {
      const res = await fetch(`${apiUrl}${url}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers || {}),
        },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
      return res.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.warn('⚠️ Error al conectar con la API, usando datos mock:', errorMessage);
      // Si hay error de conexión, usar datos mock
      if (url === "/products") {
        return mockProducts as T;
      }
      if (url === "/hero-slides") {
        // Retornar datos mock para hero slides
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
        ] as T;
      }
      throw new Error(`Endpoint mock no disponible: ${url}`);
    }
  },
  post: async <T>(url: string, body: any, init?: RequestInit): Promise<T> => {
    const apiUrl = getApiUrl();
    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL no está configurada');
    }

    const res = await fetch(`${apiUrl}${url}`, {
      ...init,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${url} -> ${res.status}`);
    return res.json();
  },
};
  