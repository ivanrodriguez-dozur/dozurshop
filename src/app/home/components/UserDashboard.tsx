"use client";
import React, { useState, useEffect } from "react";
import { FaQuestionCircle, FaCoins, FaCrown, FaClock, FaBolt, FaTrophy, FaFire } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURACIÓN SUPABASE (ajusta si usas otro cliente global) ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
if (!supabaseUrl || !supabaseAnonKey) throw new Error("Faltan variables de entorno de Supabase");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- RETOS DIARIOS (puedes editar o traducir) ---
const CHALLENGES = [
  "Haz 5 booms y mira 10 videos completos",
  "Comparte 1 video con un amigo",
  "Comenta en 3 publicaciones",
  "Haz 10 booms en fotos",
  "Mira 5 videos seguidos sin salir",
  // ...agrega hasta 50 retos únicos
];
while (CHALLENGES.length < 50) CHALLENGES.push(`Reto aleatorio #${CHALLENGES.length + 1}`);

// --- LÓGICA DE XP Y NIVELES ---
function getLevel(xp: number) {
  let level = 1, next = 500;
  while (xp >= next) {
    level++;
    next *= 2;
  }
  return { level, nextLevelXp: next, currentLevelXp: next / 2 };
}

// ...existing code...

// --- COMPONENTE PRINCIPAL ---
interface UserDashboardProps {
  userData?: {
    avatar_url?: string;
    nickname?: string;
    xp?: number;
    // Agrega más campos según tu modelo de usuario
  };
}

function UserDashboard(props: UserDashboardProps) {
  // Aquí van tus hooks y lógica de estado
  const [showLogin, setShowLogin] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);
  const [booms, setBooms] = useState(0);
  const [time, setTime] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentLevelXp, setCurrentLevelXp] = useState(0);
  const [nextLevelXp, setNextLevelXp] = useState(500);

  // ...aquí iría la lógica de useEffect y demás hooks...

  return (
    <>
      {showLogin && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setShowLogin(false)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 flex flex-col gap-4 max-w-xs w-full mx-4 relative"
              style={{ maxWidth: 340, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Login/Logout solo en el modal */}
              {!isLogged && (
                <>
                  <input type="email" placeholder="Correo" className="border rounded px-2 py-1 text-xs w-full" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                  <input type="password" placeholder="Contraseña" className="border rounded px-2 py-1 text-xs w-full" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                  <button
                    className="bg-blue-500 text-white rounded py-1 mt-3 text-base font-bold w-full"
                    style={{letterSpacing:1}}
                    onClick={() => {
                      setIsLogged(true);
                      setShowLogin(false);
                      setShowWelcome(true);
                      setTimeout(() => setShowWelcome(false), 1800);
                    }}
                  >Iniciar sesión</button>
                </>
              )}
              {isLogged && (
                <button className="bg-red-500 text-white rounded py-1 mt-2 text-xs" onClick={() => setIsLogged(false)}>Cerrar sesión</button>
              )}
            </div>
          </div>
        </>
      )}
      {/* Animación de bienvenida */}
      {showWelcome && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-br from-green-300 to-blue-400 rounded-3xl shadow-2xl px-8 py-6 text-white text-2xl font-extrabold flex flex-col items-center gap-2">
            <span className="animate-pulse">¡Bienvenido!</span>
            <span className="text-lg font-normal">Disfruta tu experiencia 🎉</span>
          </div>
        </div>
      )}
      {/* Animación pulse para el mensaje de bienvenida */}
      <style jsx global>{`
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
        .animate-pulse { animation: pulse 1.2s infinite; }
      `}</style>

      {/* Carrusel de secciones */}
      <div className="flex overflow-x-auto gap-4 pb-2 snap-x">
        {/* Coins */}
        <SectionCard
          icon={<FaCoins className="text-yellow-400 text-2xl" />}
          title="Coins"
          value={coins}
          info="Los coins se obtienen por puntos de experiencia (XP). Cada 100 XP = 1 coin. Sirven para desbloquear recompensas."
          showInfo={showInfo === "coins"}
          onInfo={() => setShowInfo(showInfo === "coins" ? null : "coins")}
        />
        {/* Retos diarios */}
        <SectionCard
          icon={<FaTrophy className="text-pink-500 text-2xl" />}
          title="Reto diario"
          value={<span className="text-xs font-semibold">{CHALLENGES[challengeIdx]}</span>}
          info="Solo puedes cumplir un reto diario. Al completarlo, ganas XP extra."
          showInfo={showInfo === "reto"}
          onInfo={() => setShowInfo(showInfo === "reto" ? null : "reto")}
        />
        {/* Booms */}
        <SectionCard
          icon={<FaFire className="text-orange-500 text-2xl" />}
          title="Booms"
          value={booms}
          info="Los booms son likes a fotos o videos. Cada boom = 1 XP."
          showInfo={showInfo === "booms"}
          onInfo={() => setShowInfo(showInfo === "booms" ? null : "booms")}
        />
        {/* Tiempo */}
        <SectionCard
          icon={<FaClock className="text-green-500 text-2xl" />}
          title="Tiempo"
          value={`${Math.floor(time / 60)}h ${time % 60}m`}
          info="Por cada hora en la app ganas 5 XP."
          showInfo={showInfo === "tiempo"}
          onInfo={() => setShowInfo(showInfo === "tiempo" ? null : "tiempo")}
        />
        {/* Level */}
        <SectionCard
          icon={<FaCrown className="text-purple-500 text-2xl" />}
          title="Level"
          value={level}
          info={`Nivel actual. Sube de nivel acumulando XP. Nivel 1: 500 XP, Nivel 2: 1000 XP, Nivel 3: 2000 XP, etc.`}
          showInfo={showInfo === "level"}
          onInfo={() => setShowInfo(showInfo === "level" ? null : "level")}
        >
          {/* Barra de progreso de nivel */}
          <div className="w-full h-2 bg-gray-200 rounded mt-2">
            <div
              className="h-2 rounded bg-gradient-to-r from-yellow-400 to-purple-400"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            {xp - currentLevelXp} / {nextLevelXp - currentLevelXp} XP para el siguiente nivel
          </div>
        </SectionCard>
        {/* Estadísticas (espacio para gráficos) */}
        <SectionCard
          icon={<FaBolt className="text-indigo-500 text-2xl" />}
          title="Estadísticas"
          value={<span className="text-xs">Gráficos aquí</span>}
          info="Visualiza tu progreso diario, semanal y mensual. Puedes usar gráficos de barras, líneas o pastel."
          showInfo={showInfo === "stats"}
          onInfo={() => setShowInfo(showInfo === "stats" ? null : "stats")}
        >
          {/* Aquí puedes insertar un gráfico dinámico con Chart.js, Recharts, etc. */}
          <div className="w-32 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-gray-400">
            {/* Ejemplo: <BarChart data={...} /> */}
            [Gráfico]
          </div>
        </SectionCard>
      </div>
    </>
  );
}

