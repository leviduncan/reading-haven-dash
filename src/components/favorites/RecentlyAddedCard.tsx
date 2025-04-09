
import { Link } from "react-router-dom";
import { Book } from "@/lib/types";

interface RecentlyAddedCardProps {
  book: Book;
}

const RecentlyAddedCard = ({ book }: RecentlyAddedCardProps) => {
  return (
    <div className="bg-white  shadow-sm overflow-hidden">
      <div className="flex p-4 gap-4">
        <div className="flex-shrink-0">
          <img 
            src={book.coverImage} 
            alt={book.title}
            className="w-16 h-24 object-cover rounded"
          />
        </div>
        
        <div className="flex-grow">
          <div className="text-sm text-muted-foreground">{book.author}</div>
          <h3 className="font-bold mb-1">{book.title}</h3>
          <div className="text-sm text-muted-foreground">
            Added {new Date(book.dateAdded).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="border-t grid grid-cols-2">
        <Link
          to={`/book/${book.id}`}
          className="py-3 text-center font-medium text-primary border-r hover:bg-gray-50 transition-colors"
        >
          Read Now
        </Link>
        <Link
          to={`/book/${book.id}`}
          className="py-3 text-center font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RecentlyAddedCard;
