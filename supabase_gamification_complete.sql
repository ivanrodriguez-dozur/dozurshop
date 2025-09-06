-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla principal de usuarios (ampliada)
CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL DEFAULT 'Usuario',
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  bio TEXT,
  avatar_url TEXT,
  cover_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de puntos y gamificación
CREATE TABLE user_points (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  total_coins INTEGER DEFAULT 100,
  level INTEGER DEFAULT 1,
  daily_streak INTEGER DEFAULT 0,
  last_activity DATE DEFAULT CURRENT_DATE,
  rank VARCHAR(50) DEFAULT 'Novato',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de transacciones de puntos
CREATE TABLE point_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  coins_earned INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de métodos de pago
CREATE TABLE payment_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'credit_card', 'debit_card', 'paypal', etc.
  last_four_digits VARCHAR(4),
  brand VARCHAR(50), -- 'visa', 'mastercard', etc.
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  stripe_payment_method_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de direcciones
CREATE TABLE user_addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'shipping', -- 'shipping', 'billing'
  name VARCHAR(255) NOT NULL,
  street_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) NOT NULL DEFAULT 'México',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de logros
CREATE TABLE achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  xp_reward INTEGER DEFAULT 0,
  coins_reward INTEGER DEFAULT 0,
  requirement_type VARCHAR(100), -- 'total_xp', 'daily_streak', 'purchases', etc.
  requirement_value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de logros del usuario
CREATE TABLE user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Tabla de configuraciones de usuario
CREATE TABLE user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  privacy_level VARCHAR(50) DEFAULT 'normal', -- 'private', 'normal', 'public'
  theme VARCHAR(50) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'es',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de wallet/balance de coins
CREATE TABLE user_wallet (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  available_coins INTEGER DEFAULT 100,
  pending_coins INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 100,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_points_updated_at 
  BEFORE UPDATE ON user_points 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at 
  BEFORE UPDATE ON payment_methods 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_addresses_updated_at 
  BEFORE UPDATE ON user_addresses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at 
  BEFORE UPDATE ON user_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_wallet_updated_at 
  BEFORE UPDATE ON user_wallet 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear usuario completo al registrarse
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Crear perfil del usuario
  INSERT INTO user_profiles (auth_user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
    NEW.email
  );
  
  -- Crear registro de puntos
  INSERT INTO user_points (user_id)
  SELECT id FROM user_profiles WHERE auth_user_id = NEW.id;
  
  -- Crear wallet
  INSERT INTO user_wallet (user_id)
  SELECT id FROM user_profiles WHERE auth_user_id = NEW.id;
  
  -- Crear configuraciones por defecto
  INSERT INTO user_settings (user_id)
  SELECT id FROM user_profiles WHERE auth_user_id = NEW.id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para crear usuario automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallet ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth_user_id = auth.uid());

-- Políticas para user_points
CREATE POLICY "Users can view their own points" ON user_points
  FOR SELECT USING (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own points" ON user_points
  FOR UPDATE USING (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

-- Políticas para point_transactions
CREATE POLICY "Users can view their own transactions" ON point_transactions
  FOR SELECT USING (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own transactions" ON point_transactions
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

-- Políticas para payment_methods
CREATE POLICY "Users can manage their own payment methods" ON payment_methods
  FOR ALL USING (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

-- Políticas para user_addresses
CREATE POLICY "Users can manage their own addresses" ON user_addresses
  FOR ALL USING (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

-- Políticas para user_achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

-- Políticas para user_settings
CREATE POLICY "Users can manage their own settings" ON user_settings
  FOR ALL USING (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

-- Políticas para user_wallet
CREATE POLICY "Users can view their own wallet" ON user_wallet
  FOR SELECT USING (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own wallet" ON user_wallet
  FOR UPDATE USING (user_id IN (
    SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
  ));

-- Storage bucket para imágenes de perfil
INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);

-- Política de storage para perfiles
CREATE POLICY "Users can upload their own profile images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profiles' AND 
    (auth.uid()::text = (storage.foldername(name))[1])
  );

CREATE POLICY "Users can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Users can update their own profile images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profiles' AND 
    (auth.uid()::text = (storage.foldername(name))[1])
  );

CREATE POLICY "Users can delete their own profile images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profiles' AND 
    (auth.uid()::text = (storage.foldername(name))[1])
  );

-- Datos iniciales de logros
INSERT INTO achievements (name, description, icon, xp_reward, coins_reward, requirement_type, requirement_value) VALUES
('Primer Paso', 'Crea tu primer perfil', '🎯', 50, 10, 'profile_created', 1),
('Comprador Novato', 'Realiza tu primera compra', '🛒', 100, 25, 'purchases', 1),
('Racha de 7 días', 'Mantén una racha de 7 días consecutivos', '🔥', 200, 50, 'daily_streak', 7),
('Explorador', 'Alcanza 1000 puntos de experiencia', '🗺️', 300, 75, 'total_xp', 1000),
('Maestro Comprador', 'Realiza 10 compras', '🏆', 500, 100, 'purchases', 10),
('Leyenda', 'Alcanza 10000 puntos de experiencia', '👑', 1000, 250, 'total_xp', 10000);

-- Función para obtener información completa del usuario
CREATE OR REPLACE FUNCTION get_user_complete_profile(user_auth_id UUID)
RETURNS TABLE (
  profile_id UUID,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  bio TEXT,
  avatar_url TEXT,
  cover_photo_url TEXT,
  total_xp INTEGER,
  total_coins INTEGER,
  level INTEGER,
  daily_streak INTEGER,
  last_activity DATE,
  rank VARCHAR(50),
  available_coins INTEGER,
  total_earned INTEGER,
  total_spent INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.name,
    up.email,
    up.phone,
    up.bio,
    up.avatar_url,
    up.cover_photo_url,
    upt.total_xp,
    upt.total_coins,
    upt.level,
    upt.daily_streak,
    upt.last_activity,
    upt.rank,
    uw.available_coins,
    uw.total_earned,
    uw.total_spent
  FROM user_profiles up
  LEFT JOIN user_points upt ON up.id = upt.user_id
  LEFT JOIN user_wallet uw ON up.id = uw.user_id
  WHERE up.auth_user_id = user_auth_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Índices para mejor rendimiento
CREATE INDEX idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);
CREATE INDEX idx_user_points_user_id ON user_points(user_id);
CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_user_wallet_user_id ON user_wallet(user_id);
