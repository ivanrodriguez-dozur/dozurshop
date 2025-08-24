import { Product, Category } from "./types";

// Utilidad para generar slug automáticamente
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const mockProducts: Product[] = [
  // --- PRODUCTOS POPULARES Y VARIADOS ---
  {
    id: "1",
    name: "Zapatillas Nike Air Max",
    slug: generateSlug("Zapatillas Nike Air Max"),
    price: 120000,
    originalPrice: 150000,
    category: "calzado",
    image: "/productos/1.jpg",
    description: "Zapatillas deportivas con tecnología Air Max para máximo confort",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Negro", "Blanco", "Azul"],
    rating: 4.5,
    reviews: 234,
    inStock: true,
    isNew: true,
    discount: 20
  },
  {
    id: "2",
    name: "Camiseta Adidas Performance",
    slug: generateSlug("Camiseta Adidas Performance"),
    price: 110000,
    category: "ropa",
    image: "/productos/2.jpg",
    description: "Camiseta técnica para entrenamiento con tecnología de secado rápido",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro", "Blanco", "Gris", "Rojo"],
    rating: 4.3,
    reviews: 156,
    inStock: true
  },
  {
    id: "3",
    name: "Nike Street Gato",
    slug: generateSlug("Nike Street Gato"),
    price: 160000,
    originalPrice: 160000,
    category: "calzado",
    image: "/productos/3.jpg",
    description: "Zapatillas Nike Para Futbol Sala",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Negro", "Gris Oscuro", "Gris Claro"],
    rating: 4.7,
    reviews: 89,
    inStock: true,
    discount: 18
  },
  {
    id: "4",
    name: "Mochila Under Armour",
    slug: generateSlug("Mochila Under Armour"),
    price: 80000,
    category: "accesorios",
    image: "/productos/4.jpg",
    description: "Mochila deportiva resistente al agua con múltiples compartimentos",
    sizes: ["Única"],
    colors: ["Negro", "Azul Marino", "Gris"],
    rating: 4.4,
    reviews: 312,
    inStock: true
  },
  {
    id: "5",
    name: "Zapatillas Adidas Ultraboost",
    slug: generateSlug("Zapatillas Adidas Ultraboost"),
    price: 135000,
    category: "calzado",
    image: "/productos/5.jpg",
    description: "Zapatillas running premium con tecnología Boost para máxima energía",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Negro", "Blanco", "Gris", "Azul"],
    rating: 4.8,
    reviews: 567,
    inStock: true,
    isNew: true
  },
  {
    id: "6",
    name: "Gorra Nike Dri-FIT",
    slug: generateSlug("Gorra Nike Dri-FIT"),
    price: 70000,
    category: "accesorios",
    image: "/productos/6.jpg",
    description: "Gorra deportiva con tecnología Dri-FIT para mantenerte seco",
    sizes: ["Única"],
    colors: ["Negro", "Blanco", "Rojo", "Azul"],
    rating: 4.2,
    reviews: 145,
    inStock: true
  },
  {
    id: "7",
    name: "Sudadera Puma Classics",
    slug: generateSlug("Sudadera Puma Classics"),
    price: 115000,
    category: "ropa",
    image: "/productos/7.jpg",
    description: "Sudadera con capucha clásica de algodón para estilo casual",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro", "Gris", "Rojo", "Azul Marino"],
    rating: 4.6,
    reviews: 203,
    inStock: true
  },
  {
    id: "8",
    name: "Zapatillas New Balance 574",
    slug: generateSlug("Zapatillas New Balance 574"),
    price: 99000,
    category: "calzado",
    image: "/productos/8.jpg",
    description: "Zapatillas clásicas para uso diario con estilo retro",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Gris", "Azul", "Rojo", "Verde"],
    rating: 4.4,
    reviews: 398,
    inStock: true
  },
  {
    id: "9",
    name: "Nike Air Zoom Pegasus",
    slug: generateSlug("Nike Air Zoom Pegasus"),
    price: 125000,
    category: "calzado",
    image: "/productos/9.jpg",
    description: "Zapatillas running con amortiguación reactiva y gran soporte.",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Negro", "Azul", "Rojo"],
    rating: 4.7,
    reviews: 321,
    inStock: true
  },
  {
    id: "10",
    name: "Adidas Superstar Classic",
    slug: generateSlug("Adidas Superstar Classic"),
    price: 99000,
    category: "calzado",
    image: "/productos/10.jpg",
    description: "Zapatillas urbanas icónicas con puntera de goma.",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Blanco", "Negro"],
    rating: 4.6,
    reviews: 412,
    inStock: true
  },
  {
    id: "11",
    name: "Puma RS-X",
    slug: generateSlug("Puma RS-X"),
    price: 119000,
    category: "calzado",
    image: "/productos/11.jpg",
    description: "Zapatillas chunky con diseño retro y máxima comodidad.",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Negro", "Gris", "Verde"],
    rating: 4.5,
    reviews: 210,
    inStock: true
  },
  {
    id: "12",
    name: "Nike Revolution 6",
    slug: generateSlug("Nike Revolution 6"),
    price: 89000,
    category: "calzado",
    image: "/productos/12.jpg",
    description: "Zapatillas ligeras para entrenamiento diario.",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Negro", "Azul"],
    rating: 4.6,
    reviews: 180,
    inStock: true
  },
  {
    id: "13",
    name: "New Balance Fresh Foam",
    slug: generateSlug("New Balance Fresh Foam"),
    price: 135000,
    category: "calzado",
    image: "/productos/13.jpg",
    description: "Zapatillas con espuma Fresh Foam para máxima suavidad.",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Gris", "Azul"],
    rating: 4.8,
    reviews: 250,
    inStock: true
  },
  {
    id: "14",
    name: "Nike Court Vision Low",
    slug: generateSlug("Nike Court Vision Low"),
    price: 99000,
    category: "calzado",
    image: "/productos/14.jpg",
    description: "Zapatillas inspiradas en el basket clásico.",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Blanco", "Negro"],
    rating: 4.7,
    reviews: 300,
    inStock: true
  },
  {
    id: "15",
    name: "Adidas NMD_R1",
    slug: generateSlug("Adidas NMD_R1"),
    price: 145000,
    category: "calzado",
    image: "/productos/15.jpg",
    description: "Zapatillas urbanas con tecnología Boost.",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Negro", "Rojo"],
    rating: 4.9,
    reviews: 500,
    inStock: true
  },
  {
    id: "16",
    name: "Nike Air Force 1",
    slug: generateSlug("Nike Air Force 1"),
    price: 139000,
    category: "calzado",
    image: "/productos/16.jpg",
    description: "El clásico de Nike con suela gruesa y estilo atemporal.",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Blanco", "Negro"],
    rating: 4.8,
    reviews: 600,
    inStock: true
  },
  {
    id: "17",
    name: "Puma Future Rider",
    slug: generateSlug("Puma Future Rider"),
    price: 109000,
    category: "calzado",
    image: "/productos/17.jpeg",
    description: "Zapatillas retro running con colores vibrantes.",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Azul", "Rojo", "Verde"],
    rating: 4.5,
    reviews: 190,
    inStock: true
  }
];

export const categories: Category[] = [
  { id: "all", name: "Todos", icon: "🏠" },
  { id: "calzado", name: "Calzado", icon: "👟" },
  { id: "ropa", name: "Ropa", icon: "👕" },
  { id: "accesorios", name: "Accesorios", icon: "🎒" }
];

export const products = [];
