"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan variables de entorno de Supabase");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<unknown>(null);
  const router = useRouter();

  // Detectar usuario autenticado al cargar
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });
    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  function validateEmail(email: string) {
    // Validación básica de email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateEmail(email)) {
      setError("Correo electrónico inválido");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (mode === "login") {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess("¡Éxito! Redirigiendo...");
        setTimeout(() => {
          router.push("/home");
        }, 1200);
      }
    } finally {
      setLoading(false);
    }
  }

  // Mostrar mensaje de éxito antes de mostrar el estado autenticado
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="bg-gray-900 p-6 rounded-lg w-80 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">{success}</h2>
          <div className="loader mb-4" />
          <p>Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, mostrar mensaje y avatar
  if (user) {
    const avatar = user.user_metadata?.avatar_url || "/assets/avatar.png";
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
  <Image src={avatar} alt="Avatar" width={80} height={80} className="rounded-full mb-4 border-4 border-yellow-400" />
        <h2 className="text-2xl font-bold mb-2">¡Bienvenido, {user.email}!</h2>
        <p className="mb-4">Ya has iniciado sesión.</p>
        <button
          className="bg-yellow-400 text-black font-bold py-2 px-6 rounded"
          onClick={() => router.push("/home")}
        >
          Ir a la tienda
        </button>
      </div>
    );
  }

  // Si no está autenticado, mostrar formulario
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg w-80" noValidate>
        <h2 className="text-xl font-bold mb-4">
          {mode === "login" ? "Inicia sesión" : "Crea una cuenta"}
        </h2>

        <div className="mb-3">
          <label htmlFor="email" className="block text-sm mb-1">Correo</label>
            let result;
            if (mode === "login") {
              result = await supabase.auth.signInWithPassword({ email, password });
            } else {
              result = await supabase.auth.signUp({ email, password });
            }

            if (result.error) {
              setError(result.error.message);
            } else {
              setSuccess("¡Éxito! Redirigiendo...");
              // Redirigir después de mostrar el mensaje de éxito
              setTimeout(() => {
                router.push("/home");
              }, 1500);
            }
          } finally {
            setLoading(false);
          }
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white"
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {error && <div className="text-red-400 text-sm mb-2 text-center">{error}</div>}
        {success && <div className="text-green-400 text-sm mb-2 text-center">{success}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-black font-bold py-2 rounded"
        >
          {loading
            ? "Cargando..."
            : mode === "login"
            ? "Entrar"
            : "Registrarse"}
        </button>

        <p className="text-sm text-center mt-4">
          {mode === "login"
            ? "¿No tienes cuenta? "
            : "¿Ya tienes cuenta? "}
          <button
            type="button"
            className="underline text-yellow-400"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
              setSuccess(null);
            }}
          >
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </form>
    </div>
  );
}
