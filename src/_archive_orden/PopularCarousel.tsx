import React from 'react';

import BaseCarousel from './components/Carousel';
import CarouselProductCard from './CarouselProductCard';
import { Product } from './types';

interface PopularCarouselProps {
  products: Product[];
  favorites: number[];
  onProductClick: (product: Product) => void;
  onFavorite: (productId: number) => void;
}

const PopularCarousel: React.FC<PopularCarouselProps> = ({
  products,
  favorites,
  onProductClick,
  onFavorite,
}) => {
  return (
    <div style={{ margin: '18px 0 8px 0' }}>
      <BaseCarousel
        items={products}
        autoPlayInterval={3500}
        renderItem={(product) => (
          <CarouselProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.includes(product.id)}
            onFavorite={onFavorite}
            onProductClick={() => onProductClick(product)}
          />
        )}
      />
    </div>
  );
};

export default PopularCarousel;
