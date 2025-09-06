-- Creación de tablas para el TikTok Feed

-- Tabla para booms (videos cortos)
CREATE TABLE booms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Sin título',
  description TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para videos fulltime (videos largos/completos)
CREATE TABLE fulltime (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Sin título',
  description TEXT,
  duration INTEGER, -- duración en segundos
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para gallery (fotos)
CREATE TABLE gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Sin título',
  description TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para profiles (simplificada para el feed)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX idx_booms_created_at ON booms(created_at DESC);
CREATE INDEX idx_booms_user_id ON booms(user_id);
CREATE INDEX idx_fulltime_created_at ON fulltime(created_at DESC);
CREATE INDEX idx_fulltime_user_id ON fulltime(user_id);
CREATE INDEX idx_gallery_created_at ON gallery(created_at DESC);
CREATE INDEX idx_gallery_user_id ON gallery(user_id);

-- Políticas RLS (Row Level Security)
ALTER TABLE booms ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulltime ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Allow public read access" ON booms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read access" ON fulltime FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read access" ON gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read access" ON profiles FOR SELECT TO anon, authenticated USING (true);

-- Política para permitir escritura a usuarios autenticados
CREATE POLICY "Allow authenticated users to insert" ON booms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to insert" ON fulltime FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to insert" ON gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to insert" ON profiles FOR INSERT TO authenticated WITH CHECK (true);

-- Política para permitir actualización a propietarios
CREATE POLICY "Allow users to update own content" ON booms FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow users to update own content" ON fulltime FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow users to update own content" ON gallery FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow users to update own profiles" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
