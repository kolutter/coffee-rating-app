"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Coffee } from "@/lib/types";
import RatingStars from "./RatingStars";

interface CoffeeFormProps {
  coffee?: Coffee | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function CoffeeForm({
  coffee,
  onSave,
  onCancel,
}: CoffeeFormProps) {
  const isEditing = !!coffee;

  const [name, setName] = useState(coffee?.name || "");
  const [price, setPrice] = useState(coffee?.price?.toString() || "");
  const [rating, setRating] = useState(coffee?.rating || 3.0);
  const [description, setDescription] = useState(coffee?.description || "");
  const [grindSize, setGrindSize] = useState(coffee?.grind_size || "");
  const [grindAmount, setGrindAmount] = useState(coffee?.grind_amount || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Bitte gib einen Namen ein.");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      price: price ? parseFloat(price) : null,
      rating: Math.round(rating * 10) / 10,
      description: description.trim() || null,
      grind_size: grindSize.trim() || null,
      grind_amount: grindAmount.trim() || null,
      brew_method: null,
    };

    const { error: dbError } = isEditing
      ? await supabase.from("coffees").update(payload).eq("id", coffee!.id)
      : await supabase.from("coffees").insert(payload);

    if (dbError) {
      console.error("DB Error:", dbError);
      setError("Fehler beim Speichern. Bitte versuche es erneut.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onSave();
  };

  const inputClasses =
    "w-full px-4 py-2.5 bg-white border border-coffee-200 rounded-xl text-sm text-coffee-900 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400 focus:border-transparent transition-shadow";

  const labelClasses = "block text-sm font-medium text-coffee-800 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-3 pb-2 border-b border-coffee-100">
        <span className="text-2xl">{isEditing ? "✏️" : "☕"}</span>
        <h2 className="text-xl font-serif font-bold text-coffee-900">
          {isEditing ? "Kaffee bearbeiten" : "Neuen Kaffee hinzufügen"}
        </h2>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <div>
        <label className={labelClasses}>
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z.B. Ethiopia Yirgacheffe"
          className={inputClasses}
          autoFocus
          required
        />
      </div>

      <div>
        <label className={labelClasses}>
          Bewertung <span className="text-red-400">*</span>
        </label>
        <div className="space-y-3 p-4 bg-coffee-50/50 rounded-xl border border-coffee-100">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <svg
                    className={`w-8 h-8 transition-colors duration-150 ${
                      rating >= star ? "text-amber-400" : "text-coffee-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-coffee-800">
                {rating.toFixed(1)}
              </span>
              <span className="text-xs text-coffee-400">/ 5.0</span>
            </div>
          </div>

          <div>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-coffee-300 mt-1 px-0.5">
              <span>1.0</span>
              <span>2.0</span>
              <span>3.0</span>
              <span>4.0</span>
              <span>5.0</span>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <RatingStars rating={rating} size="sm" />
            <span className="text-xs text-coffee-400">Vorschau</span>
          </div>
        </div>
      </div>

      <div>
        <label className={labelClasses}>Preis (€)</label>
        <div className="relative">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="z.B. 14.90"
            step="0.01"
            min="0"
            className={inputClasses + " pr-10"}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-coffee-400">
            €
          </span>
        </div>
      </div>

      <div>
        <label className={labelClasses}>Beschreibung / Geschmack</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="z.B. Fruchtig mit Noten von Blaubeere und Zitrus..."
          rows={3}
          className={inputClasses + " resize-none"}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Mahlgrad</label>
          <input
            type="text"
            value={grindSize}
            onChange={(e) => setGrindSize(e.target.value)}
            placeholder="z.B. 14 oder fein"
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Mahlmenge</label>
          <input
            type="text"
            value={grindAmount}
            onChange={(e) => setGrindAmount(e.target.value)}
            placeholder="z.B. 18g oder doppelt"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-3 border-t border-coffee-100">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-6 py-3 bg-coffee-700 text-white text-sm font-semibold rounded-xl hover:bg-coffee-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {submitting
            ? "Speichern..."
            : isEditing
            ? "Änderungen speichern"
            : "☕ Kaffee speichern"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 border border-coffee-200 text-coffee-600 text-sm font-medium rounded-xl hover:bg-coffee-50 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}