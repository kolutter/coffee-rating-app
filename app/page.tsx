"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Coffee, SortOption, WishlistItem } from "@/lib/types";
import Header from "@/components/Header";
import CoffeeCard from "@/components/CoffeeCard";
import CoffeeForm from "@/components/CoffeeForm";
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import WishlistCard from "@/components/WishlistCard";
import WishlistForm from "@/components/WishlistForm";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "rating_desc", label: "Beste Bewertung" },
  { value: "rating_asc", label: "Niedrigste Bewertung" },
  { value: "newest", label: "Neueste zuerst" },
  { value: "oldest", label: "Älteste zuerst" },
  { value: "price_desc", label: "Preis: hoch → niedrig" },
  { value: "price_asc", label: "Preis: niedrig → hoch" },
];

const TABS = [
  { id: "reviews", label: "☕ Bewertungen" },
  { id: "wishlist", label: "📋 Wunschliste" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Home() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showWishlistForm, setShowWishlistForm] = useState(false);
  const [editingCoffee, setEditingCoffee] = useState<Coffee | null>(null);
  const [prefillCoffeeName, setPrefillCoffeeName] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("rating_desc");
  const [activeTab, setActiveTab] = useState<TabId>("reviews");

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

  const fetchWishlist = useCallback(async () => {
    setWishlistLoading(true);
    const { data, error } = await supabase
      .from("wishlist")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden der Wunschliste:", error);
    } else {
      setWishlist(data || []);
    }
    setWishlistLoading(false);
  }, []);

  useEffect(() => {
    fetchCoffees();
    fetchWishlist();
  }, [fetchCoffees, fetchWishlist]);

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
    setPrefillCoffeeName("");
    await fetchCoffees();
  };

  const handleWishlistSave = async () => {
    setShowWishlistForm(false);
    await fetchWishlist();
  };

  const handleEdit = (coffee: Coffee) => {
    setEditingCoffee(coffee);
    setPrefillCoffeeName("");
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

  const handleDeleteWishlist = async (id: string) => {
    const { error } = await supabase.from("wishlist").delete().eq("id", id);
    if (!error) {
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } else {
      console.error("Fehler beim Löschen aus der Wunschliste:", error);
    }
  };

  const handleTryWishlist = async (item: WishlistItem) => {
    const { error } = await supabase.from("wishlist").delete().eq("id", item.id);
    if (!error) {
      setWishlist((prev) => prev.filter((entry) => entry.id !== item.id));
      setEditingCoffee(null);
      setPrefillCoffeeName(item.name);
      setShowForm(true);
    } else {
      console.error("Fehler beim Verschieben nach Bewertungen:", error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCoffee(null);
    setPrefillCoffeeName("");
  };

  const handleCloseWishlistForm = () => {
    setShowWishlistForm(false);
  };

  return (
    <main className="min-h-screen">
      <Header
        coffeeCount={coffees.length}
        onAddClick={() => {
          setEditingCoffee(null);
          setPrefillCoffeeName("");
          setShowForm(true);
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col sm:flex-row gap-3 mb-4 mt-8">
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
              placeholder={
                activeTab === "reviews"
                  ? "Kaffee suchen..."
                  : "Wunschliste durchsuchen..."
              }
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

          {activeTab === "reviews" && (
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
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-coffee-700 text-white"
                  : "bg-white text-coffee-600 border border-coffee-200"
              }`}
            >
              {tab.label}
            </button>
          ))}

          {activeTab === "wishlist" && (
            <button
              onClick={() => setShowWishlistForm(true)}
              className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-coffee-700 text-white text-sm font-semibold rounded-xl hover:bg-coffee-800 transition-all"
            >
              + Kaffee merken
            </button>
          )}
        </div>
        {activeTab === "reviews" ? (
          loading ? (
            <LoadingSpinner />
          ) : filteredAndSorted.length === 0 ? (
            <EmptyState
              hasSearch={!!search.trim()}
              onAddClick={() => {
                setEditingCoffee(null);
                setPrefillCoffeeName("");
                setShowForm(true);
              }}
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
          )
        ) : wishlistLoading ? (
          <LoadingSpinner />
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">📋</span>
            <h3 className="text-xl font-serif font-bold text-coffee-700 mb-2">
              Noch keine Wunschliste
            </h3>
            <p className="text-sm text-coffee-400 mb-6 max-w-sm mx-auto">
              Merke dir Kaffee, den du später probieren und bewerten möchtest.
            </p>
            <button
              onClick={() => setShowWishlistForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-coffee-700 text-white text-sm font-semibold rounded-xl hover:bg-coffee-800 transition-colors shadow-sm"
            >
              + Kaffee merken
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlist.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onTried={handleTryWishlist}
                onDelete={handleDeleteWishlist}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showForm} onClose={handleCloseForm}>
        <CoffeeForm
          coffee={editingCoffee}
          initialName={prefillCoffeeName}
          onSave={handleSave}
          onCancel={handleCloseForm}
        />
      </Modal>

      <Modal isOpen={showWishlistForm} onClose={handleCloseWishlistForm}>
        <WishlistForm onSave={handleWishlistSave} onCancel={handleCloseWishlistForm} />
      </Modal>
    </main>
  );
}