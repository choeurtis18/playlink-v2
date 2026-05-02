export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminGame {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  colorMain: string;
  colorSecondary: string;
  active: boolean;
  order: number;
  _count: { categories: number };
}

export interface AdminCategory {
  id: string;
  gameId: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  _count: { cards: number };
}

export interface AdminCard {
  id: string;
  categoryId: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  tags: string[];
  active: boolean;
  order: number;
  category: {
    name: string;
    game: { id: string; name: string };
  };
}
