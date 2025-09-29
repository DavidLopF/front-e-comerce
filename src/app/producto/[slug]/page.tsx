import { notFound } from "next/navigation";
import { productService } from "@/modules/catalog/services/ProductSevice";
import ProductDetail from "@/modules/catalog/ui/ProductDetail";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await productService.getBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await productService.getBySlug(params.slug);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: `${product.name} - Tienda`,
    description: product.description || `Descubre ${product.name} en nuestra tienda`,
  };
}
