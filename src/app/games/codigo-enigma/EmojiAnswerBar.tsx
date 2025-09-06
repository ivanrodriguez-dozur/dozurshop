import React from 'react';

export default function EmojiAnswerBar({ answer, onRemove, max }: { answer: string[]; onRemove: () => void; max: number }) {
  return (
    <div className="flex gap-2 mb-4">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={`w-12 h-12 flex items-center justify-center text-3xl bg-yellow-50 rounded-xl border-2 border-yellow-300 shadow-inner transition-all duration-200 animate__animated animate__fadeInDown`}> 
          {answer[i] ? (
            <span>{answer[i]}</span>
          ) : (
            <button onClick={onRemove} className="text-yellow-400 text-xl font-bold">{i === answer.length ? '⌫' : ''}</button>
          )}
        </div>
      ))}
    </div>
  );
}
