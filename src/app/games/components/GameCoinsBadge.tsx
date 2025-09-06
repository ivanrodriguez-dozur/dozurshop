// Badge visual para coins por juego
export default function GameCoinsBadge({ coins }: { coins: number }) {
  return (
    <div className="flex items-center gap-2 bg-[#181818] px-4 py-2 rounded-full mt-2">
      <img src="/coin.svg" alt="coins" className="w-5 h-5" />
      <span className="text-neon font-bold text-lg">+{coins} coins</span>
    </div>
  );
}
