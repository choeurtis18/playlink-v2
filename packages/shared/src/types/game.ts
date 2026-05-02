export interface Card {
  id: string;
  categoryId: string;
  text: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  active: boolean;
  order: number;
}

export interface Category {
  id: string;
  gameId: string;
  name: string;
  slug: string;
  description?: string;
  cards: Card[];
  order: number;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  colorMain: string;
  colorSecondary: string;
  active: boolean;
  order: number;
  categories: Category[];
}

export interface GameState {
  games: Game[];
  currentGameId: string | null;
  currentCategoryId: string | null;
  currentCardIndex: number;
  settings: {
    darkMode: boolean;
  };
}
