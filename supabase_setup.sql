-- Script SQL para configurar la base de datos de DozurShop en Supabase
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear tabla de puntos de usuario mejorada
DROP TABLE IF EXISTS user_points CASCADE;

CREATE TABLE user_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) DEFAULT 'Usuario',
    bio TEXT DEFAULT 'Escribe algo sobre ti...',
    email VARCHAR(255),
    phone VARCHAR(20),
    avatar TEXT,
    cover_photo TEXT,
    total_xp INTEGER DEFAULT 0,
    total_coins INTEGER DEFAULT 100,
    daily_streak INTEGER DEFAULT 0,
    last_activity DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- 2. Crear tabla de actividades de XP
CREATE TABLE xp_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    xp_gained INTEGER NOT NULL,
    coins_gained INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Crear tabla de transacciones de coins
CREATE TABLE coin_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item VARCHAR(100) NOT NULL,
    coins_spent INTEGER NOT NULL,
    transaction_type VARCHAR(20) DEFAULT 'purchase',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Crear tabla de métodos de pago
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    card_last_four VARCHAR(4) NOT NULL,
    card_brand VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Crear tabla de direcciones
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Casa',
    street_address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'México',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Crear bucket para imágenes de perfil
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profiles', 'profiles', true)
ON CONFLICT DO NOTHING;

-- 7. Crear políticas de seguridad para user_points
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_points
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_points
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_points
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Crear políticas para xp_activities
ALTER TABLE xp_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activities" ON xp_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON xp_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Crear políticas para coin_transactions
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON coin_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON coin_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. Crear políticas para payment_methods
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own payment methods" ON payment_methods
    FOR ALL USING (auth.uid() = user_id);

-- 11. Crear políticas para user_addresses
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses" ON user_addresses
    FOR ALL USING (auth.uid() = user_id);

-- 12. Crear políticas para storage de imágenes
CREATE POLICY "Users can upload own images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profiles' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view profile images" ON storage.objects
    FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Users can update own images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'profiles' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'profiles' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- 13. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 14. Crear triggers para updated_at
CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON user_points 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 15. Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_points (user_id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario')
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 16. Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- 17. Insertar datos de ejemplo (opcional)
-- Descomentar si quieres datos de prueba
/*
INSERT INTO user_points (user_id, name, bio, total_xp, total_coins, daily_streak) 
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Usuario Demo',
    'Este es un perfil de demostración',
    2500,
    350,
    5
);

INSERT INTO payment_methods (user_id, card_last_four, card_brand)
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    '4532',
    'Visa'
);

INSERT INTO user_addresses (user_id, label, street_address, city, state, postal_code)
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Casa',
    'Calle Example 123',
    'Ciudad de México',
    'CDMX',
    '01000'
);
*/

-- Script completado
-- Asegúrate de que la autenticación esté habilitada en tu proyecto de Supabase
-- y que tengas las configuraciones de email correctas.
