"use client";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { Product } from "../types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 🚀 Traer productos desde Supabase
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error cargando productos:", error);
      } else {
        setProducts(data as Product[]);
      }
    }
    fetchProducts();
  }, []);

  // 📌 Categorías dinámicas
  const categories = useMemo(() => {
    return ["all", ...new Set(products.map((p) => p.category))];
  }, [products]);

  // 📌 Filtrado por categoría y búsqueda
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (activeCategory !== "all") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [products, activeCategory, searchTerm]);

  // 📌 Populares (ejemplo: con mejor rating)
  const popularProducts = useMemo(() => {
    return products.filter((p) => (p.rating ?? 0) > 4.5);
  }, [products]);

  // 📌 Buscar por texto directo
  const searchProducts = (term: string) => {
    if (!term) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(term.toLowerCase())
    );
  };

  return {
    products,
    filteredProducts,
    popularProducts,
    categories,
    activeCategory,
    setActiveCategory,
    searchProducts,
    searchTerm,
    setSearchTerm,
  };
}
