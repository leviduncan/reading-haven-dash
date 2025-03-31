
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Book, Review } from "@/lib/types";
import { fetchBook } from "@/services/bookService";
import { fetchReviewsByBookId } from "@/services/reviewService";
import BookHeader from "@/components/book-details/BookHeader";
import BookTabs from "@/components/book-details/BookTabs";
import BookDetailsTab from "@/components/book-details/BookDetailsTab";
import BookReviewsTab from "@/components/book-details/BookReviewsTab";
import BookSimilarTab from "@/components/book-details/BookSimilarTab";
import { useAuth } from "@/contexts/AuthContext";
import { mockBooks } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'similar'>('details');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch book details
        const bookData = await fetchBook(id);
        if (bookData) {
          setBook(bookData);
          
          // Fetch reviews for this book
          const reviewsData = await fetchReviewsByBookId(id);
          setReviews(reviewsData);
        } else {
          navigate('/not-found', { replace: true });
        }
      } catch (error) {
        console.error("Error loading book data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <div>
        <div className="border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Skeleton className="h-6 w-72" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-64 w-44 rounded" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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
