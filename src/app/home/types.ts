// CAMBIAR: Puedes expandir los campos según tus necesidades
export interface Product {
  id: string;
  slug?: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  tags?: string[];
  stock?: number;
  description?: string;
  sizes?: string[];
  colors?: string[];
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  isNew?: boolean;
  discount?: number;
}

// CAMBIAR: Puedes ajustar los campos de categoría según tus necesidades
export interface Category {
  id: string;
  name: string;
  icon?: string;
}
