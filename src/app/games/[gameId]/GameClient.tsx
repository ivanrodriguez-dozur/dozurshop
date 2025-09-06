"use client";
import { useEffect, useState } from "react";
import type { Game } from "../types";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

const EnigmaGame = dynamic(() => import("../codigo-enigma/EnigmaGame"), { ssr: false });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GameClient({ gameId }: { gameId: string }) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameId) return;
    setLoading(true);
    supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single()
      .then(({ data }) => {
        setGame(data);
        setLoading(false);
      });
  }, [gameId]);

  if (loading) return <div className="text-center py-10 text-lg text-gray-400">Cargando juego...</div>;
  if (!game) return notFound();

  // Renderizar el componente correspondiente según el slug
  if (game.slug === "codigo-enigma") {
    return <EnigmaGame />;
  }

  // Si hay más juegos, agregar aquí más condiciones
  return <div className="text-center py-10 text-lg text-gray-400">Juego no implementado aún.</div>;
}
