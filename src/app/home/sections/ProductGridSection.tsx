import ProductGrid from "../components/ProductGrid";
import { Product } from "../types";

export default function ProductGridSection({
  products,
  favorites,
  onProductClick,
  onFavorite,
  ProductCardComponent,
  gridRef,
}: {
  products: Product[];
  favorites: string[];
  onProductClick: (id: string) => void;
  onFavorite: (product: Product) => void;
  ProductCardComponent: any;
  gridRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div ref={gridRef}>
      <ProductGrid
        products={products}
        favorites={favorites}
        onProductClick={onProductClick}
        onFavorite={onFavorite}
        ProductCardComponent={ProductCardComponent}
      />
    </div>
  );
}