
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import FavoriteStatsCard from "./FavoriteStatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Book } from "@/lib/types";

const CollectionOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFavorites: 0,
    topGenre: { name: "", count: 0 },
    favoriteAuthor: { name: "", count: 0 },
    averageRating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchFavoriteStats();
    }
  }, [user]);
  
  const fetchFavoriteStats = async () => {
    setIsLoading(true);
    try {
      const { data: favoriteBooks, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_favorite', true);

      if (error) throw error;
      
      // Calculate stats
      const totalFavorites = favoriteBooks.length;
      
      // Calculate average rating
      const totalRating = favoriteBooks.reduce((sum, book) => sum + (book.rating || 0), 0);
      const averageRating = favoriteBooks.length > 0 ? totalRating / favoriteBooks.length : 0;
      
      // Find top genre
      const genreCounts: Record<string, number> = {};
      favoriteBooks.forEach(book => {
        const genres = book.genre.split(',').map(g => g.trim());
        genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      });
      
      let topGenre = { name: "", count: 0 };
      Object.entries(genreCounts).forEach(([name, count]) => {
        if (count > topGenre.count) {
          topGenre = { name, count };
        }
      });
      
      // Find favorite author
      const authorCounts: Record<string, number> = {};
      favoriteBooks.forEach(book => {
        authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
      });
      
      let favoriteAuthor = { name: "", count: 0 };
      Object.entries(authorCounts).forEach(([name, count]) => {
        if (count > favoriteAuthor.count) {
          favoriteAuthor = { name, count };
        }
      });
      
      setStats({
        totalFavorites,
        topGenre,
        favoriteAuthor,
        averageRating
      });
    } catch (error) {
      console.error("Error fetching favorite stats:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <section className="mb-10">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </section>
    );
  }
  
  return (
    <section className="mb-10 animate-fade-in">
      <h2 className="section-heading mb-6">Collection Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <FavoriteStatsCard
          icon="heart"
          value={stats.totalFavorites}
          label="Total Favorites"
          sublabel="Books you love"
        />
        
        <FavoriteStatsCard
          icon="book"
          value={stats.topGenre.name || "None"}
          label="Top Genre"
          sublabel={stats.topGenre.count > 0 ? `${stats.topGenre.count} books` : ""}
        />
        
        <FavoriteStatsCard
          icon="user"
          value={stats.favoriteAuthor.name || "None"}
          label="Favorite Author"
          sublabel={stats.favoriteAuthor.count > 0 ? `${stats.favoriteAuthor.count} books` : ""}
        />
        
        <FavoriteStatsCard
          icon="library"
          value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "No ratings"}
          label="Average Rating"
          sublabel="Of your favorites"
        />
      </div>
    </section>
  );
};

export default CollectionOverview;
