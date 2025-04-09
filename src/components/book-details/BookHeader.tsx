
import { Book } from "@/lib/types";
import { Link } from "react-router-dom";
import { User, BookOpen, Calendar, Heart, Star } from "lucide-react";
import StarRating from "@/components/StarRating";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

interface BookHeaderProps {
  book: Book;
}

const BookHeader = ({ book }: BookHeaderProps) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(book.isFavorite);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rating, setRating] = useState(book.rating || 0);
  
  const handleToggleFavorite = async () => {
    if (!user || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const newFavoriteStatus = !isFavorite;
      
      // Update the book in Supabase
      const { error } = await supabase
        .from('books')
        .update({ 
          is_favorite: newFavoriteStatus,
          last_updated: new Date().toISOString()
        })
        .eq('id', book.id);

      if (error) throw error;
      
      // Update local state
      setIsFavorite(newFavoriteStatus);
      
      toast({
        title: newFavoriteStatus ? "Added to favorites" : "Removed from favorites",
        description: newFavoriteStatus 
          ? "The book has been added to your favorites." 
          : "The book has been removed from your favorites.",
      });
    } catch (error: any) {
      console.error("Error toggling favorite status:", error.message);
      toast({
        title: "Error updating favorite status",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleRatingChange = async (newRating: number) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      // Update the book in Supabase
      const { error } = await supabase
        .from('books')
        .update({ 
          rating: newRating,
          last_updated: new Date().toISOString()
        })
        .eq('id', book.id);

      if (error) throw error;
      
      // Update local state
      setRating(newRating);
      
      toast({
        title: "Rating updated",
        description: "Your rating has been saved."
      });
    } catch (error: any) {
      console.error("Error updating rating:", error.message);
      toast({
        title: "Error updating rating",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border-b">
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 lg:w-1/4">
          <img 
            src={book.coverImage} 
            alt={book.title}
            className="w-full aspect-[2/3] object-cover  shadow-lg"
          />
        </div>
        
        <div className="md:w-2/3 lg:w-3/4 flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <div className="text-xl mb-4">{book.author}</div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center p-4 bg-gray-50 ">
              <User className="h-5 w-5 mb-2 text-gray-500" />
              <div className="text-sm font-medium">Author</div>
              <div className="text-sm">{book.author}</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 ">
              <BookOpen className="h-5 w-5 mb-2 text-gray-500" />
              <div className="text-sm font-medium">Genre</div>
              <div className="text-sm">{book.genre}</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 ">
              <Calendar className="h-5 w-5 mb-2 text-gray-500" />
              <div className="text-sm font-medium">Date Completed</div>
              <div className="text-sm">{book.finishedReading || 'In Progress'}</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 ">
              <Star className="h-5 w-5 mb-2 text-gray-500" />
              <div className="text-sm font-medium">Your Rating</div>
              <StarRating 
                value={rating} 
                size="sm"
                onChange={handleRatingChange}
                disabled={isUpdating}
              />
            </div>
          </div>
          
          <div className="mt-auto flex gap-3">
            {book.status === 'currently-reading' ? (
              <button className="px-6 py-2 bg-primary text-white hover:bg-primary/90 transition-colors">
                Continue Reading
              </button>
            ) : book.status === 'want-to-read' ? (
              <button className="px-6 py-2 bg-primary text-white hover:bg-primary/90 transition-colors">
                Start Reading
              </button>
            ) : (
              <Link 
                to={`/add-review/${book.id}`}
                className="px-6 py-2 bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Add Review
              </Link>
            )}
            
            <button 
              onClick={handleToggleFavorite}
              className="px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
              disabled={isUpdating}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-book-favorite text-book-favorite' : ''}`} />
              <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
            </button>
            
            <button className="px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookHeader;
