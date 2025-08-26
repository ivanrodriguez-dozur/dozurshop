import React from "react";
import { Product } from "../types";
// Usar ProductCard global pasado por props

interface ProductGridProps {
	products: Product[];
	favorites: string[];
	onProductClick: (id: string) => void;
	onFavorite: (product: Product) => void;
	title?: string;
	ProductCardComponent?: React.ComponentType<any>;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, favorites, onProductClick, onFavorite, title, ProductCardComponent }) => {
	if (!products || products.length === 0) {
		return <div style={{ color: '#888', textAlign: 'center', margin: 32 }}>No hay productos para mostrar.</div>;
	}
		return (
			<div style={{ padding: '16px 0' }}>
				{title && <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16, color: '#111' }}>{title}</h2>}
				<div style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
					gap: 20
				}}>
							{products.map(product => (
								(ProductCardComponent ?
									<ProductCardComponent
										key={product.id}
										product={product}
										onFavorite={() => onFavorite(product)}
										isFavorite={favorites.includes(product.id)}
										onProductClick={() => onProductClick(product.slug ?? product.id)}
									/>
									: null)
							))}
				</div>
			</div>
		);
};

export default ProductGrid;
