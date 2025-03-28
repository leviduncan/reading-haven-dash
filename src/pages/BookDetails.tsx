
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Book, Review } from "@/lib/types";
import { mockBooks, mockReviews } from "@/lib/mock-data";
import BookHeader from "@/components/book-details/BookHeader";
import BookTabs from "@/components/book-details/BookTabs";
import BookDetailsTab from "@/components/book-details/BookDetailsTab";
import BookReviewsTab from "@/components/book-details/BookReviewsTab";
import BookSimilarTab from "@/components/book-details/BookSimilarTab";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'similar'>('details');
  
  useEffect(() => {
    // Find the book by ID
    const foundBook = mockBooks.find(b => b.id === id);
    setBook(foundBook || null);
    
    // Get reviews for this book
    const bookReviews = mockReviews.filter(r => r.bookId === id);
    setReviews(bookReviews);
  }, [id]);
  
  if (!book) {
    return <div className="p-6">Book not found</div>;
  }
  
  return (
    <div>
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/my-books" className="hover:text-foreground">My Books</Link>
            <span>›</span>
            <Link to={`/${book.status}`} className="hover:text-foreground capitalize">
              {book.status.replace(/-/g, ' ')}
            </Link>
            <span>›</span>
            <span className="text-foreground">{book.title}</span>
          </div>
        </div>
      </div>
      
      <BookHeader book={book} />
      
      <BookTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'details' && <BookDetailsTab book={book} />}
        
        {activeTab === 'reviews' && <BookReviewsTab bookId={book.id} reviews={reviews} />}
        
        {activeTab === 'similar' && <BookSimilarTab similarBooks={mockBooks.slice(5, 9)} />}
      </div>
    </div>
  );
};

export default BookDetails;