// --- COMPONENTE DE SECCIÓN/CARD DEL CARRUSEL ---
interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  info: string;
  showInfo: boolean;
  onInfo: () => void;
  children?: React.ReactNode;
}

function SectionCard({ icon, title, value, info, showInfo, onInfo, children }: SectionCardProps) {
  return (
    <div className="min-w-[160px] max-w-[180px] bg-white rounded-2xl shadow-md p-4 flex flex-col items-center relative snap-center">
      <div className="absolute top-2 right-2">
        <button onClick={onInfo} className="text-blue-400 hover:text-blue-600 focus:outline-none">
          <FaQuestionCircle />
        </button>
        {showInfo && (
          <div
            className="absolute z-50 top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-[10px] text-gray-700 break-words"
            style={{
              fontSize: 10,
              wordBreak: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            {info}
          </div>
        )}
      </div>
      <div className="mb-2">{icon}</div>
      <div className="font-bold text-md mb-1 text-center">{title}</div>
      <div className="text-2xl font-extrabold text-purple-700 mb-1 text-center">{value}</div>
      {children}
    </div>
  );
}

// --- INSTRUCCIONES ---
// 1. Conecta los estados a tu backend o contexto global para datos reales.
// 2. Reemplaza los gráficos de ejemplo por componentes reales.
// 3. Personaliza los retos en el array CHALLENGES.
// 4. Puedes mejorar el carrusel con librerías como keen-slider, swiper, etc.
// 5. Agrega animaciones con Tailwind, Framer Motion o CSS.
// 6. Usa el componente en tu login o dashboard: <UserDashboard userData={user} />

export default UserDashboard;
