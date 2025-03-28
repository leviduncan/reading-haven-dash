
import { Book } from "@/lib/types";
import { Link } from "react-router-dom";
import { CheckCircle, BookOpen, Heart, Plus } from "lucide-react";

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
  
  return (
    <div className={`flex ${isCompact ? 'flex-col' : 'gap-2'} w-full`}>
      {book.status === 'want-to-read' && (
        <button
          onClick={() => onStartReading?.(book.id)}
          className={`${isCompact ? 'mb-2' : 'flex-1'} text-center px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors`}
        >
          Start Reading
        </button>
      )}
      
      {book.status === 'currently-reading' && (
        <button
          onClick={() => onContinueReading?.(book.id)}
          className={`${isCompact ? 'mb-2' : 'flex-1'} text-center px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors`}
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
          onClick={() => onAddToList?.(book.id)}
          className={`${isCompact ? 'mb-2' : 'flex-1'} flex items-center justify-center gap-1 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors`}
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
