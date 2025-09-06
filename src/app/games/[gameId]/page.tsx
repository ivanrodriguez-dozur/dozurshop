
import GameClient from './GameClient';

export default async function GameDetailPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  return <GameClient gameId={gameId} />;
}
