// Datos mock para desarrollo local
const mockProducts = [
  {
    id: "1",
    code: "LAPTOP-001",
    name: "Laptop Gaming Pro",
    price: 1299.99,
    description: "Laptop de alto rendimiento para gaming y trabajo profesional",
    imageUrl: "/placeholder-laptop.jpg",
    category: "Electrónicos",
  },
  {
    id: "2", 
    code: "PHONE-002",
    name: "Smartphone Galaxy S24",
    price: 899.99,
    description: "El último smartphone con tecnología de vanguardia",
    imageUrl: "/placeholder-phone.jpg",
    category: "Electrónicos",
  },
  {
    id: "3",
    code: "HEADPHONES-003",
    name: "Auriculares Inalámbricos",
    price: 199.99,
    description: "Auriculares con cancelación de ruido y sonido premium",
    imageUrl: "/placeholder-headphones.jpg",
    category: "Accesorios",
  },
  {
    id: "4",
    code: "TABLET-004",
    name: "Tablet Pro 12.9",
    price: 699.99,
    description: "Tablet profesional con pantalla de alta resolución",
    imageUrl: "/placeholder-tablet.jpg",
    category: "Electrónicos",
  },
  {
    id: "5",
    code: "WATCH-005",
    name: "Smartwatch Series 8",
    price: 399.99,
    description: "Reloj inteligente con monitoreo de salud avanzado",
    imageUrl: "/placeholder-watch.jpg",
    category: "Accesorios",
  },
  {
    id: "6",
    code: "CAMERA-006",
    name: "Cámara DSLR Pro",
    price: 1599.99,
    description: "Cámara profesional para fotografía y video",
    imageUrl: "/placeholder-camera.jpg",
    category: "Fotografía",
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
  