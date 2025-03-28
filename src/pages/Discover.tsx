
import { useEffect, useState } from "react";
import { getDiscoverBooks, getPopularGenres } from "@/lib/mock-data";
import BookActionButtons from "@/components/BookActionButtons";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const Discover = () => {
  const [trendingBooks, setTrendingBooks] = useState<any[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("popular");
  const [genres, setGenres] = useState<any[]>([]);
  
  useEffect(() => {
    // Get books for discovery page
    const books = getDiscoverBooks();
    setTrendingBooks(books.slice(0, 4));
    setRecommendedBooks(books.slice(2, 5).concat(books[0]));
    
    // Get popular genres
    setGenres(getPopularGenres());
  }, []);
  
  const handleAddToList = (bookId: string) => {
    toast.success("Book added to your list!");
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Discover Books</h1>
      
      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("popular")}
            className={`inline-flex items-center py-3 px-5 border-b-2 text-sm font-medium whitespace-nowrap
              ${activeTab === "popular"
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            Popular
          </button>
          
          <button
            onClick={() => setActiveTab("new")}
            className={`inline-flex items-center py-3 px-5 border-b-2 text-sm font-medium whitespace-nowrap
              ${activeTab === "new"
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            New Releases
          </button>
          
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`inline-flex items-center py-3 px-5 border-b-2 text-sm font-medium whitespace-nowrap
              ${activeTab === "recommendations"
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            Recommendations
          </button>
          
          <button
            onClick={() => setActiveTab("genres")}
            className={`inline-flex items-center py-3 px-5 border-b-2 text-sm font-medium whitespace-nowrap
              ${activeTab === "genres"
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            Genres
          </button>
          
          <button
            onClick={() => setActiveTab("authors")}
            className={`inline-flex items-center py-3 px-5 border-b-2 text-sm font-medium whitespace-nowrap
              ${activeTab === "authors"
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            Authors
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className="flex items-center mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search books, authors, or genres"
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button className="ml-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          Advanced Search
        </button>
      </div>
      
      {/* Trending Now */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-heading">Trending Now</h2>
          <div className="flex gap-2">
            <button className="p-1 rounded-full border border-gray-300 hover:bg-gray-100">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="p-1 rounded-full border border-gray-300 hover:bg-gray-100">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="relative">
                <img 
                  src={book.coverImage} 
                  alt={book.title}
                  className="w-full h-52 object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-medium mb-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{book.author} • {book.genre}</p>
                
                <div className="mt-4">
                  <BookActionButtons 
                    book={book}
                    variant="compact"
                    onAddToList={() => handleAddToList(book.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Based on Your Reading History */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-heading">Based on Your Reading History</h2>
          <div className="flex gap-2">
            <button className="p-1 rounded-full border border-gray-300 hover:bg-gray-100">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="p-1 rounded-full border border-gray-300 hover:bg-gray-100">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="relative">
                <img 
                  src={book.coverImage} 
                  alt={book.title}
                  className="w-full h-52 object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-medium mb-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{book.author} • {book.genre}</p>
                
                <div className="mt-4">
                  <BookActionButtons 
                    book={book}
                    variant="compact"
                    onAddToList={() => handleAddToList(book.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Popular Genres */}
      <section>
        <h2 className="section-heading mb-4">Popular Genres</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {genres.map((genre) => (
            <div 
              key={genre.name}
              className="p-6 bg-white rounded-lg shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="font-medium mb-2">{genre.name}</div>
              <div className="text-sm text-muted-foreground">{genre.count} books</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Discover;
