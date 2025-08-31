"use client";
/**
 * MatchVote.tsx
 * -----------------------------------------------------------------------------
 * Componente de Votación para un Match/Torneo (MVP)
 *
 * Diseño:
 * - Móvil (portrait): tarjetas apiladas (Arriba / Abajo) + "🆚" en el centro.
 * - Desktop (md+): 2 columnas 50/50.
 *
 * Funciones incluidas:
 * - Carga de match + participantes desde Supabase.
 * - Contador de votos por lado (oculto hasta que el usuario vote).
 * - Temporizador (barra superior) que muestra el tiempo restante.
 * - Voto rápido (🔥) con sesión requerida.
 * - Realtime: suscripción a `votes` por `match_id` para actualizar marcador.
 *
 * Cómo editar:
 * - Colores/neón: ver const THEME.
 * - Reacciones disponibles: ver const REACTIONS (ahora usamos solo 🔥 para MVP).
 * - Mensajes/textos: ver const UI_TEXT.
 * - Lógica de “marcador oculto” hasta votar: prop `hideScoreUntilVote`.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { FaFire } from "react-icons/fa";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ======================= CONFIG EDITABLE ======================= */
const THEME = {
  bg: "#0A0A0B",
  text: "#FFFFFF",
  subtext: "rgba(255,255,255,.75)",
  border: "rgba(255,255,255,.12)",
  neon: "#32E6FF",        // cambia a "#FF3BF5" si prefieres fucsia
  losing: "rgba(255,255,255,.65)",
  barBg: "rgba(255,255,255,.14)",
};

const UI_TEXT = {
  endsIn: "Termina en",
  vote: "Votar",
  closed: "Votación cerrada",
  needLogin: "Inicia sesión para votar",
  details: "Detalles",
};

const REACTIONS = [
  { key: "fire", label: "🔥" }, // MVP: solo 🔥 (puedes habilitar más después)
] as const;

type ReactionKey = typeof REACTIONS[number]["key"];

const hideScoreUntilVote = true;
/* =============================================================== */

/* ========================= TIPADOS MVP ========================= */
type Participant = {
  id: string;              // tournament_participants.id
  display_name: string;
  avatar_url: string | null;
};

type MatchRow = {
  id: string;
  tournament_id: string;
  round: number;
  starts_at: string | null;
  ends_at: string | null;
  status: "scheduled" | "voting" | "closed";
  slot_left: string | null;   // participant_id
  slot_right: string | null;  // participant_id
  winner_participant_id: string | null;
};

type VoteCounts = { left: number; right: number };

type Props = {
  matchId: string;         // UUID del match
  /* Opcional: si quieres ocultar marcador siempre, pon false aquí y muestra siempre. */
  revealScoreAfterVote?: boolean;
};
/* =============================================================== */

