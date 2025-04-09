
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Book } from "@/lib/types";
import { fetchBooksByStatus, toggleBookFavorite } from "@/services/bookService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import BookCard from "@/components/BookCard";
import { Heart } from "lucide-react";

interface CurrentlyReadingListProps {
  limit?: number;
  showViewAll?: boolean;
}

const CurrentlyReadingList = ({ limit, showViewAll = true }: CurrentlyReadingListProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const fetchedBooks = await fetchBooksByStatus('currently-reading');
      setBooks(limit ? fetchedBooks.slice(0, limit) : fetchedBooks);
    } catch (error) {
      console.error("Error loading currently reading books:", error);
      toast({
        title: "Error loading books",
        description: "Failed to load your currently reading books",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (bookId: string, currentStatus: boolean) => {
    if (!user) return;
    
    const newStatus = !currentStatus;
    
    const updatedBook = await toggleBookFavorite(bookId, newStatus);
    
    if (updatedBook) {
      setBooks(prev => 
        prev.map(book => 
          book.id === bookId ? { ...book, isFavorite: newStatus } : book
        )
      );
      
      toast({
        title: newStatus ? "Added to favorites" : "Removed from favorites",
        description: newStatus 
          ? "The book has been added to your favorites." 
          : "The book has been removed from your favorites."
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-heading">Currently Reading</h2>
        {showViewAll && (
          <Link to="/currently-reading" className="text-sm text-primary hover:underline">
            View All
          </Link>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => (
            <BookCard 
              key={book.id} 
              book={book}
              showProgress={true}
              actionButtons={
                <div className="w-full flex flex-col gap-2">
                  <Link
                    to={`/book/${book.id}`}
                    className="w-full text-center px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Continue Reading
                  </Link>
                  <button
                    onClick={() => handleToggleFavorite(book.id, book.isFavorite)}
                    className="w-full text-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart className={`h-4 w-4 ${book.isFavorite ? 'fill-book-favorite text-book-favorite' : ''}`} />
                    {book.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-muted-foreground mb-4">You're not currently reading any books.</p>
          <Link
            to="/discover"
            className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Find Books to Read
          </Link>
        </div>
      )}
    </>
  );
};

export default CurrentlyReadingList;
