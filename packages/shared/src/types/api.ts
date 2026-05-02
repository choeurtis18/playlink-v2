export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface CreateGamePayload {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  colorMain: string;
  colorSecondary: string;
}

export interface UpdateGamePayload extends Partial<CreateGamePayload> {
  active?: boolean;
  order?: number;
}

export interface CreateCategoryPayload {
  gameId: string;
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryPayload extends Partial<Omit<CreateCategoryPayload, 'gameId'>> {}

export interface CreateCardPayload {
  categoryId: string;
  text: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface UpdateCardPayload extends Partial<CreateCardPayload> {
  active?: boolean;
  order?: number;
}

export interface BulkImportPayload {
  cards: CreateCardPayload[];
}
