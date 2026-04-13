"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface WishlistFormProps {
  onSave: () => void;
  onCancel: () => void;
}

export default function WishlistForm({ onSave, onCancel }: WishlistFormProps) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
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

    const { error: dbError } = await supabase.from("wishlist").insert({
      name: name.trim(),
      notes: notes.trim() || null,
    });

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
        <span className="text-2xl">📋</span>
        <h2 className="text-xl font-serif font-bold text-coffee-900">
          Kaffee auf die Wunschliste setzen
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
          placeholder="z.B. Kenya AA"
          className={inputClasses}
          autoFocus
          required
        />
      </div>

      <div>
        <label className={labelClasses}>Notizen</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="z.B. hat Lisa empfohlen"
          rows={4}
          className={inputClasses + " resize-none"}
        />
      </div>

      <div className="flex gap-3 pt-3 border-t border-coffee-100">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-6 py-3 bg-coffee-700 text-white text-sm font-semibold rounded-xl hover:bg-coffee-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {submitting ? "Speichern..." : "Zur Wunschliste hinzufügen"}
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
