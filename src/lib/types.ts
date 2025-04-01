
export interface Book {
  id: string;
  user_id?: string; // Added user_id as optional
  title: string;
  author: string;
  coverImage: string;
  description: string;
  genre: string;
  pageCount: number;
  progress?: {
    currentPage: number;
    percentage: number;
  };
  startedReading?: string;
  finishedReading?: string;
  rating?: number;
  status: 'want-to-read' | 'currently-reading' | 'completed';
  isFavorite: boolean;
  dateAdded: string;
  lastUpdated?: string;
}

export interface Review {
  id: string;
  bookId: string;
  user_id?: string; // Added user_id as optional
  title: string;
  content: string;
  rating: number;
  dateStarted?: string;
  dateFinished?: string;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: string;
}

export interface ReadingStats {
  booksRead: number;
  totalPages: number;
  readingTime: number;
  currentStreak: number;
  averageRating: number;
}

export interface ReadingChallenge {
  id: string;
  name: string;
  target: number;
  current: number;
  percentage: number;
}
