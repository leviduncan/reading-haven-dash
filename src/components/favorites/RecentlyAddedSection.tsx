
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Book } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { mapDbBookToBook } from "@/services/bookService";
import { useAuth } from "@/contexts/AuthContext";
import RecentlyAddedCard from "./RecentlyAddedCard";
import { Skeleton } from "@/components/ui/skeleton";

const RecentlyAddedSection = () => {
  const { user } = useAuth();
  const [recentlyAdded, setRecentlyAdded] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchRecentlyAddedFavorites();
    }
  }, [user]);
  
  const fetchRecentlyAddedFavorites = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_favorite', true)
        .order('last_updated', { ascending: false })
        .limit(3);

      if (error) throw error;

      const mappedBooks = data.map(mapDbBookToBook);
      setRecentlyAdded(mappedBooks);
    } catch (error) {
      console.error("Error fetching recently added favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <section className="mb-10">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </section>
    );
  }
  
  return (
    <section className="mb-10 animate-fade-in">
      <h2 className="section-heading mb-6">Recently Added Favorites</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentlyAdded.length > 0 ? (
          recentlyAdded.map(book => (
            <RecentlyAddedCard key={book.id} book={book} />
          ))
        ) : (
          <div className="col-span-3 text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground mb-4">No recently added favorites yet.</p>
            <Link
              to="/discover"
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Discover Books
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyAddedSection;
