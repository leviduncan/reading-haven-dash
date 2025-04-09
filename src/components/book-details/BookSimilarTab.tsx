
import { Book } from "@/lib/types";
import { Link } from "react-router-dom";

interface BookSimilarTabProps {
  similarBooks: Book[];
}

const BookSimilarTab = ({ similarBooks }: BookSimilarTabProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {similarBooks.map(book => (
          <div key={book.id} className="book-card">
            <div className="relative">
              <img 
                src={book.coverImage} 
                alt={book.title}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-1">{book.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{book.author} • {book.genre.split(',')[0]}</p>
              
              <div className="mt-4 flex flex-col gap-2">
                <button className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                  Add to List
                </button>
                
                <Link
                  to={`/book/${book.id}`}
                  className="w-full text-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Preview
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSimilarTab;
