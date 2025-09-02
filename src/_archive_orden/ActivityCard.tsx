"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabaseClient";

// Formats a date string as 'dd/mm/yyyy'
function shortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth()+1).toString().padStart(2, "0")}/${date.getFullYear()}`;
}

type BoomCard = { id: string; title: string; poster_url?: string | null; created_at: string };
type Tab = "likes" | "saves" | "history";

export default function ActivityCard({ isOwner }: { isOwner: boolean }) {
  const [active, setActive] = useState<Tab>("likes");
  const [items, setItems] = useState<BoomCard[]>([]);
  const [hasViews, setHasViews] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userResp } = await supabase.auth.getUser();
      const uid = userResp.user?.id;
      if (!uid) return;

      if (active === "likes") {
        const { data } = await supabase
          .from("boom_likes")
          .select("boom:booms(id,title,poster_url,created_at)")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(30);
        setItems((data || []).map((r: any) => r.boom).filter(Boolean));
      } else if (active === "saves") {
        const { data } = await supabase
          .from("boom_saves")
          .select("boom:booms(id,title,poster_url,created_at)")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(30);
        setItems((data || []).map((r: any) => r.boom).filter(Boolean));
      } else if (active === "history") {
        const { data, error } = await supabase
          .from("boom_views")
          .select("boom:booms(id,title,poster_url,created_at)")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(30);
        if (error) { setHasViews(false); setItems([]); }
        else { setHasViews(true); setItems((data || []).map((r: any) => r.boom).filter(Boolean)); }
      }
    })();
  }, [active]);

  return (
    <div style={card}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>Actividad</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <TabButton active={active === "likes"} onClick={() => setActive("likes")}>🔥 Likes</TabButton>
        <TabButton active={active === "saves"} onClick={() => setActive("saves")}>❤️ Guardados</TabButton>
        {isOwner && hasViews && <TabButton active={active === "history"} onClick={() => setActive("history")}>⏱ Historial</TabButton>}
      </div>

      {items.length === 0 ? (
        <div style={empty}>Aquí verás tus booms {active === "likes" ? "con 🔥" : active === "saves" ? "guardados" : "vistos recientemente"}.</div>
      ) : (
        <div style={grid}>
          {items.map((b) => (
            <div key={b.id} style={cell}>
              <div style={{ position: "relative", width: "100%", paddingBottom: "140%" }}>
                {b.poster_url ? (
                  <img src={b.poster_url} alt={b.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "#111", color: "#555", fontSize: 12 }}>Boom</div>
                )}
              </div>
              <div style={{ padding: "6px 8px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.title || "Boom"}</div>
                <div style={{ fontSize: 10, opacity: 0.7 }}>{shortDate(b.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "#13ef95" : "transparent",
        color: active ? "#000" : "#fff",
        border: active ? "none" : "1px solid #222",
        borderRadius: 999,
        padding: "8px 12px",
        cursor: "pointer",
        fontWeight: 800,
      }}
    >
      {children}
    </button>
  );
}

const card: React.CSSProperties = { border: "1px solid #171717", borderRadius: 12, padding: 14, background: "linear-gradient(180deg,#0a0a0a,#070707)" };
const empty: React.CSSProperties = { opacity: .7, fontSize: 14, padding: 20, textAlign: "center", border: "1px dashed #222", borderRadius: 12 };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8 };
const cell: React.CSSProperties = { border: "1px solid #151515", borderRadius: 10, overflow: "hidden", background: "#0b0b0b" };