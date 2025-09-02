import ProductCard from "@/components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import HorizontalScroll from "../components/HorizontalScroll";
import { Product } from "../types";

export default function FeaturedProducts({
  products,
  onFavorite,
  isFavorite,
  onProductClick,
}: {
  products: Product[];
  onFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
  onProductClick: (product: Product) => void;
}) {
  return (
    <section className="mb-8">
      <SectionHeader title="Productos destacados" onSeeAll={() => { /* navegación */ }} />
      <HorizontalScroll>
        {products.map((product) => (
          <div key={product.id} style={{ minWidth: 220, maxWidth: 240 }}>
            <ProductCard
              product={product}
              onFavorite={onFavorite}
              isFavorite={isFavorite(product.id)}
              onProductClick={() => onProductClick(product)}
            />
          </div>
        ))}
      </HorizontalScroll>
    </section>
  );
}