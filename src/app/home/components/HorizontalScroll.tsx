export default function HorizontalScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {children}
    </div>
  );
}
