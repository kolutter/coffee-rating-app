"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Coffee, SortOption } from "@/lib/types";
import Header from "@/components/Header";
import CoffeeCard from "@/components/CoffeeCard";
import CoffeeForm from "@/components/CoffeeForm";
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "rating_desc", label: "Beste Bewertung" },
  { value: "rating_asc", label: "Niedrigste Bewertung" },
  { value: "newest", label: "Neueste zuerst" },
  { value: "oldest", label: "Älteste zuerst" },
  { value: "price_desc", label: "Preis: hoch → niedrig" },
  { value: "price_asc", label: "Preis: niedrig → hoch" },
];

export default function Home() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoffee, setEditingCoffee] = useState<Coffee | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("rating_desc");

  const fetchCoffees = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("coffees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden:", error);
    } else {
      setCoffees(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCoffees();
  }, [fetchCoffees]);

  const filteredAndSorted = useMemo(() => {
    let result = [...coffees];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.brew_method?.toLowerCase().includes(q) ||
          c.grind_size?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      switch (sort) {
        case "rating_desc":
          return b.rating - a.rating;
        case "rating_asc":
          return a.rating - b.rating;
        case "newest":
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );
        case "price_asc":
          return (a.price ?? 999) - (b.price ?? 999);
        case "price_desc":
          return (b.price ?? 0) - (a.price ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [coffees, search, sort]);

  const handleSave = async () => {
    setShowForm(false);
    setEditingCoffee(null);
    await fetchCoffees();
  };

  const handleEdit = (coffee: Coffee) => {
    setEditingCoffee(coffee);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("coffees").delete().eq("id", id);
    if (!error) {
      setCoffees((prev) => prev.filter((c) => c.id !== id));
    } else {
      console.error("Fehler beim Löschen:", error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCoffee(null);
  };

  return (
    <main className="min-h-screen">
      <Header
        coffeeCount={coffees.length}
        onAddClick={() => setShowForm(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {coffees.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-8 mt-8">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Kaffee suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-coffee-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 focus:border-transparent placeholder:text-coffee-300"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-600"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-4 py-2.5 bg-white border border-coffee-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 focus:border-transparent text-coffee-700 cursor-pointer min-w-[200px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : filteredAndSorted.length === 0 ? (
          <EmptyState
            hasSearch={!!search.trim()}
            onAddClick={() => setShowForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAndSorted.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!loading && search.trim() && filteredAndSorted.length > 0 && (
          <p className="text-center text-sm text-coffee-400 mt-6">
            {filteredAndSorted.length}{" "}
            {filteredAndSorted.length === 1 ? "Ergebnis" : "Ergebnisse"} für
            &quot;{search}&quot;
          </p>
        )}
      </div>

      <Modal isOpen={showForm} onClose={handleCloseForm}>
        <CoffeeForm
          coffee={editingCoffee}
          onSave={handleSave}
          onCancel={handleCloseForm}
        />
      </Modal>
    </main>
  );
}