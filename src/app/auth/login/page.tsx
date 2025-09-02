"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // <- ruta relativa corregida

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIN con email y password ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href = "/profile"; // 🔥 redirige al perfil después de login
    setLoading(false);
  };

  // --- LOGIN con Google ---
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/profile" },
    });
    if (error) setError(error.message);
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Entra a Boom</h1>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 20 }}>
          Coins, torneos, niveles y booms en un solo lugar.
        </p>

        {/* BOTÓN GOOGLE */}
        <button style={googleBtn} onClick={handleGoogleLogin}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
          Continuar con Google
        </button>

        <div style={separator}><span>o</span></div>

        {/* FORM EMAIL */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
            required
          />
          <button type="submit" style={primaryBtn} disabled={loading}>
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        {/* ERROR */}
        {error && <p style={{ color: "red", marginTop: 10, fontSize: 14 }}>{error}</p>}

        {/* LINKS */}
        <div style={{ marginTop: 20, fontSize: 12, opacity: 0.8 }}>
          ¿Olvidaste tu contraseña? <a href="#" style={{ color: "#13ef95" }}>Recupérala</a>
          <br />
          ¿No tienes cuenta? <a href="#" style={{ color: "#13ef95" }}>Crear cuenta</a>
        </div>

        {/* DISCLAIMER */}
        <div style={{ marginTop: 30, fontSize: 11, opacity: 0.7, lineHeight: 1.4 }}>
          🔒 Tus datos están protegidos con Supabase.<br />
          Los coins son virtuales y solo se usan dentro de Boom.
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS EN-LINEA ---
// Puedes moverlos a Tailwind o CSS si prefieres

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#000",
  color: "#fff",
};

const card = {
  width: "100%",
  maxWidth: 360,
  padding: 24,
  borderRadius: 12,
  background: "linear-gradient(180deg,#0a0a0a,#070707)",
  border: "1px solid #222",
  boxShadow: "0 8px 24px #000a",
  textAlign: "center",
};

const input = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #333",
  background: "#111",
  color: "#fff",
};

const primaryBtn = {
  marginTop: 10,
  padding: "10px 12px",
  borderRadius: 8,
  border: "none",
  background: "#13ef95",
  color: "#000",
  fontWeight: 800,
  cursor: "pointer",
};

const googleBtn = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #333",
  background: "#fff",
  color: "#000",
  fontWeight: 600,
  marginBottom: 16,
  cursor: "pointer",
};

const separator = {
  margin: "16px 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  fontSize: 12,
  opacity: 0.6,
};