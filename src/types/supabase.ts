
export type BookStatus = 'want-to-read' | 'currently-reading' | 'completed';

export interface DbBook {
  id: string;
  user_id: string;
  title: string;
  author: string;
  cover_image: string;
  description: string;
  genre: string;
  page_count: number;
  current_page: number | null;
  progress_percentage: number | null;
  started_reading: string | null;
  finished_reading: string | null;
  rating: number | null;
  status: BookStatus;
  is_favorite: boolean;
  date_added: string;
  last_updated: string;
}

export interface DbReview {
  id: string;
  user_id: string;
  book_id: string;
  title: string;
  content: string;
  rating: number;
  date_started: string | null;
  date_finished: string | null;
  is_public: boolean;
  is_favorite: boolean;
  created_at: string;
}

export interface DbReadingStats {
  id: string;
  user_id: string;
  books_read: number;
  total_pages: number;
  reading_time: number;
  current_streak: number;
  average_rating: number;
  last_updated: string;
}

export interface DbReadingChallenge {
  id: string;
  user_id: string;
  name: string;
  target: number;
  current: number;
  percentage: number;
  created_at: string;
  updated_at: string;
}
