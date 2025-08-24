import React from "react";

interface CategoryTag {
  key: string;
  icon: React.ReactNode;
}

interface Props {
  categories: CategoryTag[];
  selected: string;
  onSelect: (key: string) => void;
}

const CategoryTagsCarousel: React.FC<Props> = ({ categories, selected, onSelect }) => (
  <div className="w-full overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
    <div className="flex flex-nowrap py-2 px-2" style={{ gap: 24 }}>
      {categories.map(({ key, icon }) => (
        <button
          key={key}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] p-0 ${selected === key ? 'rounded-full bg-blue-500 text-white border-4 border-blue-700 scale-105' : 'rounded-full bg-white text-blue-700 border-2 border-gray-200'} shadow hover:bg-blue-100 transition-transform duration-200 transform hover:scale-110 focus:outline-none`}
          onClick={() => onSelect(key)}
          title={key}
          style={{ flex: '0 0 auto' }}
        >
          <span className="text-2xl mb-1">{icon}</span>
          <span className="text-xs font-medium whitespace-nowrap">{key}</span>
        </button>
      ))}
    </div>
  </div>
);

export default CategoryTagsCarousel;
