-- Script para insertar contenido de prueba en las tablas

-- Insertar algunos booms de ejemplo
INSERT INTO booms (id, video_url, title, description, user_id, likes_count, comments_count, shares_count) VALUES 
('boom-1', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 'Boom de Fútbol', 'Un gran gol en el último minuto', '550e8400-e29b-41d4-a716-446655440000', 25, 5, 3),
('boom-2', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 'Jugada Increíble', 'No vas a creer esta jugada', '550e8400-e29b-41d4-a716-446655440001', 42, 8, 6);

-- Insertar algunos videos fulltime de ejemplo
INSERT INTO fulltime (id, video_url, title, description, user_id, likes_count, comments_count, shares_count) VALUES 
('video-1', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4', 'Partido Completo', 'El mejor partido de la temporada', '550e8400-e29b-41d4-a716-446655440000', 120, 15, 8),
('video-2', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_7mb.mp4', 'Resumen Semanal', 'Todos los goles de la semana', '550e8400-e29b-41d4-a716-446655440001', 89, 12, 5);

-- Insertar algunas fotos de ejemplo
INSERT INTO gallery (id, image_url, title, description, user_id, likes_count, comments_count, shares_count) VALUES 
('foto-1', 'https://picsum.photos/400/600?random=1', 'Gol del Siglo', 'El momento exacto del gol', '550e8400-e29b-41d4-a716-446655440000', 67, 9, 4),
('foto-2', 'https://picsum.photos/400/600?random=2', 'Celebración', 'La celebración del equipo', '550e8400-e29b-41d4-a716-446655440001', 45, 6, 2);

-- Crear algunos perfiles de usuario de ejemplo si no existen
INSERT INTO profiles (id, username, avatar_url) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'futbolero_pro', 'https://i.pravatar.cc/150?img=1'),
('550e8400-e29b-41d4-a716-446655440001', 'gol_master', 'https://i.pravatar.cc/150?img=2')
ON CONFLICT (id) DO NOTHING;
