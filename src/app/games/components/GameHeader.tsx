// Header con avatar, nombre y coins
export default function GameHeader() {
  // Dummy data, reemplazar por datos reales de usuario
  const user = { name: 'Usuario', avatar: '/avatar.jpg', coins: 1200 };
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto">
      <div className="flex items-center gap-3">
        <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-neon" />
        <span className="text-white font-semibold text-lg">{user.name}</span>
      </div>
      <div className="flex items-center gap-2 bg-[#232323] px-3 py-1 rounded-full">
        <span className="inline-block w-6 h-6">
          <img src="/coin.svg" alt="coins" className="w-6 h-6" />
        </span>
        <span className="text-neon font-bold text-lg">{user.coins}</span>
      </div>
    </div>
  );
}
