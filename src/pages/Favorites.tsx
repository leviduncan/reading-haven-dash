
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "@/lib/types";
import BookshelfTabs from "@/components/BookshelfTabs";
import StarRating from "@/components/StarRating";
import { Search, Heart, BookOpen, User, Library } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { toggleFavorite } from "@/lib/redux/slices/favoritesSlice";
import { toast } from "@/components/ui/use-toast";

const Favorites = () => {
  const dispatch = useAppDispatch();
  const { favorites, recentlyAdded, stats } = useAppSelector(state => state.favorites);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  
  useEffect(() => {
    // Filter books when favorites, activeTab or searchQuery changes
    filterBooks(searchQuery, activeTab);
  }, [favorites, searchQuery, activeTab]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleFavoriteToggle = (bookId: string) => {
    dispatch(toggleFavorite(bookId));
    toast({
      title: "Favorites updated",
      description: "Your favorites list has been updated.",
    });
  };
  
  const filterBooks = (query: string, tab: string) => {
    let filtered = [...favorites];
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.genre.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (tab === 'currently-reading') {
      filtered = filtered.filter(book => book.status === 'currently-reading');
    } else if (tab === 'completed') {
      filtered = filtered.filter(book => book.status === 'completed');
    } else if (tab === 'want-to-read') {
      filtered = filtered.filter(book => book.status === 'want-to-read');
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
            <span className="text-foreground">Favorites</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Favorite Books</h1>
          
          <BookshelfTabs />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Collection Overview */}
        <section className="mb-10">
          <h2 className="section-heading mb-4">Collection Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalFavorites}</div>
                <div className="text-sm text-muted-foreground">Favorite Books</div>
                <div className="text-xs text-muted-foreground">Total collection</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Library className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.topGenre.name || 'None'}</div>
                <div className="text-sm text-muted-foreground">Top Genre</div>
                <div className="text-xs text-muted-foreground">
                  {stats.topGenre.count} {stats.topGenre.count === 1 ? 'book' : 'books'}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.favoriteAuthor.name || 'None'}</div>
                <div className="text-sm text-muted-foreground">Favorite Author</div>
                <div className="text-xs text-muted-foreground">
                  {stats.favoriteAuthor.count} {stats.favoriteAuthor.count === 1 ? 'book' : 'books'}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
                <div className="text-xs text-muted-foreground">Out of 5</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recently Added Favorites */}
        <section className="mb-10">
          <h2 className="section-heading mb-6">Recently Added Favorites</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentlyAdded.map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
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
            ))}
          </div>
        </section>
        
        {/* All Favorites */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-heading">All Favorites ({filteredBooks.length})</h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search favorites"
                value={searchQuery}
                onChange={handleSearch}
                className="border border-gray-300 rounded-lg py-1 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="border-b mb-6">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => handleTabChange("all")}
                className={`inline-flex items-center py-2 px-4 border-b-2 text-sm font-medium whitespace-nowrap
                  ${activeTab === "all"
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }
                `}
              >
                All
              </button>
              
              <button
                onClick={() => handleTabChange("currently-reading")}
                className={`inline-flex items-center py-2 px-4 border-b-2 text-sm font-medium whitespace-nowrap
                  ${activeTab === "currently-reading"
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }
                `}
              >
                Currently Reading
              </button>
              
              <button
                onClick={() => handleTabChange("completed")}
                className={`inline-flex items-center py-2 px-4 border-b-2 text-sm font-medium whitespace-nowrap
                  ${activeTab === "completed"
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }
                `}
              >
                Completed
              </button>
              
              <button
                onClick={() => handleTabChange("want-to-read")}
                className={`inline-flex items-center py-2 px-4 border-b-2 text-sm font-medium whitespace-nowrap
                  ${activeTab === "want-to-read"
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }
                `}
              >
                Want to Read
              </button>
            </div>
          </div>
          
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg text-muted-foreground mb-4">No favorite books found.</p>
              <Link
                to="/discover"
                className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Discover Books
              </Link>
            </div>
          ) : (
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
                    <tr key={book.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 w-12">
                        <button onClick={() => handleFavoriteToggle(book.id)}>
                          <Heart className="h-5 w-5 fill-book-favorite text-book-favorite" />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <Link to={`/book/${book.id}`} className="font-medium hover:underline">
                          {book.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{book.author}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {book.genre.split(',')[0]}
                      </td>
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
          )}
          
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

export default Favorites;
