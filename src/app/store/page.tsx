import { productService } from "../../modules/catalog/services/ProductSevice";
import ProductCard from "@/modules/catalog/ui/ProductCard";

export default async function StorePage() {
  const products = await productService.list();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Catálogo</h1>

      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
