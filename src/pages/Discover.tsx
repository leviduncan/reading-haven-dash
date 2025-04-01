
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/lib/types";
import { mapDbBookToBook } from "@/services/bookService";
import { toast } from "@/components/ui/use-toast";
import BookCard from "@/components/BookCard";
import BookActionButtons from "@/components/BookActionButtons";

const Discover = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchDiscoverBooks();
  }, []);
  
  const fetchDiscoverBooks = async () => {
    setIsLoading(true);
    try {
      // Fetch books from Supabase that are not already in the user's collection
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .not('user_id', 'eq', user?.id);
      
      if (error) throw error;
      
      const mappedBooks = data.map(mapDbBookToBook);
      setBooks(mappedBooks);
    } catch (error: any) {
      console.error("Error fetching discover books:", error.message);
      toast({
        title: "Error fetching books",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddToList = (bookId: string) => {
    // Update the local state after book is added to reading list
    fetchDiscoverBooks();
    
    toast({
      title: "Book added to reading list",
      description: "Book has been added to your 'Want to Read' list."
    });
  };
  
  const handleStartReading = (bookId: string) => {
    // Update the local state after book status is changed
    fetchDiscoverBooks();
    
    toast({
      title: "Started reading",
      description: "Book has been moved to your 'Currently Reading' list."
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Discover Books</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <BookCard 
              key={book.id} 
              book={book}
              actionButtons={
                <BookActionButtons 
                  book={book}
                  onAddToList={handleAddToList}
                  onStartReading={handleStartReading}
                />
              }
            />
          ))}
        </div>
      )}
      
      {!isLoading && books.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-xl text-muted-foreground mb-2">No new books to discover</p>
          <p className="text-muted-foreground">
            Check back later for new recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default Discover;
