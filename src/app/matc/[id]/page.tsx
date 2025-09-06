// @ts-nocheck
// Página /vs/match/:id
// Enlaza directamente a un match por su UUID.
// Si quieres envolverlo en un modal, puedes montar <MatchVote/> dentro de tu propio modal.

import MatchVote from "@/components/vs/MatchVote";

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchVote matchId={id} />;
}