"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Componentes de gamificación
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsGrid from "@/components/profile/StatsGrid";
import ActivityFeed from "@/components/profile/ActivityFeed";
import { useGamificationStore } from "@/store/gamificationStore";

// API helpers perfil
import { loadProfile, updateAvatar, updateHaloColor } from "@/lib/profileApi";

// Dummy fetchStats function, replace with your actual implementation or import
type Stats = {
  coins: number;
  points: number;
  level: number;
};

async function fetchStats(): Promise<Stats> {
  // Replace this with your actual stats fetching logic
  return {
    coins: 0,
    points: 0,
    level: 1,
  };
}

// ================== CONFIG, StatCard y SkeletonRow ==================
const CONFIG = {
  ui: {
    ringSize: 120,
    ringThickness: 8,
    ringSpeedSec: 6,
  },
  brand: {
    neon: "#00fff7",
    auraGlow: "",
  },
  labels: {
    coins: "Coins",
    points: "Puntos",
    level: "Nivel",
    redeem: "Canjear premios",
  },
  help: {
    coins: { title: "Coins", body: "Tus monedas acumuladas por actividad." },
    points: { title: "Puntos", body: "Puntos obtenidos por acciones y retos." },
    level: { title: "Nivel", body: "Tu nivel actual basado en tu experiencia." },
  },
  equivalences: {
    pointsPerCoin: 10,
    coinsPerLevelUp: 50,
  },
};

// ================== IMPORTS ICONOS ==================
import Image from "next/image";
import { GiTwoCoins, GiCrossedSwords } from "react-icons/gi";
import { MdLocalActivity, MdFavorite, MdBookmark } from "react-icons/md";
import { FaFire, FaLock } from "react-icons/fa";
import { TbTournament } from "react-icons/tb";

// ================== COMPONENTE PRINCIPAL ==================

