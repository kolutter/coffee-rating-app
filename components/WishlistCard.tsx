import { WishlistItem } from "@/lib/types";

interface WishlistCardProps {
  item: WishlistItem;
  onTried: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
}

export default function WishlistCard({ item, onTried, onDelete }: WishlistCardProps) {
  const handleDelete = () => {
    if (window.confirm(`„${item.name}" wirklich aus der Wunschliste entfernen?`)) {
      onDelete(item.id);
    }
  };

  const formattedDate = new Date(item.created_at).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-coffee-100 p-5 sm:p-6 card-hover group flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-lg font-serif font-bold text-coffee-900 leading-snug truncate">
            {item.name}
          </h3>
          <p className="text-xs text-coffee-500 mt-1">{formattedDate}</p>
        </div>
      </div>

      {item.notes ? (
        <p className="text-sm text-coffee-600 mb-4 italic leading-relaxed">
          {item.notes}
        </p>
      ) : (
        <p className="text-sm text-coffee-400 mb-4">Keine zusätzliche Notiz.</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-coffee-50">
        <button
          onClick={() => onTried(item)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-coffee-700 text-white text-sm font-semibold rounded-xl hover:bg-coffee-800 transition-all"
        >
          ☕ Probiert!
        </button>
        <button
          onClick={handleDelete}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-coffee-200 text-coffee-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors"
        >
          🗑️ Löschen
        </button>
      </div>
    </div>
  );
}
