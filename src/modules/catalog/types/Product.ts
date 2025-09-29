export type Product = {
    id: string;
    name: string;
    slug: string;
    priceCents: number; // Precio original
    discount?: number; // Porcentaje de descuento (ej: 17 para 17%)
    imageUrl?: string | null;
    description?: string | null;
    category?: string;
    active: boolean;
  };
  
  