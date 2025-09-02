// @ts-nocheck
// Página /vs/match/:id
// Enlaza directamente a un match por su UUID.
// Si quieres envolverlo en un modal, puedes montar <MatchVote/> dentro de tu propio modal.

import MatchVote from "@/components/vs/MatchVote";

export default function MatchPage({ params }: { params: { id: string } }) {
  return <MatchVote matchId={params.id} />;
}