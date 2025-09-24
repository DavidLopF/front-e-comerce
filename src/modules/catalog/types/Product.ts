export type Product = {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    imageUrl?: string | null;
    description?: string | null;
    category?: string;
    active: boolean;
  };
  
  