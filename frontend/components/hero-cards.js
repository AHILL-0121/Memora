export default function HeroCards() {
  const items = [
    { emoji: '🌸', title: 'Our First Dance', date: 'MARCH 2024' },
    { emoji: '🎂', title: 'Sweet 16', date: 'JULY 2023' },
    { emoji: '🌅', title: 'Golden Hour', date: 'DEC 2023' }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="card p-0 overflow-hidden">
          <div className="flex h-36 items-center justify-center bg-[#f4e9dc] text-4xl">{item.emoji}</div>
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#8c7355]">{item.date}</p>
            <p className="mt-1 text-sm font-semibold">{item.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
