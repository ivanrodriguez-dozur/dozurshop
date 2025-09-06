
import React from 'react';

export default function EmojiPicker({ emojis, onSelect, selected }: { emojis: string[]; onSelect: (e: string) => void; selected: string[] }) {
  const handleClick = (emoji: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (emoji && emoji.trim() !== '') {
      onSelect(emoji);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-3 my-6">
      {emojis.map((emoji, idx) => (
        <button
          key={`${emoji}-${idx}`}
          className={`text-4xl bg-yellow-100 rounded-full shadow-lg p-2 flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95 ${selected.includes(emoji) ? 'ring-4 ring-yellow-400' : ''}`}
          style={{ minWidth: 56, minHeight: 56 }}
          onClick={(e) => handleClick(emoji, e)}
          type="button"
        >
          <span className="select-none">{emoji}</span>
        </button>
      ))}
    </div>
  );
}
