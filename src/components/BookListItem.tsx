
import { Book } from "@/lib/types";
import { Link } from "react-router-dom";
import { MoreVertical, Heart, BookOpen } from "lucide-react";
import StarRating from "./StarRating";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

interface BookListItemProps {
  book: Book;
  onFavoriteToggle?: () => void;
  onRatingChange?: () => void;
}

const BookListItem = ({ book, onFavoriteToggle, onRatingChange }: BookListItemProps) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(book.isFavorite);
  const [rating, setRating] = useState(book.rating || 0);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const newFavoriteStatus = !isFavorite;
      
      const { error } = await supabase
        .from('books')
        .update({ 
          is_favorite: newFavoriteStatus,
          last_updated: new Date().toISOString()
        })
        .eq('id', book.id);

      if (error) throw error;
      
      setIsFavorite(newFavoriteStatus);
      
      toast({
        title: newFavoriteStatus ? "Added to favorites" : "Removed from favorites",
        description: newFavoriteStatus 
          ? "The book has been added to your favorites." 
          : "The book has been removed from your favorites.",
      });
      
      if (onFavoriteToggle) {
        onFavoriteToggle();
      }
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
    if (!user || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('books')
        .update({ 
          rating: newRating,
          last_updated: new Date().toISOString()
        })
        .eq('id', book.id);

      if (error) throw error;
      
      setRating(newRating);
      
      toast({
        title: "Rating updated",
        description: "Your rating has been saved."
      });
      
      if (onRatingChange) {
        onRatingChange();
      }
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
    <div className="flex items-center py-3 border-b animate-fade-in">
      <div className="flex-shrink-0 w-6 mr-4">
        <BookOpen className="h-5 w-5 text-gray-500" />
      </div>
      
      <div className="flex-grow">
        <Link to={`/book/${book.id}`} className="font-medium hover:underline">
          {book.title}
        </Link>
      </div>
      
      <div className="w-28 text-sm text-gray-600">{book.author}</div>
      
      <div className="w-28 text-sm text-gray-600">{book.genre}</div>
      
      <div className="w-24">
        <StarRating 
          value={rating} 
          size="sm" 
          onChange={handleRatingChange}
          disabled={isUpdating}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={handleFavoriteToggle}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          disabled={isUpdating}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-book-favorite text-book-favorite' : 'text-gray-400'}`} />
        </button>
        
        <button className="p-1 rounded-full hover:bg-gray-100">
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default BookListItem;
