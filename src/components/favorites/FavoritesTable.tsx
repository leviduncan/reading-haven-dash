
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Book } from "@/lib/types";
import { Heart, Search } from "lucide-react";
import StarRating from "@/components/StarRating";
import { supabase } from "@/integrations/supabase/client";
import { mapDbBookToBook } from "@/services/bookService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const FavoritesTable = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchFavoriteBooks();
    }
  }, [user]);
  
  useEffect(() => {
    // Filter books when favorites, activeTab or searchQuery changes
    filterBooks(searchQuery, activeTab);
  }, [favorites, searchQuery, activeTab]);
  
  const fetchFavoriteBooks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_favorite', true)
        .order('last_updated', { ascending: false });

      if (error) {
        throw error;
      }

      const mappedBooks = data.map(mapDbBookToBook);
      setFavorites(mappedBooks);
    } catch (error: any) {
      console.error("Error fetching favorite books:", error.message);
      toast({
        title: "Error fetching favorites",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleFavoriteToggle = async (bookId: string) => {
    try {
      // Find the book and toggle its favorite status
      const bookToUpdate = favorites.find(book => book.id === bookId);
      if (!bookToUpdate) return;
      
      // Update the book's favorite status in Supabase
      const { error } = await supabase
        .from('books')
        .update({ 
          is_favorite: false,
          last_updated: new Date().toISOString()
        })
        .eq('id', bookId)
        .eq('user_id', user?.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setFavorites(prev => prev.filter(book => book.id !== bookId));
      
      toast({
        title: "Removed from favorites",
        description: "Book has been removed from your favorites.",
      });
    } catch (error: any) {
      console.error("Error toggling favorite status:", error.message);
      toast({
        title: "Error updating favorites",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const filterBooks = (query: string, tab: string) => {
    let filtered = [...favorites];
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.genre.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (tab === 'currently-reading') {
      filtered = filtered.filter(book => book.status === 'currently-reading');
    } else if (tab === 'completed') {
      filtered = filtered.filter(book => book.status === 'completed');
    } else if (tab === 'want-to-read') {
      filtered = filtered.filter(book => book.status === 'want-to-read');
    }
    
    setFilteredBooks(filtered);
  };
  
  if (isLoading) {
    return (
      <section>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="border-b mb-6">
          <div className="flex overflow-x-auto">
            {[1, 2, 3, 4].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 mx-1" />
            ))}
          </div>
        </div>
        
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded" />
          ))}
        </div>
      </section>
    );
  }
  
  return (
    <section className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-heading">All Favorites ({filteredBooks.length})</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search favorites"
            value={searchQuery}
            onChange={handleSearch}
            className="border border-gray-300 rounded-lg py-1 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="border-b mb-6">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => handleTabChange("all")}
            className={`inline-flex items-center py-2 px-4 border-b-2 text-sm font-medium whitespace-nowrap
              ${activeTab === "all"
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            All
          </button>
          
          <button
            onClick={() => handleTabChange("currently-reading")}
            className={`inline-flex items-center py-2 px-4 border-b-2 text-sm font-medium whitespace-nowrap
              ${activeTab === "currently-reading"
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            Currently Reading
          </button>
          
          <button
            onClick={() => handleTabChange("completed")}
            className={`inline-flex items-center py-2 px-4 border-b-2 text-sm font-medium whitespace-nowrap
              ${activeTab === "completed"
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            Completed
          </button>
          
          <button
            onClick={() => handleTabChange("want-to-read")}
            className={`inline-flex items-center py-2 px-4 border-b-2 text-sm font-medium whitespace-nowrap
              ${activeTab === "want-to-read"
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            Want to Read
          </button>
        </div>
      </div>
      
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-muted-foreground mb-4">No favorite books found.</p>
          <Link
            to="/discover"
            className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Discover Books
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4 text-left font-medium text-muted-foreground"></th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Title</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Author</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Genre</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Rating</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 w-12">
                    <button onClick={() => handleFavoriteToggle(book.id)}>
                      <Heart className="h-5 w-5 fill-book-favorite text-book-favorite" />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/book/${book.id}`} className="font-medium hover:underline">
                      {book.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{book.author}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {book.genre.split(',')[0]}
                  </td>
                  <td className="py-3 px-4">
                    <StarRating value={book.rating || 0} size="sm" disabled />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-sm text-gray-400 hover:text-gray-600">•••</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {filteredBooks.length > 5 && (
        <div className="mt-6 text-center">
          <button className="px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
            Load More
          </button>
        </div>
      )}
    </section>
  );
};

export default FavoritesTable;
