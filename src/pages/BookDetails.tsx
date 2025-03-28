
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Book, Review } from "@/lib/types";
import { mockBooks, mockReviews } from "@/lib/mock-data";
import StarRating from "@/components/StarRating";
import { User, BookOpen, Calendar, BookCopy, Clock, Edit, Trash, Heart } from "lucide-react";

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
      
      {/* Book Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 lg:w-1/4">
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg"
            />
          </div>
          
          <div className="md:w-2/3 lg:w-3/4 flex flex-col">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <div className="text-xl mb-4">{book.author}</div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 mb-2 text-gray-500" />
                <div className="text-sm font-medium">Author</div>
                <div className="text-sm">{book.author}</div>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <BookOpen className="h-5 w-5 mb-2 text-gray-500" />
                <div className="text-sm font-medium">Genre</div>
                <div className="text-sm">{book.genre}</div>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 mb-2 text-gray-500" />
                <div className="text-sm font-medium">Date Completed</div>
                <div className="text-sm">{book.finishedReading || 'In Progress'}</div>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <Star className="h-5 w-5 mb-2 text-gray-500" />
                <div className="text-sm font-medium">Your Rating</div>
                <StarRating value={book.rating || 0} size="sm" disabled />
              </div>
            </div>
            
            <div className="mt-auto flex gap-3">
              {book.status === 'currently-reading' ? (
                <button className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  Continue Reading
                </button>
              ) : book.status === 'want-to-read' ? (
                <button className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  Start Reading
                </button>
              ) : (
                <Link 
                  to={`/add-review/${book.id}`}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Add Review
                </Link>
              )}
              
              <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Heart className={`h-5 w-5 ${book.isFavorite ? 'fill-book-favorite text-book-favorite' : ''}`} />
                <span>{book.isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
              </button>
              
              <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-5 border-b-2 text-sm font-medium
                ${activeTab === 'details'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }
              `}
            >
              Details
            </button>
            
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-5 border-b-2 text-sm font-medium
                ${activeTab === 'reviews'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }
              `}
            >
              Reviews
            </button>
            
            <button
              onClick={() => setActiveTab('similar')}
              className={`py-3 px-5 border-b-2 text-sm font-medium
                ${activeTab === 'similar'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }
              `}
            >
              Similar Books
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'details' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Book Summary</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">{book.description}</p>
            
            <h2 className="text-xl font-bold mb-4">Reading Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-6 bg-white border rounded-lg">
                <BookCopy className="h-6 w-6 mb-3 text-gray-500" />
                <div className="text-2xl font-bold">{book.pageCount}</div>
                <div className="text-sm text-muted-foreground">Pages</div>
                {book.status === 'completed' && <div className="text-sm">Completed</div>}
              </div>
              
              {book.status === 'currently-reading' && book.progress && (
                <>
                  <div className="flex flex-col items-center p-6 bg-white border rounded-lg">
                    <Clock className="h-6 w-6 mb-3 text-gray-500" />
                    <div className="text-2xl font-bold">7 days</div>
                    <div className="text-sm text-muted-foreground">Reading Time</div>
                    <div className="text-sm">Apr 27 - May 4, 2023</div>
                  </div>
                  
                  <div className="flex flex-col items-center p-6 bg-white border rounded-lg">
                    <BarChart2 className="h-6 w-6 mb-3 text-gray-500" />
                    <div className="text-2xl font-bold">71</div>
                    <div className="text-sm text-muted-foreground">Pages/Day</div>
                    <div className="text-sm">Average</div>
                  </div>
                </>
              )}
            </div>
            
            {book.status === 'currently-reading' && book.progress && (
              <div className="mt-6">
                <div className="mb-2 flex justify-between">
                  <span className="text-sm">Page {book.progress.currentPage} of {book.pageCount}</span>
                  <span className="text-sm">{book.progress.percentage}% complete</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-book-progress rounded-full"
                    style={{ width: `${book.progress.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex gap-3">
              <button className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
                Add to Favorites
              </button>
              
              <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Find Similar Books
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Review</h2>
              <Link
                to={`/add-review/${book.id}`}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Write a Review
              </Link>
            </div>
            
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="bg-white border rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 rounded-full p-2">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="star-rating mb-2">
                          <StarRating value={review.rating} size="sm" disabled />
                        </div>
                        <h3 className="font-bold text-lg">{review.title}</h3>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <Edit className="h-5 w-5 text-gray-500" />
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <Trash className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-gray-700">{review.content}</p>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 border rounded-lg p-6 text-center">
                <p className="text-muted-foreground">You haven't reviewed this book yet.</p>
                <Link
                  to={`/add-review/${book.id}`}
                  className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Add Review
                </Link>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'similar' && (
          <div>
            <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mockBooks.slice(5, 9).map(book => (
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
                      <button className="w-full px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                        Add to List
                      </button>
                      
                      <Link
                        to={`/book/${book.id}`}
                        className="w-full text-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
