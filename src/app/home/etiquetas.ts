// Archivo: etiquetas.ts
// Descripción: Lista de etiquetas/categorías para el home, con key, icono y descripción editable.
// Puedes modificar este archivo para cambiar las categorías que aparecen en el home.

import { ReactNode } from 'react';

import { suggestedIcons } from '../../components/suggestedIcons';

// Puedes cambiar el nombre, icono o descripción de cada categoría aquí.

// =============================
// CONFIGURACIÓN DE COLORES PARA LAS ETIQUETAS
// Edita estos valores para personalizar los colores de las etiquetas de categoría.
// Usa clases de Tailwind o clases personalizadas.
// =============================
// COLORES Y TAMAÑOS DE ICONO PARA LAS ETIQUETAS
// Edita estos valores para personalizar los colores y tamaños de las etiquetas de categoría.
// Usa clases de Tailwind o clases personalizadas.
// =============================
export const estilosEtiquetas = {
  colores: {
    activo: {
      bg: 'bg-blue-500', // Fondo cuando está seleccionada
      text: 'text-white',
      border: 'border-4 border-blue-700',
    },
    inactivo: {
      bg: 'bg-white', // Fondo cuando NO está seleccionada
      text: 'text-blue-700',
      border: 'border-2 border-gray-200',
    },
    hover: 'hover:bg-blue-100', // Color al pasar el mouse
  },
  icono: {
    activo: 'text-4xl', // Tamaño del icono cuando está seleccionada
    inactivo: 'text-2xl', // Tamaño del icono cuando NO está seleccionada
  },
};
export interface EtiquetaCategoria {
  key: string; // Nombre visible de la categoría
  icon: ReactNode; // Icono asociado (usa suggestedIcons)
  descripcion: string; // Descripción para referencia o tooltips
  categoria: string; // Valor de filtro para productos
}

// =============================
// LISTA DE ETIQUETAS
// Puedes agregar, quitar o modificar las categorías aquí.
// key: nombre visible, icon: icono, descripcion: ayuda, categoria: valor de filtro
// =============================
export const etiquetas: EtiquetaCategoria[] = [
  {
    key: 'ver todo',
    icon: suggestedIcons.find((i) => i.key === 'ver todo')?.icon,
    descripcion: 'Muestra todos los productos sin filtrar.',
    categoria: 'all',
  },
  {
    key: 'zapatillas',
    icon: suggestedIcons.find((i) => i.key === 'zapatillas')?.icon,
    descripcion: 'Calzado deportivo y casual.',
    categoria: 'calzado',
  },
  {
    key: 'camisas',
    icon: suggestedIcons.find((i) => i.key === 'camisas')?.icon,
    descripcion: 'Camisas, camisetas y polos.',
    categoria: 'ropa',
  },
  {
    key: 'pantalonetas',
    icon: suggestedIcons.find((i) => i.key === 'pantalonetas')?.icon,
    descripcion: 'Pantalonetas deportivas y shorts.',
    categoria: 'pantaloneta',
  },
  {
    key: 'medias',
    icon: suggestedIcons.find((i) => i.key === 'medias')?.icon,
    descripcion: 'Medias y calcetines.',
    categoria: 'medias',
  },
  {
    key: 'accesorios',
    icon: suggestedIcons.find((i) => i.key === 'accesorios')?.icon,
    descripcion: 'Accesorios varios: gorras, mochilas, etc.',
    categoria: 'accesorios',
  },
];
