
import { Book } from "@/lib/types";
import { Link } from "react-router-dom";
import { CheckCircle, BookOpen, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface BookActionButtonsProps {
  book: Book;
  variant?: 'full' | 'compact';
  onAddToList?: (bookId: string) => void;
  onStartReading?: (bookId: string) => void;
  onContinueReading?: (bookId: string) => void;
  onAddToFavorites?: (bookId: string) => void;
}

const BookActionButtons = ({ 
  book, 
  variant = 'full',
  onAddToList,
  onStartReading,
  onContinueReading,
  onAddToFavorites
}: BookActionButtonsProps) => {
  const isCompact = variant === 'compact';
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAddToList = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user || isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Update book status to "want-to-read" in Supabase
      const { error } = await supabase
        .from('books')
        .update({ 
          status: 'want-to-read',
          last_updated: new Date().toISOString()
        })
        .eq('id', book.id);

      if (error) throw error;
      
      toast({
        title: "Added to reading list",
        description: "The book has been added to your want-to-read list."
      });
      
      if (onAddToList) {
        onAddToList(book.id);
      }
    } catch (error: any) {
      console.error("Error adding book to list:", error.message);
      toast({
        title: "Error adding to list",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleStartReading = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user || isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Update book status to "currently-reading" in Supabase
      const { error } = await supabase
        .from('books')
        .update({ 
          status: 'currently-reading',
          started_reading: new Date().toISOString(),
          last_updated: new Date().toISOString()
        })
        .eq('id', book.id);

      if (error) throw error;
      
      toast({
        title: "Started reading",
        description: "The book has been moved to your currently reading list."
      });
      
      if (onStartReading) {
        onStartReading(book.id);
      }
    } catch (error: any) {
      console.error("Error starting book:", error.message);
      toast({
        title: "Error starting book",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleContinueReading = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user || isProcessing) return;
    
    // For continue reading, we just call the callback
    if (onContinueReading) {
      onContinueReading(book.id);
    }
  };
  
  return (
    <div className={`flex ${isCompact ? 'flex-col' : 'gap-2'} w-full`}>
      {book.status === 'want-to-read' && (
        <button
          onClick={handleStartReading}
          className={`${isCompact ? 'mb-2' : 'flex-1'} text-center px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors`}
          disabled={isProcessing}
        >
          Start Reading
        </button>
      )}
      
      {book.status === 'currently-reading' && (
        <button
          onClick={handleContinueReading}
          className={`${isCompact ? 'mb-2' : 'flex-1'} text-center px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors`}
          disabled={isProcessing}
        >
          Continue Reading
        </button>
      )}
      
      {book.status === 'completed' && (
        <Link
          to={`/add-review/${book.id}`}
          className={`${isCompact ? 'mb-2' : 'flex-1'} text-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors`}
        >
          Add Review
        </Link>
      )}
      
      {!book.status && (
        <button
          onClick={handleAddToList}
          className={`${isCompact ? 'mb-2' : 'flex-1'} flex items-center justify-center gap-1 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors`}
          disabled={isProcessing}
        >
          <Plus className="h-4 w-4" />
          <span>Add to List</span>
        </button>
      )}
      
      <Link
        to={`/book/${book.id}`}
        className={`${isCompact ? '' : 'flex-1'} text-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors`}
      >
        Preview
      </Link>
    </div>
  );
};

export default BookActionButtons;
