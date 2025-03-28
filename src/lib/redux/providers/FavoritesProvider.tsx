
import { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { toggleFavorite } from "../slices/favoritesSlice";
import { mockBooks } from "@/lib/mock-data";

// This component is responsible for initializing the favorites state
// and syncing it with other parts of the application
const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  // Initialize favorites from mock data
  useEffect(() => {
    // This would typically load data from an API or localStorage
    // Here we're just using our mock data
    const favoriteBooks = mockBooks.filter(book => book.isFavorite);
    
    // Pre-populate the store with initial favorites
    favoriteBooks.forEach(book => {
      if (book.isFavorite) {
        dispatch(toggleFavorite(book.id));
      }
    });
  }, [dispatch]);

  return <>{children}</>;
};

export default FavoritesProvider;