export default function MatchVote({ matchId, revealScoreAfterVote = hideScoreUntilVote }: Props) {
  // Estado base
  const [sessionUser, setSessionUser] = useState<string | null>(null);
  const [match, setMatch] = useState<MatchRow | null>(null);
  const [leftP, setLeftP] = useState<Participant | null>(null);
  const [rightP, setRightP] = useState<Participant | null>(null);
  const [counts, setCounts] = useState<VoteCounts>({ left: 0, right: 0 });
  const [userVotedSide, setUserVotedSide] = useState<"left" | "right" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0); // segs

  // ======== 1) Cargar sesión, match, participantes y contadores ========
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { data: auth } = await supabase.auth.getUser();
      setSessionUser(auth.user?.id ?? null);

      // Carga match
      const { data: m } = await supabase
        .from("matches")
        .select("id,tournament_id,round,starts_at,ends_at,status,slot_left,slot_right,winner_participant_id")
        .eq("id", matchId)
        .single();

      if (!m) {
        setIsLoading(false);
        return;
      }
      setMatch(m as MatchRow);

      // Carga participantes (por slot_*). Ajusta nombres de tabla/columnas a tu esquema real.
      const loadParticipant = async (participantId: string | null): Promise<Participant | null> => {
        if (!participantId) return null;
        const { data } = await supabase
          .from("tournament_participants")
          .select("id, display_name, avatar_url")
          .eq("id", participantId)
          .single();
        return data as Participant;
      };

      const [lp, rp] = await Promise.all([
        loadParticipant(m.slot_left),
        loadParticipant(m.slot_right),
      ]);

      setLeftP(lp);
      setRightP(rp);

      // Contadores iniciales
      await refreshCounts();

      // Si el usuario ya votó, detectarlo para revelar marcador
      if (auth.user?.id) {
        const { data: prev } = await supabase
          .from("votes")
          .select("id, side")
          .eq("match_id", matchId)
          .eq("user_id", auth.user.id)
          .limit(1)
          .maybeSingle();

        if (prev?.side === "left" || prev?.side === "right") {
          setUserVotedSide(prev.side as "left" | "right");
        }
      }

      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  // ======== 2) Realtime: escucha nuevos votos de este match =========
  useEffect(() => {
    if (!match) return;
    const channel = supabase
      .channel(`votes_match_${match.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes", filter: `match_id=eq.${match.id}` },
        () => refreshCounts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.id]);

  // ======== 3) Timer (tiempo restante) ========
  useEffect(() => {
    if (!match?.ends_at) return;
    const calc = () => {
      const end = new Date(match.ends_at!).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(diff);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [match?.ends_at]);

  // ======== Helpers ========
  async function refreshCounts() {
    // MVP: 2 queries (left/right). Puedes optimizar con una view que agregue por side.
    const [leftRes, rightRes] = await Promise.all([
      supabase.from("votes").select("*", { count: "exact", head: true }).eq("match_id", matchId).eq("side", "left"),
      supabase.from("votes").select("*", { count: "exact", head: true }).eq("match_id", matchId).eq("side", "right"),
    ]);

    setCounts({
      left: leftRes.count ?? 0,
      right: rightRes.count ?? 0,
    });
  }

  const totalVotes = counts.left + counts.right;
  const pctLeft = totalVotes ? Math.round((counts.left / totalVotes) * 100) : 50;
  const pctRight = 100 - pctLeft;
  const leading: "left" | "right" | "tie" =
    counts.left > counts.right ? "left" : counts.right > counts.left ? "right" : "tie";

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const progress = useMemo(() => {
    if (!match?.ends_at) return 0;
    // barra de tiempo: 100% al inicio → 0% al final
    const end = new Date(match.ends_at!).getTime();
    const start = match.starts_at ? new Date(match.starts_at).getTime() : end - 1000 * 60 * 5; // fallback 5 min
    const total = end - start;
    const remaining = Math.max(0, end - Date.now());
    return Math.max(0, Math.min(100, Math.round((remaining / total) * 100)));
  }, [match?.starts_at, match?.ends_at, timeLeft]);

  const showScore = revealScoreAfterVote ? !!userVotedSide : true;
  const isClosed = match?.status === "closed" || timeLeft <= 0;

  async function requireAuth(): Promise<string | null> {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  }

  // ======== 4) Votar (🔥) ========
  async function vote(side: "left" | "right", reaction: ReactionKey = "fire") {
    const uid = await requireAuth();
    if (!uid) {
      alert(UI_TEXT.needLogin);
      return;
    }
    if (!match) return;

    // Insert único por usuario + match + (opcional: reacción)
    const { error } = await supabase.from("votes").insert({
      match_id: match.id,
      user_id: uid,
      side,
      reaction,
      weight: 1, // si luego aplicas multiplicadores por nivel, cámbialo aquí
    });

    if (error) {
      // Si existe restricción UNIQUE, aquí puede fallar si ya votó.
      console.warn("vote error", error.message);
    } else {
      setUserVotedSide(side);
      refreshCounts();
    }
  }

  /* ============================== UI ============================== */
  if (isLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center" style={{ background: THEME.bg, color: THEME.text }}>
        Cargando match…
      </div>
    );
  }

  if (!match || !leftP || !rightP) {
    return (
      <div className="min-h-[60vh] grid place-items-center" style={{ background: THEME.bg, color: THEME.text }}>
        Match no disponible
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ background: THEME.bg, color: THEME.text }}>
      {/* Barra superior: timer */}
      <div className="sticky top-0 left-0 right-0 z-10">
        <div className="h-1" style={{ background: THEME.barBg }}>
          <div
            className="h-1 transition-[width] duration-500"
            style={{ width: `${progress}%`, background: THEME.neon }}
          />
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-sm opacity-80">Ronda {match.round}</div>
          <div className="text-sm font-semibold">
            {isClosed ? UI_TEXT.closed : `${UI_TEXT.endsIn} ${minutes}:${seconds}`}
          </div>
          <button
            className="text-sm opacity-80 border border-white/10 rounded-lg px-3 py-1"
            onClick={() => alert("Aquí puedes abrir el modal de 'Detalles' con histórico, reglas, etc.")}
          >
            {UI_TEXT.details}
          </button>
        </div>
      </div>

      {/* Zona de tarjetas (responsive) */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LADO IZQUIERDO */}
          <SideCard
            label="LEFT"
            participant={leftP}
            votes={counts.left}
            percent={pctLeft}
            leading={leading === "left"}
            showScore={showScore}
            disabled={isClosed}
            onVote={() => vote("left", "fire")}
          />

          {/* LADO DERECHO */}
          <SideCard
            label="RIGHT"
            participant={rightP}
            votes={counts.right}
            percent={pctRight}
            leading={leading === "right"}
            showScore={showScore}
            disabled={isClosed}
            onVote={() => vote("right", "fire")}
          />
        </div>

        {/* “🆚” centrado solo en móvil (cuando las tarjetas están apiladas) */}
        <div className="md:hidden grid place-items-center py-2 text-3xl opacity-90">🆚</div>
      </div>
    </div>
  );
}

/* ======================= Sub-componente SideCard ======================= */
function SideCard({
  label,
  participant,
  votes,
  percent,
  leading,
  showScore,
  disabled,
  onVote,
}: {
  label: "LEFT" | "RIGHT";
  participant: Participant;
  votes: number;
  percent: number;
  leading: boolean;
  showScore: boolean;
  disabled: boolean;
  onVote: () => void;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: THEME.border, background: "rgba(255,255,255,.04)" }}
    >
      {/* Foto / avatar */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {participant.avatar_url ? (
          <Image
            src={participant.avatar_url}
            alt={participant.display_name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-3xl" style={{ background: "rgba(255,255,255,.06)" }}>
            {participant.display_name?.slice(0, 2)?.toUpperCase() ?? "??"}
          </div>
        )}
        {/* Gradiente inferior para texto */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
        {/* Nombre */}
        <div className="absolute left-3 bottom-3 text-lg font-extrabold drop-shadow">
          {participant.display_name}
        </div>
      </div>

      {/* Contador / Porcentaje */}
      <div className="p-4 space-y-3">
        {/* Total grande */}
        <div
          className="text-5xl font-black tracking-tight"
          style={{
            color: showScore ? THEME.text : THEME.losing,
            opacity: showScore ? 1 : 0.35,
            textShadow: leading && showScore ? `0 0 18px ${THEME.neon}77` : "none",
          }}
        >
          {showScore ? votes : "•••"}
        </div>

        {/* Porcentaje + barra */}
        <div className="flex items-center justify-between text-sm" style={{ color: THEME.subtext }}>
          <span>{showScore ? `${percent}%` : "--"}</span>
          <span className="opacity-80">{label}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: THEME.barBg }}>
          <div
            className="h-2 transition-[width] duration-500"
            style={{ width: showScore ? `${percent}%` : "0%", background: THEME.neon }}
          />
        </div>

        {/* Botón votar (🔥) */}
        <button
          onClick={onVote}
          disabled={disabled}
          className={`w-full mt-2 py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 ${
            disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
          style={{
            background: disabled ? "rgba(255,255,255,.08)" : THEME.neon,
            color: disabled ? THEME.text : "#000",
            boxShadow: disabled ? "none" : `0 0 22px ${THEME.neon}66`,
          }}
        >
          <FaFire />
          {disabled ? "Cerrado" : `${UI_TEXT.vote} 🔥`}
        </button>
      </div>
    </div>
  );
}