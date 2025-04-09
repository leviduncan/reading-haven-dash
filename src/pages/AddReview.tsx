
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Book } from "@/lib/types";
import { mockBooks } from "@/lib/mock-data";
import StarRating from "@/components/StarRating";
import { Heart, Share2, X } from "lucide-react";
import { toast } from "sonner";

const AddReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  
  useEffect(() => {
    // Find the book by ID
    const foundBook = mockBooks.find(b => b.id === id);
    if (foundBook) {
      setBook(foundBook);
      setIsFavorite(foundBook.isFavorite);
    }
  }, [id]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, would save the review to the backend
    console.log({
      bookId: id,
      title,
      content,
      rating,
      startDate,
      endDate,
      isFavorite,
      isPublic
    });
    
    toast.success("Review submitted successfully!");
    navigate(`/book/${id}`);
  };
  
  if (!book) {
    return <div className="p-6">Book not found</div>;
  }
  
  return (
    <div>
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/my-books" className="hover:text-foreground">My Books</Link>
            <span>›</span>
            <Link to="/completed" className="hover:text-foreground">Completed</Link>
            <span>›</span>
            <span className="text-foreground">Add Review</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl mb-6">Add Review for {book.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit}>
                {/* Rating Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-4">Your Rating</h2>
                  <StarRating 
                    value={rating} 
                    onChange={setRating} 
                    size="lg"
                    count={5}
                  />
                </div>
                
                {/* Review Title */}
                <div className="mb-6">
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Review Title
                  </label>
                  <div className="text-xs text-muted-foreground mb-2">
                    Give your review a title
                  </div>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Thought-provoking and inspiring"
                    className="w-full border border-gray-300 p-3"
                  />
                </div>
                
                {/* Review Content */}
                <div className="mb-8">
                  <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Your Review
                  </label>
                  <div className="text-xs text-muted-foreground mb-2">
                    Write your thoughts about the book
                  </div>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share what you liked, what you didn't, and who you'd recommend this book to..."
                    className="w-full border border-gray-300 p-3 min-h-[200px]"
                  />
                </div>
                
                {/* Reading Experience */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-4">Reading Experience</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="start-date" className="block text-sm font-medium mb-2">
                        Date Started
                      </label>
                      <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-gray-300 p-3"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="end-date" className="block text-sm font-medium mb-2">
                        Date Finished
                      </label>
                      <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-gray-300 p-3"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Options */}
                <div className="mb-8">
                  <div className="flex items-center justify-between p-4 border mb-4">
                    <div className="flex items-center gap-3">
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-book-favorite text-book-favorite' : 'text-gray-500'}`} />
                      <div>
                        <div className="font-medium">Add to Favorites</div>
                        <div className="text-sm text-muted-foreground">Mark this book as a favorite</div>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isFavorite}
                        onChange={() => setIsFavorite(!isFavorite)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Share2 className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Share Review</div>
                        <div className="text-sm text-muted-foreground">Make your review public</div>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                {/* Submit */}
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                  >
                    Submit Review
                  </button>
                  
                  <Link
                    to={`/book/${book.id}`}
                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
            
            {/* Book Info */}
            <div>
              <div className="bg-gray-50  p-6">
                <div className="flex justify-end">
                  <button className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">{book.author}</div>
                  <h2 className="text-xl font-bold">{book.title}</h2>
                </div>
                
                <div className="flex justify-center mb-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-32 shadow-md"
                  />
                </div>
                
                <p className="text-sm text-gray-600">
                  {book.description.length > 200
                    ? `${book.description.substring(0, 200)}...`
                    : book.description
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
