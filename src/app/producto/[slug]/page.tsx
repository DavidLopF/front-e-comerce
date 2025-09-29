import { notFound } from "next/navigation";
import { productService } from "@/modules/catalog/services/ProductSevice";
import ProductDetail from "@/modules/catalog/ui/ProductDetail";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);

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