export default function PerfilUsuario() {
  // Estados de gamificación
  const { 
    xp, 
    coins, 
    level, 
    rank, 
    loadUserData, 
    addXp 
  } = useGamificationStore();

  // Estados del perfil
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showCoins, setShowCoins] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const [editHalo, setEditHalo] = useState(CONFIG.brand.neon);
  const [loadingSave, setLoadingSave] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"likes" | "saves" | "history">("likes");
  const [act, setAct] = useState<any>(null);
  const [loadingAct, setLoadingAct] = useState(false);

  // Ref para input de archivo
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ================== EFFECTS ==================
  useEffect(() => {
    loadUserData();
    initializeProfile();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ================== FUNCIONES ==================

  const initializeProfile = async () => {
    try {
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      setSessionUser(user);

      if (user) {
        // Cargar perfil completo
        const profileData = await loadProfile(user.id);
        setProfile(profileData);
        setEditName(profileData?.nickname || user.user_metadata?.full_name || "Usuario");
        setEditAvatar(profileData?.avatar_url || null);
        setEditHalo(profileData?.halo_color || CONFIG.brand.neon);

        // Cargar stats
        const statsData = await fetchStats();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error inicializando perfil:", error);
    }
  };

  const onToggleCoins = () => {
    setShowCoins(!showCoins);
    if (!showCoins) {
      addXp(5, "Activando vista de monedas");
    }
  };

  const goLogin = () => {
    window.location.href = "/auth/login";
  };

  const goShop = () => {
    window.location.href = "/shop";
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleSave = async () => {
    if (!sessionUser) return;
    
    setLoadingSave(true);
    try {
      const userId = sessionUser.id;
      
      // Actualizar nombre y color de halo
      if (editName !== profile?.nickname) {
        // Aquí iría la función para actualizar el nickname
        console.log("Actualizando nickname:", editName);
      }
      
      if (editHalo !== profile?.halo_color) {
        await updateHaloColor(userId, editHalo);
      }
      
      // Actualizar avatar si cambió
      if (editAvatar && editAvatar !== profile?.avatar_url && fileInputRef.current?.files?.[0]) {
        await updateAvatar(userId, editAvatar);
      }
      
      setToast("Perfil actualizado");
      setEditMode(false);
      addXp(10, "Perfil actualizado");
      
      // Refrescar perfil
      const p = await loadProfile(userId);
      setProfile(p);
    } catch {
      setToast("Error al guardar cambios");
    }
    setLoadingSave(false);
  };

  // Cambiar avatar (previsualización)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setEditAvatar(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ================== COMPONENTES INTERNOS ==================

  // Skeleton loader
  function SkeletonRow() {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 rounded-lg h-20"></div>
          ))}
        </div>
      </div>
    );
  }

  // StatCard component
  function StatCard({ 
    icon, 
    label, 
    value, 
    glowHex, 
    helpTitle, 
    helpBody, 
    hidden = false 
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    glowHex: string;
    helpTitle: string;
    helpBody: string;
    hidden?: boolean;
  }) {
    return (
      <div 
        className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col items-center text-center"
        style={hidden ? {} : { boxShadow: `0 0 12px ${glowHex}44` }}
      >
        <div className="text-2xl mb-2" style={{ color: glowHex }}>
          {icon}
        </div>
        <div className="text-xs opacity-80 mb-1">{label}</div>
        <div className="font-bold text-lg">
          {hidden ? "***" : value}
        </div>
      </div>
    );
  }

  // ActivityGrid component
  type ActivityItem = {
    id: string;
    title: string;
    videoUrl?: string;
  };

  type ActivityGridProps = {
    items: ActivityItem[];
    emptyText: string;
  };

  function ActivityGrid({ items, emptyText }: ActivityGridProps) {
    if (!items || items.length === 0) {
      return (
        <div className="text-center text-sm opacity-60 py-8">{emptyText}</div>
      );
    }
    return (
      <div className="grid gap-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg bg-white/10 p-3 flex flex-col gap-2">
            <div className="font-bold mb-1">{item.title}</div>
            {item.videoUrl && (
              <video
                src={item.videoUrl}
                controls
                className="w-full rounded-lg border border-white/10 bg-black"
                style={{ maxHeight: 240 }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  const renderActivity = () => {
    if (loadingAct) return <SkeletonRow />;

    if (activeTab === "likes") {
      return (
        <ActivityGrid
          items={act?.likes ?? []}
          emptyText="Aún no has dado 🔥 a ningún Boom."
        />
      );
    }

    if (activeTab === "saves") {
      return (
        <ActivityGrid
          items={act?.saves ?? []}
          emptyText="Aún no has guardado Booms."
        />
      );
    }

    return (
      <ActivityGrid
        items={act?.history ?? []}
        emptyText="Tu historial está vacío."
      />
    );
  };

  // Get nickname for display
  const nickname = profile?.nickname || sessionUser?.user_metadata?.full_name || "Usuario";

  // ================== RENDER ==================
  return (
    <div className="min-h-screen w-full bg-[#0A0A0B] text-white pb-24">
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-lg font-extrabold tracking-wide">Tu Perfil</h1>
        {sessionUser && !editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 font-bold transition flex items-center gap-1"
            title="Editar perfil"
          >
            <span>Editar</span>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.414 2.586a2 2 0 0 0-2.828 0l-9.5 9.5A2 2 0 0 0 4 13.414V16a1 1 0 0 0 1 1h2.586a2 2 0 0 0 1.414-.586l9.5-9.5a2 2 0 0 0 0-2.828l-2-2ZM6 15H5v-1l8.293-8.293 1 1L6 15Zm9.707-9.707-1-1 1-1a1 1 0 0 1 1.414 1.414l-1 1Z"/>
            </svg>
          </button>
        )}
      </div>

      {/* ====== LOGIN CTA cuando NO hay sesión ====== */}
      {!sessionUser && (
        <div className="mx-5 mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
          <div className="font-bold mb-1">Inicia sesión</div>
          <p className="opacity-80">
            Para editar tu avatar, guardar cambios y sincronizar tu actividad.
          </p>
          <button
            onClick={goLogin}
            className="mt-3 px-4 py-2 rounded-xl bg-white text-black font-bold w-full"
          >
            Iniciar sesión
          </button>
        </div>
      )}

      {/* Avatar + nickname */}
      <div className="px-5 mt-2 flex flex-col items-center">
        {/* Avatar y halo */}
        <div className="relative group" style={{ width: CONFIG.ui.ringSize, height: CONFIG.ui.ringSize }}>
          <div
            className="absolute inset-0 rounded-full transition-all duration-300"
            style={{
              background: `conic-gradient(from 0deg, rgba(0,0,0,0) 0deg, rgba(0,0,0,0) 240deg, ${editMode ? editHalo : (profile?.halo_color || CONFIG.brand.neon)} 300deg, rgba(0,0,0,0) 330deg, rgba(0,0,0,0) 360deg)`,
              WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${CONFIG.ui.ringThickness}px), #000 0)`,
              mask: `radial-gradient(farthest-side, transparent calc(100% - ${CONFIG.ui.ringThickness}px), #000 0)`,
              animation: `spin ${CONFIG.ui.ringSpeedSec}s linear infinite`,
              boxShadow: `0 0 22px ${(editMode ? editHalo : (profile?.halo_color || CONFIG.brand.neon))}88`,
            }}
          />
          <div
            className={`absolute rounded-full overflow-hidden bg-white/5 border border-white/10 ${CONFIG.brand.auraGlow}`}
            style={{ inset: CONFIG.ui.ringThickness + 2 }}
          >
            {editMode ? (
              <>
                <label htmlFor="avatar-upload" className="w-full h-full flex items-center justify-center cursor-pointer group-hover:opacity-80 transition">
                  {editAvatar ? (
                    <Image src={editAvatar} alt="avatar" fill sizes="120px" className="object-cover" />
                  ) : (
                    <span className="text-3xl">🧑‍🎤</span>
                  )}
                  <input
                    id="avatar-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </>
            ) : profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={nickname}
                fill
                sizes="120px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                🧑‍🎤
              </div>
            )}
          </div>
        </div>
        
        {/* Nombre debajo del avatar */}
        <div className="mt-3 text-xl font-extrabold">
          {editMode ? (
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-center font-bold outline-none focus:ring-2 focus:ring-cyan-400 transition"
              maxLength={32}
              autoFocus
            />
          ) : (
            nickname
          )}
        </div>
        
        {/* Selector de color de halo */}
        {editMode && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs opacity-70">Color de halo:</span>
            <input
              type="color"
              value={editHalo}
              onChange={e => setEditHalo(e.target.value)}
              className="w-7 h-7 rounded-full border-none outline-none cursor-pointer"
            />
          </div>
        )}
        
        {/* Botones de acción en edición */}
        {editMode && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={loadingSave}
              className="px-4 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-bold transition disabled:opacity-60"
            >
              {loadingSave ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={() => { 
                setEditMode(false); 
                setEditName(profile?.nickname || ""); 
                setEditAvatar(profile?.avatar_url || null); 
                setEditHalo(profile?.halo_color || CONFIG.brand.neon); 
              }}
              disabled={loadingSave}
              className="px-4 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition"
            >
              Cancelar
            </button>
          </div>
        )}
        
        {/* Toast feedback */}
        {toast && (
          <div className="mt-3 px-4 py-2 rounded-lg bg-cyan-700/90 text-white text-sm font-bold animate-fade-in-out">
            {toast}
          </div>
        )}
      </div>

      {/* ====== Stats + switch coins ====== */}
      {/* Skeleton loader para stats */}
      {!stats && <div className="mt-6 px-5"><SkeletonRow /></div>}
      
      <div className="mt-6 px-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm opacity-80 flex items-center gap-2">
            <FaLock className="opacity-70" />
            <span>Privacidad de coins</span>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <span className="text-sm">Mostrar coins</span>
            <input
              type="checkbox"
              className="accent-cyan-400"
              checked={showCoins}
              onChange={onToggleCoins}
            />
          </label>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<GiTwoCoins />}
            label={CONFIG.labels.coins}
            value={stats?.coins ?? 0}
            glowHex={CONFIG.brand.neon}
            helpTitle={CONFIG.help.coins.title}
            helpBody={CONFIG.help.coins.body}
            hidden={!showCoins}
          />
          <StatCard
            icon={<MdLocalActivity />}
            label={CONFIG.labels.points}
            value={stats?.points ?? 0}
            glowHex={"#FF3BF5"}
            helpTitle={CONFIG.help.points.title}
            helpBody={`${CONFIG.help.points.body} Equivalencia sugerida: ${CONFIG.equivalences.pointsPerCoin} pts = 1 coin.`}
          />
          <StatCard
            icon={<FaFire />}
            label={CONFIG.labels.level}
            value={`Lv. ${stats?.level ?? 1}`}
            glowHex={"#32E676"}
            helpTitle={CONFIG.help.level.title}
            helpBody={`${CONFIG.help.level.body} Recompensa sugerida: +${CONFIG.equivalences.coinsPerLevelUp} coins por nivel.`}
          />
        </div>

        <div className="mt-3">
          <button
            onClick={goShop}
            className="w-full py-3 rounded-full font-extrabold bg-[var(--neon)] text-black"
            style={
              {
                "--neon": CONFIG.brand.neon,
                boxShadow: `0 0 18px ${CONFIG.brand.neon}88`,
              } as React.CSSProperties
            }
          >
            {CONFIG.labels.redeem}
          </button>
        </div>
      </div>

      {/* ====== VS / Torneos ====== */}
      {/* Botón de cerrar sesión al final de la sección de edición */}
      {sessionUser && editMode && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold border border-white/10 transition"
            title="Cerrar sesión"
          >
            Cerrar sesión
          </button>
        </div>
      )}
      
      <div className="mt-5 px-5">
        <div className="grid grid-cols-2 gap-3">
           {/* boton versus */}
          <button
            onClick={() => (window.location.href = "/vs")}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-600/30 to-transparent hover:from-fuchsia-600/40 transition p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {/* tus espadas blancas */}
              <GiCrossedSwords className="text-2xl" />
              <div className="text-sm font-bold">Versus</div>
            </div>
            <div className="text-xs opacity-80">Abrir</div>
          </button>

          <button
            onClick={() => (window.location.href = "/tournaments")}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/25 to-transparent hover:from-emerald-500/35 transition p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <TbTournament className="text-xl" />
              <div className="text-sm font-bold">Torneos</div>
            </div>
            <div className="text-xs opacity-80">Abrir</div>
          </button>
        </div>
      </div>

      {/* ====== Tabs de actividad ====== */}
      <div className="mt-6 px-5">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab("likes")}
            className={`rounded-full border px-4 py-2 text-sm flex items-center justify-center gap-2 ${
              activeTab === "likes"
                ? "border-white/30 bg-white/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <MdFavorite /> Likes
          </button>
          <button
            onClick={() => setActiveTab("saves")}
            className={`rounded-full border px-4 py-2 text-sm flex items-center justify-center gap-2 ${
              activeTab === "saves"
                ? "border-white/30 bg-white/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <MdBookmark /> Guardados
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`rounded-full border px-4 py-2 text-sm flex items-center justify-center gap-2 ${
              activeTab === "history"
                ? "border-white/30 bg-white/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <FaFire /> Historial
          </button>
        </div>

        <div className="mt-3">{renderActivity()}</div>
      </div>

      {/* Animación global del aro */}
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
