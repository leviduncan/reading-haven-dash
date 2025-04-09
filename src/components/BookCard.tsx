
import { Book } from "@/lib/types";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface BookCardProps {
  book: Book;
  showProgress?: boolean;
  actionButtons?: React.ReactNode;
  extraContent?: React.ReactNode; // Added extraContent prop
}

const BookCard = ({ book, showProgress = false, actionButtons, extraContent }: BookCardProps) => {
  return (
    <div className="book-card flex flex-col h-full">
      <div className="relative">
        <img 
          src={book.coverImage} 
          alt={book.title}
          className="w-full h-52 object-cover"
        />
        {book.isFavorite && (
          <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
            <Heart className="h-4 w-4 fill-book-favorite text-book-favorite" />
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium line-clamp-1">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        
        {showProgress && book.progress && (
          <div className="mt-3">
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Page {book.progress.currentPage} of {book.pageCount}</span>
              <span>{book.progress.percentage}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${book.progress.percentage}%` }}></div>
            </div>
          </div>
        )}
        
        {book.rating && (
          <div className="mt-2 flex items-center gap-1">
            <div className="star-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg 
                  key={i}
                  className={`h-4 w-4 ${i < book.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
        )}
        
        {extraContent && (
          <div className="mt-2">
            {extraContent}
          </div>
        )}
        
        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          {actionButtons ? (
            actionButtons
          ) : (
            <Link 
              to={`/book/${book.id}`}
              className="w-full text-center px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
