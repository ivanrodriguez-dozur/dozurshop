import React from "react";
import { Product } from "../types";

interface ProductSuggestionListProps {
  products: Product[];
  onSelect: (id: string) => void;
}

const ProductSuggestionList: React.FC<ProductSuggestionListProps> = ({ products, onSelect }) => {
  if (!products.length) return <div style={{ color: '#b5ff00', padding: 16 }}>No hay sugerencias</div>;
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {products.map(product => (
        <li key={product.id} style={{ padding: '8px 0', borderBottom: '1px solid #222', cursor: 'pointer' }} onClick={() => onSelect(product.id)}>
          <span style={{ color: '#b5ff00', fontWeight: 600 }}>{product.name}</span>
          <span style={{ color: '#fff', marginLeft: 8, fontSize: 13 }}>${product.price}</span>
        </li>
      ))}
    </ul>
  );
};

export default ProductSuggestionList;
