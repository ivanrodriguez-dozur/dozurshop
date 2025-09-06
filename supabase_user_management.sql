-- ====================================
-- SUPABASE USER MANAGEMENT & GAMIFICATION
-- Archivo SQL para DozurShop
-- ====================================

-- Primero, habilitamos las extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================
-- TABLA DE USUARIOS PRINCIPALES
-- ====================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    bio TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE
);

-- ====================================
-- TABLA DE PERFILES DE GAMIFICACIÓN
-- ====================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    total_coins INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    rank TEXT DEFAULT 'Bronze',
    achievements JSONB DEFAULT '[]',
    badges JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ====================================
-- TABLA DE DIRECCIONES
-- ====================================
CREATE TABLE IF NOT EXISTS public.user_addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'home', -- 'home', 'work', 'other'
    label TEXT,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'MX',
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- TABLA DE MÉTODOS DE PAGO
-- ====================================
CREATE TABLE IF NOT EXISTS public.user_payment_methods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'card', 'paypal', 'bank', 'wallet'
    provider TEXT, -- 'visa', 'mastercard', 'paypal', etc.
    last_four TEXT,
    cardholder_name TEXT,
    expiry_month INTEGER,
    expiry_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- TABLA DE TRANSACCIONES
-- ====================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'purchase', 'reward', 'refund', 'bonus'
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'MXN',
    coins_earned INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- TABLA DE ACTIVIDADES DE USUARIO
-- ====================================
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'login', 'purchase', 'game_played', 'achievement_unlocked'
    description TEXT,
    xp_awarded INTEGER DEFAULT 0,
    coins_awarded INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- TABLA DE LOGROS/ACHIEVEMENTS
-- ====================================
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT,
    xp_reward INTEGER DEFAULT 0,
    coins_reward INTEGER DEFAULT 0,
    requirements JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- TABLA DE LOGROS DE USUARIO
-- ====================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- ====================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ====================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_user_id ON public.user_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);

-- ====================================
-- FUNCIONES DE TRIGGERS
-- ====================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para crear perfil de gamificación automáticamente
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para actualizar nivel basado en XP
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
DECLARE
    new_level INTEGER;
    new_rank TEXT;
BEGIN
    -- Calcular nuevo nivel (cada 1000 XP = 1 nivel)
    new_level := GREATEST(1, (NEW.total_xp / 1000) + 1);
    
    -- Determinar nuevo rango
    IF new_level >= 50 THEN
        new_rank := 'Legendary';
    ELSIF new_level >= 40 THEN
        new_rank := 'Master';
    ELSIF new_level >= 30 THEN
        new_rank := 'Expert';
    ELSIF new_level >= 20 THEN
        new_rank := 'Professional';
    ELSIF new_level >= 15 THEN
        new_rank := 'Advanced';
    ELSIF new_level >= 10 THEN
        new_rank := 'Intermediate';
    ELSIF new_level >= 5 THEN
        new_rank := 'Silver';
    ELSE
        new_rank := 'Bronze';
    END IF;
    
    NEW.level := new_level;
    NEW.rank := new_rank;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ====================================
-- TRIGGERS
-- ====================================

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON public.user_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_payment_methods_updated_at BEFORE UPDATE ON public.user_payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para crear perfil automáticamente
CREATE TRIGGER create_profile_on_user_creation AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Trigger para actualizar nivel automáticamente
CREATE TRIGGER update_level_on_xp_change BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW WHEN (OLD.total_xp IS DISTINCT FROM NEW.total_xp)
    EXECUTE FUNCTION update_user_level();

-- ====================================
-- POLÍTICAS RLS (Row Level Security)
-- ====================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para user_addresses
CREATE POLICY "Users can manage their own addresses" ON public.user_addresses
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para user_payment_methods
CREATE POLICY "Users can manage their own payment methods" ON public.user_payment_methods
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Políticas para user_activities
CREATE POLICY "Users can view their own activities" ON public.user_activities
    FOR SELECT USING (auth.uid() = user_id);

-- Políticas para achievements (todos pueden ver)
CREATE POLICY "Anyone can view achievements" ON public.achievements
    FOR SELECT TO authenticated USING (true);

-- Políticas para user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

-- ====================================
-- DATOS INICIALES
-- ====================================

-- Insertar logros básicos
INSERT INTO public.achievements (name, description, icon, category, xp_reward, coins_reward, requirements) VALUES
('Primer Inicio', 'Bienvenido a DozurShop', '🎉', 'welcome', 100, 50, '{"action": "first_login"}'),
('Primera Compra', 'Realizaste tu primera compra', '🛒', 'shopping', 200, 100, '{"action": "first_purchase"}'),
('Gastador Nivel 1', 'Gastaste más de $1000', '💰', 'spending', 300, 150, '{"amount": 1000}'),
('Jugador Activo', 'Jugaste 10 juegos', '🎮', 'gaming', 250, 125, '{"games_played": 10}'),
('Coleccionista', 'Compraste 5 productos diferentes', '📦', 'collecting', 400, 200, '{"unique_products": 5}');

-- ====================================
-- FUNCIONES ÚTILES PARA LA APLICACIÓN
-- ====================================

-- Función para agregar XP a un usuario
CREATE OR REPLACE FUNCTION add_user_xp(p_user_id UUID, p_xp INTEGER, p_coins INTEGER DEFAULT 0, p_description TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    -- Actualizar perfil
    UPDATE public.user_profiles 
    SET total_xp = total_xp + p_xp,
        total_coins = total_coins + p_coins
    WHERE user_id = p_user_id;
    
    -- Registrar actividad
    INSERT INTO public.user_activities (user_id, activity_type, description, xp_awarded, coins_awarded)
    VALUES (p_user_id, 'xp_reward', COALESCE(p_description, 'XP otorgado'), p_xp, p_coins);
END;
$$ language 'plpgsql';

-- Función para obtener estadísticas de usuario
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_xp', COALESCE(up.total_xp, 0),
        'total_coins', COALESCE(up.total_coins, 0),
        'level', COALESCE(up.level, 1),
        'rank', COALESCE(up.rank, 'Bronze'),
        'achievements_count', (
            SELECT COUNT(*) FROM public.user_achievements WHERE user_id = p_user_id
        ),
        'total_purchases', (
            SELECT COUNT(*) FROM public.transactions 
            WHERE user_id = p_user_id AND type = 'purchase' AND status = 'completed'
        ),
        'total_spent', (
            SELECT COALESCE(SUM(amount), 0) FROM public.transactions 
            WHERE user_id = p_user_id AND type = 'purchase' AND status = 'completed'
        )
    ) INTO result
    FROM public.user_profiles up
    WHERE up.user_id = p_user_id;
    
    RETURN result;
END;
$$ language 'plpgsql';

-- ====================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ====================================

COMMENT ON TABLE public.users IS 'Tabla principal de usuarios con información básica';
COMMENT ON TABLE public.user_profiles IS 'Perfiles de gamificación con XP, nivel y logros';
COMMENT ON TABLE public.user_addresses IS 'Direcciones de entrega de los usuarios';
COMMENT ON TABLE public.user_payment_methods IS 'Métodos de pago de los usuarios';
COMMENT ON TABLE public.transactions IS 'Historial de transacciones y compras';
COMMENT ON TABLE public.user_activities IS 'Registro de actividades del usuario';
COMMENT ON TABLE public.achievements IS 'Catálogo de logros disponibles';
COMMENT ON TABLE public.user_achievements IS 'Logros obtenidos por cada usuario';

-- ====================================
-- FIN DEL SCRIPT
-- ====================================
