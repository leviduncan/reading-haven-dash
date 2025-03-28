
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "@/lib/types";
import { mockBooks } from "@/lib/mock-data";
import BookshelfTabs from "@/components/BookshelfTabs";
import StarRating from "@/components/StarRating";
import { Search, BookOpen, FileText, Star, LibraryBig } from "lucide-react";

const Completed = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [recentlyCompleted, setRecentlyCompleted] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [stats, setStats] = useState({
    booksRead: 0,
    pagesRead: 0,
    avgRating: 0,
    topGenre: { name: "", count: 0 }
  });
  
  useEffect(() => {
    // Filter books that are completed
    const completedBooks = mockBooks.filter(book => book.status === 'completed');
    setBooks(completedBooks);
    setFilteredBooks(completedBooks);
    
    // Get recently completed books
    const sortedByDate = [...completedBooks].sort((a, b) => {
      const dateA = a.finishedReading ? new Date(a.finishedReading).getTime() : 0;
      const dateB = b.finishedReading ? new Date(b.finishedReading).getTime() : 0;
      return dateB - dateA;
    });
    setRecentlyCompleted(sortedByDate.slice(0, 3));
    
    // Calculate stats
    const totalPages = completedBooks.reduce((sum, book) => sum + book.pageCount, 0);
    const totalRating = completedBooks.reduce((sum, book) => sum + (book.rating || 0), 0);
    const avgRating = completedBooks.length > 0 ? totalRating / completedBooks.length : 0;
    
    // Count genres
    const genreCounts: Record<string, number> = {};
    completedBooks.forEach(book => {
      const mainGenre = book.genre.split(',')[0].trim();
      genreCounts[mainGenre] = (genreCounts[mainGenre] || 0) + 1;
    });
    
    // Find top genre
    let topGenre = { name: "", count: 0 };
    Object.entries(genreCounts).forEach(([name, count]) => {
      if (count > topGenre.count) {
        topGenre = { name, count };
      }
    });
    
    setStats({
      booksRead: completedBooks.length,
      pagesRead: totalPages,
      avgRating: avgRating,
      topGenre
    });
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterBooks(query, selectedFilter);
  };
  
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    filterBooks(searchQuery, filter);
  };
  
  const filterBooks = (query: string, filter: string) => {
    let filtered = [...books];
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.genre.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (filter === 'reviewed') {
      filtered = filtered.filter(book => book.rating !== undefined);
    } else if (filter === 'not-reviewed') {
      filtered = filtered.filter(book => book.rating === undefined);
    } else if (filter === 'favorites') {
      filtered = filtered.filter(book => book.isFavorite);
    }
    
    setFilteredBooks(filtered);
  };
  
  return (
    <div>
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/my-books" className="hover:text-foreground">My Books</Link>
            <span>›</span>
            <span className="text-foreground">Completed</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Completed Books</h1>
          
          <BookshelfTabs />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Reading Stats */}
        <section className="mb-10">
          <h2 className="section-heading mb-4">Reading Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.booksRead}</div>
                <div className="text-sm text-muted-foreground">Books Read</div>
                <div className="text-xs text-muted-foreground">This year</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.pagesRead.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Pages Read</div>
                <div className="text-xs text-muted-foreground">This year</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
                <div className="text-xs text-muted-foreground">Out of 5</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <LibraryBig className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.topGenre.name}</div>
                <div className="text-sm text-muted-foreground">Most Read Genre</div>
                <div className="text-xs text-muted-foreground">{stats.topGenre.count} books</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recently Completed */}
        <section className="mb-10">
          <h2 className="section-heading mb-4">Recently Completed</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentlyCompleted.map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="text-sm text-muted-foreground">{book.author}</div>
                  <h3 className="font-bold mb-2">{book.title}</h3>
                  <div className="mb-2 text-sm text-muted-foreground">
                    Completed {book.finishedReading ? new Date(book.finishedReading).toLocaleDateString() : 'recently'}
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Link
                      to={`/add-review/${book.id}`}
                      className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                    >
                      Add Review
                    </Link>
                    
                    <Link
                      to={`/book/${book.id}`}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Your Reviews */}
        <section className="mb-10">
          <h2 className="section-heading mb-4">Your Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {books.filter(book => book.rating !== undefined).slice(0, 2).map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  
                  <div>
                    <h3 className="font-bold">{book.title}</h3>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <StarRating value={book.rating || 0} size="sm" disabled />
                      <span className="text-sm text-muted-foreground">- Brilliant sci-fi with heart</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        to={`/book/${book.id}`}
                        className="text-primary text-sm hover:underline"
                      >
                        Edit
                      </Link>
                      <span className="text-sm text-muted-foreground">•</span>
                      <Link
                        to={`/book/${book.id}`}
                        className="text-primary text-sm hover:underline"
                      >
                        Delete
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* All Completed Books */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-heading">All Completed Books ({filteredBooks.length})</h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search completed books"
                value={searchQuery}
                onChange={handleSearch}
                className="border border-gray-300 rounded-lg py-1 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="border-b mb-6">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => handleFilterChange("all")}
                className={`inline-flex items-center py-2 px-4 border-b-2 text-sm font-medium whitespace-nowrap
                  ${selectedFilter === "all"
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }
                `}
              >
                All
              </button>
              
              <button
                onClick={() => handleFilterChange("reviewed")}
                className={`inline-flex items-center py-2 px-4 border-b-2 text-sm font-medium whitespace-nowrap
                  ${selectedFilter === "reviewed"
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }
                `}
              >
                Reviewed
              </button>
              
              <button
                onClick={() => handleFilterChange("not-reviewed")}
                className={`inline-flex items-center py-2 px-4 border-b-2 text-sm font-medium whitespace-nowrap
                  ${selectedFilter === "not-reviewed"
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }
                `}
              >
                Not Reviewed
              </button>
              
              <button
                onClick={() => handleFilterChange("favorites")}
                className={`inline-flex items-center py-2 px-4 border-b-2 text-sm font-medium whitespace-nowrap
                  ${selectedFilter === "favorites"
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }
                `}
              >
                Favorites
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground"></th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Title</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Author</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Genre</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Rating</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <tr key={book.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="w-7 h-7">
                        <BookOpen className="h-5 w-5 text-gray-500" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Link to={`/book/${book.id}`} className="font-medium hover:underline">
                        {book.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{book.author}</td>
                    <td className="py-3 px-4 text-muted-foreground">{book.genre.split(',')[0]}</td>
                    <td className="py-3 px-4">
                      <StarRating value={book.rating || 0} size="sm" disabled />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-sm text-gray-400 hover:text-gray-600">•••</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredBooks.length > 5 && (
            <div className="mt-6 text-center">
              <button className="px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                Load More
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Completed;
