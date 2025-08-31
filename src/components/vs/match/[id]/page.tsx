"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

// ----- Supabase (usa tus env)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ----- Tipos mínimos
type Participant = {
  id: string;
  name: string | null;
  avatar_url: string | null;     // foto mini
  media_url: string | null;      // foto/video para votar
};

type MatchRow = {
  id: string;
  slot_left: string;   // tournament_participants.id
  slot_right: string;  // tournament_participants.id
  status: "scheduled" | "voting" | "closed";
  ends_at: string | null;
};

type VoteAgg = { choice: "left" | "right"; total: number };

// ===== Helpers
async function requireAuth() {
  const { data } = await supabase.auth.getUser();
  return data.user ? data.user.id : null;
}

function pct(n: number, d: number) {
  if (!d) return 0;
  return Math.round((n * 100) / d);
}

// =====================================================
//                   PANTALLA VS
// =====================================================
export default function VsMatchPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [match, setMatch] = useState<MatchRow | null>(null);
  const [left, setLeft] = useState<Participant | null>(null);
  const [right, setRight] = useState<Participant | null>(null);
  const [leftVotes, setLeftVotes] = useState(0);
  const [rightVotes, setRightVotes] = useState(0);
  const [myChoice, setMyChoice] = useState<"left" | "right" | null>(null);
  const [endsIn, setEndsIn] = useState<string>("");

  // ---------- Carga match + participantes + votos
  useEffect(() => {
    (async () => {
      // Match
      const { data: m, error: em } = await supabase
        .from("matches")
        .select("*")
        .eq("id", id)
        .single();
      if (em || !m) return;

      setMatch(m as MatchRow);

      // Participantes
      const pids = [m.slot_left, m.slot_right];
      const { data: parts } = await supabase
        .from("tournament_participants")
        .select("id,name,avatar_url,media_url")
        .in("id", pids);

      const l = parts?.find((p) => p.id === m.slot_left) || null;
      const r = parts?.find((p) => p.id === m.slot_right) || null;
      setLeft(l as Participant);
      setRight(r as Participant);

      // Conteo inicial
      await refreshVotes(id);
      // Mi voto (si existe)
      const uid = await requireAuth();
      if (uid) {
        const { data: my } = await supabase
          .from("votes")
          .select("choice")
          .eq("match_id", id)
          .eq("user_id", uid)
          .maybeSingle();
        if (my?.choice === "left" || my?.choice === "right") setMyChoice(my.choice);
      }
    })();
  }, [id]);

  async function refreshVotes(matchId: string) {
    const { data } = await supabase
      .from("votes")
      .select("choice, count:choice")
      .eq("match_id", matchId)
      .group("choice");

    const agg = (data ?? []) as unknown as VoteAgg[];
    const l = agg.find((a) => a.choice === "left")?.total ?? 0;
    const r = agg.find((a) => a.choice === "right")?.total ?? 0;
    setLeftVotes(l);
    setRightVotes(r);
  }

  // ---------- Votar
  async function handleVote(side: "left" | "right") {
    const uid = await requireAuth();
    if (!uid) {
      router.push("/auth/login");
      return;
    }

    // Intento de upsert: 1 voto por usuario por match (debes tener unique(match_id,user_id))
    const { error } = await supabase.from("votes").upsert(
      [{ match_id: id, user_id: uid, choice: side }],
      { onConflict: "match_id,user_id" }
    );
    if (!error) {
      setMyChoice(side);
      refreshVotes(String(id));
    }
  }

  // ---------- Cuenta regresiva
  useEffect(() => {
    if (!match?.ends_at) return;
    const int = setInterval(() => {
      const ms = new Date(match.ends_at!).getTime() - Date.now();
      if (ms <= 0) {
        setEndsIn("Finalizado");
        clearInterval(int);
        return;
      }
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setEndsIn(`${m}:${String(s).padStart(2, "0")} min`);
    }, 1000);
    return () => clearInterval(int);
  }, [match?.ends_at]);

  const total = leftVotes + rightVotes;
  const lp = pct(leftVotes, total);
  const rp = pct(rightVotes, total);

  // ---------- UI
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0B",
        color: "#fff",
        paddingBottom: 24,
      }}
    >
      {/* Header simple */}
      <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => router.back()} aria-label="Volver" style={{ opacity: 0.85 }}>
          ◀︎
        </button>
        <div style={{ fontWeight: 800 }}>VERSUS</div>
        <div style={{ opacity: 0.6, fontSize: 12 }}>{endsIn}</div>
      </div>

      {/* Doble panel (stack en móvil, side-by-side en ancho grande) */}
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "1fr",
          padding: "0 14px",
        }}
      >
        {/* LEFT */}
        <Panel
          title={left?.name ?? "Jugador A"}
          media={left?.media_url || left?.avatar_url}
          votes={leftVotes}
          pct={lp}
          isMine={myChoice === "left"}
          onVote={() => handleVote("left")}
        />

        {/* RIGHT */}
        <Panel
          title={right?.name ?? "Jugador B"}
          media={right?.media_url || right?.avatar_url}
          votes={rightVotes}
          pct={rp}
          isMine={myChoice === "right"}
          onVote={() => handleVote("right")}
        />
      </div>

      {/* Totales */}
      <div style={{ textAlign: "center", marginTop: 10, opacity: 0.85 }}>
        Total votos: <b>{total}</b>
      </div>
    </div>
  );
}

// ================== Subcomponente Panel ==================
function Panel(props: {
  title: string;
  media: string | null | undefined;
  votes: number;
  pct: number;
  isMine: boolean;
  onVote: () => void;
}) {
  const isVideo = useMemo(() => (props.media || "").endsWith(".mp4"), [props.media]);

  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "linear-gradient(180deg, rgba(255,255,255,.06), transparent)",
        padding: 10,
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 8 }}>{props.title}</div>

      <div
        style={{
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          aspectRatio: "9/16",
          background: "#111",
        }}
      >
        {props.media ? (
          isVideo ? (
            <video
              src={props.media}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              playsInline
              muted
              loop
              autoPlay
            />
          ) : (
            <Image
              src={props.media}
              alt={props.title}
              fill
              sizes="(max-width:768px) 100vw, 400px"
              style={{ objectFit: "cover" }}
            />
          )
        ) : (
          <div style={{ width: "100%", height: "100%" }} />
        )}
      </div>

      {/* Barra de progreso */}
      <div style={{ marginTop: 10 }}>
        <div
          style={{
            height: 10,
            borderRadius: 999,
            background: "rgba(255,255,255,.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${props.pct}%`,
              height: "100%",
              background: "linear-gradient(90deg, #32E6FF, #22D3EE)",
              boxShadow: "0 0 14px rgba(50,230,255,.6)",
            }}
          />
        </div>
        <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700 }}>{props.votes} votos</div>
          <div style={{ opacity: 0.85 }}>{props.pct}%</div>
        </div>
      </div>

      {/* Botón Votar */}
      <button
        onClick={props.onVote}
        style={{
          marginTop: 10,
          width: "100%",
          padding: "12px 14px",
          borderRadius: 999,
          fontWeight: 800,
          background: props.isMine ? "#22c55e" : "#0ea5e9",
          color: "#000",
          boxShadow: "0 0 14px rgba(14,165,233,.5)",
        }}
      >
        {props.isMine ? "Tu voto" : "Votar"}
      </button>
    </div>
  );
}