interface EmptyStateProps {
  hasSearch: boolean;
  onAddClick: () => void;
}

export default function EmptyState({ hasSearch, onAddClick }: EmptyStateProps) {
  if (hasSearch) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl mb-4 block">🔍</span>
        <h3 className="text-lg font-serif font-bold text-coffee-700 mb-2">
          Keine Ergebnisse
        </h3>
        <p className="text-sm text-coffee-400">
          Versuche einen anderen Suchbegriff.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-20">
      <span className="text-6xl mb-4 block">☕</span>
      <h3 className="text-xl font-serif font-bold text-coffee-700 mb-2">
        Noch keine Kaffees bewertet
      </h3>
      <p className="text-sm text-coffee-400 mb-6 max-w-sm mx-auto">
        Füge deinen ersten Kaffee hinzu und starte dein persönliches
        Kaffee-Tagebuch!
      </p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-coffee-700 text-white text-sm font-semibold rounded-xl hover:bg-coffee-800 transition-colors shadow-sm"
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
        Ersten Kaffee hinzufügen
      </button>
    </div>
  );
}