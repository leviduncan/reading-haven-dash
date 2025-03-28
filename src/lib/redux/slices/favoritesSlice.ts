
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "@/lib/types";
import { mockBooks } from "@/lib/mock-data";

interface FavoritesState {
  favorites: Book[];
  recentlyAdded: Book[];
  stats: {
    totalFavorites: number;
    topGenre: { name: string; count: number };
    favoriteAuthor: { name: string; count: number };
    averageRating: number;
  };
}

// Initialize state with mock data
const initialFavoriteBooks = mockBooks.filter(book => book.isFavorite);
const initialRecentlyAdded = [...initialFavoriteBooks]
  .sort((a, b) => {
    const dateA = new Date(a.dateAdded).getTime();
    const dateB = new Date(b.dateAdded).getTime();
    return dateB - dateA;
  })
  .slice(0, 3);

// Calculate initial stats
const calculateStats = (books: Book[]) => {
  const totalRating = books.reduce((sum, book) => sum + (book.rating || 0), 0);
  const avgRating = books.length > 0 ? totalRating / books.length : 0;

  // Count genres
  const genreCounts: Record<string, number> = {};
  books.forEach(book => {
    const mainGenre = book.genre.split(',')[0].trim();
    genreCounts[mainGenre] = (genreCounts[mainGenre] || 0) + 1;
  });

  // Find top genre
  let topGenre = { name: "", count: 0 };
  Object.entries(genreCounts).forEach(([name, count]) => {
    if (count > topGenre.count) {
      topGenre = { name, count };
    }
  });

  // Count authors
  const authorCounts: Record<string, number> = {};
  books.forEach(book => {
    authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
  });

  // Find favorite author
  let favoriteAuthor = { name: "", count: 0 };
  Object.entries(authorCounts).forEach(([name, count]) => {
    if (count > favoriteAuthor.count) {
      favoriteAuthor = { name, count };
    }
  });

  return {
    totalFavorites: books.length,
    topGenre,
    favoriteAuthor,
    averageRating: avgRating
  };
};

const initialState: FavoritesState = {
  favorites: initialFavoriteBooks,
  recentlyAdded: initialRecentlyAdded,
  stats: calculateStats(initialFavoriteBooks)
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const index = state.favorites.findIndex(book => book.id === bookId);
      
      if (index >= 0) {
        // Remove from favorites
        state.favorites[index].isFavorite = false;
        state.favorites = state.favorites.filter(book => book.id !== bookId);
      } else {
        // Add to favorites
        const bookToAdd = mockBooks.find(book => book.id === bookId);
        if (bookToAdd) {
          bookToAdd.isFavorite = true;
          state.favorites.push(bookToAdd);
          
          // Update recently added
          state.recentlyAdded = [bookToAdd, ...state.recentlyAdded.slice(0, 2)];
        }
      }
      
      // Recalculate stats
      state.stats = calculateStats(state.favorites);
    },
    filterFavorites: (state, action: PayloadAction<{ query: string; tab: string }>) => {
      const { query, tab } = action.payload;
      
      // This action doesn't modify state directly as filtering can be 
      // computed in the component based on the query and tab
    }
  }
});

export const { toggleFavorite, filterFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
