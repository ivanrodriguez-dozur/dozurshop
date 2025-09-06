// Script para poblar la tabla puzzles con datos de prueba
import { supabase } from '@/lib/supabaseClient';

export const PUZZLE_SEED_DATA = [
  {
    nombre: 'Lionel Messi',
    descripcion: 'El GOAT argentino en acción - Estrella del PSG y la Selección Argentina',
    imagen_completa_url: 'https://images.unsplash.com/photo-1574732513018-c95ff2ea9c6f?w=400&h=400&fit=crop',
    dificultad: 'medio',
    piezas: 9,
    categoria: 'jugadores',
    coins_reward: 100,
    is_active: true
  },
  {
    nombre: 'Cristiano Ronaldo',
    descripcion: 'CR7 en su máximo esplendor - Leyenda del Real Madrid y Portugal',
    imagen_completa_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    dificultad: 'medio',
    piezas: 9,
    categoria: 'jugadores',
    coins_reward: 100,
    is_active: true
  },
  {
    nombre: 'Neymar Jr',
    descripcion: 'La magia brasileña - Estrella del Al-Hilal y la Canarinha',
    imagen_completa_url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=400&fit=crop',
    dificultad: 'facil',
    piezas: 4,
    categoria: 'jugadores',
    coins_reward: 75,
    is_active: true
  },
  {
    nombre: 'Kylian Mbappé',
    descripcion: 'La velocidad hecha persona - Estrella del Real Madrid y Francia',
    imagen_completa_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    dificultad: 'dificil',
    piezas: 16,
    categoria: 'jugadores',
    coins_reward: 150,
    is_active: true
  },
  {
    nombre: 'Erling Haaland',
    descripcion: 'La máquina goleadora - Fenómeno del Manchester City',
    imagen_completa_url: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop',
    dificultad: 'medio',
    piezas: 9,
    categoria: 'jugadores',
    coins_reward: 100,
    is_active: true
  },
  {
    nombre: 'Pedri González',
    descripcion: 'La joya del Barcelona - El futuro del fútbol español',
    imagen_completa_url: 'https://images.unsplash.com/photo-1599582909646-3353e49c9c9e?w=400&h=400&fit=crop',
    dificultad: 'facil',
    piezas: 4,
    categoria: 'jugadores',
    coins_reward: 75,
    is_active: true
  }
];

export async function seedPuzzles() {
  try {
    console.log('🌱 Sembrando datos de puzzles...');
    
    // Limpiar datos existentes (opcional)
    const { error: deleteError } = await supabase
      .from('puzzles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos excepto uno imposible
    
    if (deleteError) {
      console.warn('⚠️ No se pudieron limpiar datos existentes:', deleteError);
    }

    // Insertar nuevos datos
    const { data, error } = await supabase
      .from('puzzles')
      .insert(PUZZLE_SEED_DATA)
      .select();

    if (error) {
      console.error('❌ Error insertando puzzles:', error);
      return false;
    }

    console.log('✅ Puzzles insertados exitosamente:', data?.length);
    return true;

  } catch (error) {
    console.error('💥 Error fatal:', error);
    return false;
  }
}

// Función para ejecutar desde la consola del navegador
if (typeof window !== 'undefined') {
  (window as any).seedPuzzles = seedPuzzles;
}
