
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "@/lib/types";
import { mockBooks } from "@/lib/mock-data";
import BookshelfTabs from "@/components/BookshelfTabs";
import { Search, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const WantToRead = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{name: string, count: number}[]>([]);
  
  useEffect(() => {
    // Filter books that are in the want-to-read list
    const wantToReadBooks = mockBooks.filter(book => book.status === 'want-to-read');
    setBooks(wantToReadBooks);
    setFilteredBooks(wantToReadBooks);
    
    // Get recently added books
    const sortedByDate = [...wantToReadBooks].sort((a, b) => {
      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();
      return dateB - dateA;
    });
    setRecentlyAdded(sortedByDate.slice(0, 3));
    
    // Extract categories
    const categoryMap: Record<string, number> = {};
    wantToReadBooks.forEach(book => {
      const genres = book.genre.split(',').map(g => g.trim());
      genres.forEach(genre => {
        categoryMap[genre] = (categoryMap[genre] || 0) + 1;
      });
    });
    
    // Convert category map to array
    const categoryArray = Object.entries(categoryMap).map(([name, count]) => ({ name, count }));
    categoryArray.sort((a, b) => b.count - a.count);
    setCategories(categoryArray.slice(0, 4));
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query) {
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.genre.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  };
  
  const handleStartReading = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      toast.success(`Started reading "${book.title}"`);
    }
  };
  
  return (
    <div>
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/my-books" className="hover:text-foreground">My Books</Link>
            <span>›</span>
            <span className="text-foreground">Want to Read</span>
          </div>
          
          <h1 className="text-3xl mb-4">Want to Read</h1>
          
          <BookshelfTabs />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Recently Added */}
        <section className="mb-10">
          <h2 className="section-heading mb-6">Recently Added</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentlyAdded.map(book => (
              <div key={book.id} className="bg-white  shadow-sm overflow-hidden">
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
                  <button
                    onClick={() => handleStartReading(book.id)}
                    className="py-3 text-center font-medium text-primary border-r hover:bg-gray-50 transition-colors"
                  >
                    Start Reading
                  </button>
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
        
        {/* Categories */}
        <section className="mb-10">
          <h2 className="section-heading mb-4">Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map(category => (
              <div 
                key={category.name}
                className="bg-white  shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{category.name}</div>
                    <div className="text-sm text-muted-foreground">{category.count} books</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* All Books */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-heading">All Books ({filteredBooks.length})</h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search your list"
                value={searchQuery}
                onChange={handleSearch}
                className="border border-gray-300  py-1 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 ">
              <p className="text-lg text-muted-foreground mb-4">No books found in your Want to Read list.</p>
              <Link
                to="/discover"
                className="px-5 py-2 bg-primary text-white  hover:bg-primary/90 transition-colors"
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
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Added</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map(book => {
                    // Format the date for display
                    let addedText = '';
                    try {
                      const addedDate = new Date(book.dateAdded);
                      const now = new Date();
                      const diffDays = Math.round((now.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24));
                      
                      if (diffDays <= 1) {
                        addedText = 'Added today';
                      } else if (diffDays <= 2) {
                        addedText = 'Added 2 days ago';
                      } else if (diffDays <= 7) {
                        addedText = `Added ${diffDays} days ago`;
                      } else if (diffDays <= 14) {
                        addedText = 'Added 1 week ago';
                      } else if (diffDays <= 30) {
                        addedText = 'Added 2 weeks ago';
                      } else if (diffDays <= 60) {
                        addedText = 'Added 1 month ago';
                      } else {
                        addedText = `Added ${addedDate.toLocaleDateString()}`;
                      }
                    } catch (e) {
                      addedText = 'Unknown date';
                    }
                    
                    return (
                      <tr key={book.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 w-12">
                          <img 
                            src={book.coverImage} 
                            alt={book.title}
                            className="w-8 h-11 object-cover rounded"
                          />
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
                        <td className="py-3 px-4 text-muted-foreground">{addedText}</td>
                        <td className="py-3 px-4 text-right">
                          <button 
                            className="px-4 py-1 bg-primary text-white text-sm hover:bg-primary/90 transition-colors"
                            onClick={() => handleStartReading(book.id)}
                          >
                            Start Reading
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          {filteredBooks.length > 5 && (
            <div className="mt-6 text-center">
              <button className="px-6 py-2 border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
                Load More
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default WantToRead;
