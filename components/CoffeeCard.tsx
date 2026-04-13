import { Coffee } from "@/lib/types";
import RatingStars from "./RatingStars";

interface CoffeeCardProps {
  coffee: Coffee;
  onEdit: (coffee: Coffee) => void;
  onDelete: (id: string) => void;
}

export default function CoffeeCard({
  coffee,
  onEdit,
  onDelete,
}: CoffeeCardProps) {
  const handleDelete = () => {
    if (window.confirm(`„${coffee.name}" wirklich löschen?`)) {
      onDelete(coffee.id);
    }
  };

  const formattedDate = new Date(coffee.created_at).toLocaleDateString(
    "de-DE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  return (
    <div className="bg-white rounded-2xl border border-coffee-100 p-5 sm:p-6 card-hover group flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-serif font-bold text-coffee-900 leading-snug truncate">
            {coffee.name}
          </h3>
          {coffee.price != null && (
            <p className="text-sm font-semibold text-coffee-500 mt-0.5">
              {coffee.price.toFixed(2)} €
            </p>
          )}
        </div>
        <div className="flex flex-col items-end shrink-0">
          <RatingStars rating={coffee.rating} size="sm" />
          <span className="text-xs font-bold text-coffee-700 mt-0.5">
            {coffee.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {coffee.description && (
        <p className="text-sm text-coffee-600 mb-3 italic leading-relaxed">
          &bdquo;{coffee.description}&ldquo;
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
        {coffee.grind_size && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-coffee-50 text-coffee-700 text-xs font-medium rounded-lg border border-coffee-100">
            ⚙️ {coffee.grind_size}
          </span>
        )}
        {coffee.grind_amount && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-coffee-50 text-coffee-700 text-xs font-medium rounded-lg border border-coffee-100">
            ⚖️ {coffee.grind_amount}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-coffee-50">
        <span className="text-xs text-coffee-300">{formattedDate}</span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(coffee)}
            className="text-xs px-2.5 py-1.5 text-coffee-500 hover:text-coffee-800 hover:bg-coffee-50 rounded-lg transition-colors"
            title="Bearbeiten"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="text-xs px-2.5 py-1.5 text-coffee-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Löschen"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}