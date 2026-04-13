export interface Coffee {
  id: string;
  name: string;
  price: number | null;
  rating: number;
  description: string | null;
  grind_size: string | null;
  grind_amount: string | null;
  brew_method: string | null;
  created_at: string;
}

export type CoffeeInsert = Omit<Coffee, "id" | "created_at">;

export type SortOption =
  | "rating_desc"
  | "rating_asc"
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc";