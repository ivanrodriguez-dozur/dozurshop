// CAMBIAR: Puedes modificar los productos mock aquí
const products = [
  {
    id: '1',
    slug: 'wake-hoodie',
    name: 'Wake - Hoodie',
    brand: 'Wake Official',
    price: 129,
    category: 'clothes',
    image: '/assets/wake-hoodie.png',
    tags: ['hoodie', 'popular'],
    stock: 10,
    description: 'Esta es una hoodie de la marca Wake que será lanzada en 2025.',
  },
  {
    id: '2',
    slug: 'nikie-shoes',
    name: 'Nikie - Shoes',
    brand: 'Nikie',
    price: 159,
    category: 'shoes',
    image: '/assets/nikie-shoes.png',
    tags: ['shoes', 'popular'],
    stock: 15,
    description: 'Zapatillas deportivas Nikie edición limitada.',
  },
  // CAMBIAR: Agrega más productos aquí
];

export function fetchProducts() {
  return Promise.resolve(products);
}

export function fetchProduct(slug: string) {
  return Promise.resolve(products.find(p => p.slug === slug));
}
