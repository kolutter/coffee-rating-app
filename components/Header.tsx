interface HeaderProps {
  coffeeCount: number;
  onAddClick: () => void;
}

export default function Header({ coffeeCount, onAddClick }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-coffee-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">☕</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-coffee-900 leading-tight">
                PuBa's Kaffee-Rating
              </h1>
              <p className="text-xs text-coffee-400 hidden sm:block">
                {coffeeCount}{" "}
                {coffeeCount === 1 ? "Kaffee" : "Kaffees"} bewertet
              </p>
            </div>
          </div>

          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-coffee-700 text-white text-sm font-medium rounded-xl hover:bg-coffee-800 active:scale-[0.97] transition-all shadow-sm hover:shadow-md"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Kaffee hinzufügen</span>
            <span className="sm:hidden">Neu</span>
          </button>
        </div>
      </div>
    </header>
  );
}