
import { Book } from "@/lib/types";
import { Link } from "react-router-dom";
import { MoreVertical, Heart, BookOpen } from "lucide-react";
import StarRating from "./StarRating";

interface BookListItemProps {
  book: Book;
  onFavoriteToggle?: (bookId: string) => void;
}

const BookListItem = ({ book, onFavoriteToggle }: BookListItemProps) => {
  return (
    <div className="flex items-center py-3 border-b">
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
        <StarRating value={book.rating || 0} size="sm" disabled />
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onFavoriteToggle?.(book.id)}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label={book.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${book.isFavorite ? 'fill-book-favorite text-book-favorite' : 'text-gray-400'}`} />
        </button>
        
        <button className="p-1 rounded-full hover:bg-gray-100">
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default BookListItem;
