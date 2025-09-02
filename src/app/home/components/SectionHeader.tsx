export default function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-lg font-bold">{title}</h2>
      {onSeeAll && (
        <button className="text-blue-500 text-sm" onClick={onSeeAll}>
          Ver todo
        </button>
      )}
    </div>
  );
}
