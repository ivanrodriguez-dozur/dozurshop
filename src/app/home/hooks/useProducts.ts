import { useState, useMemo } from "react";
import { Product } from "../types";
import { mockProducts } from "../data";

export function useProducts() {
  const [products] = useState<Product[]>(mockProducts);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = useMemo(() => {
    const cats = ["all", ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (activeCategory !== "all") {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [products, activeCategory, searchTerm]);

  const popularProducts = useMemo(() => {
    return products.filter(p => p.rating >= 4.5).slice(0, 6);
  }, [products]);

  const searchProducts = (term: string) => {
  if (!term) return products;
  return products.filter(p => p.name.toLowerCase().includes(term.toLowerCase()));
  };

  return {
    products,
    filteredProducts,
    popularProducts,
    categories,
    activeCategory,
    setActiveCategory,
    searchProducts
  };
}
