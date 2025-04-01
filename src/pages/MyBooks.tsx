
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "@/lib/types";
import BookshelfTabs from "@/components/BookshelfTabs";
import BookListItem from "@/components/BookListItem";
import { Search, BookOpen, BookMarked, ListTodo, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { mapDbBookToBook } from "@/services/bookService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const MyBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recently-added");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user]);
  
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_updated', { ascending: false });

      if (error) throw error;

      const mappedBooks = data.map(mapDbBookToBook);
      setBooks(mappedBooks);
      setFilteredBooks(mappedBooks);
    } catch (error: any) {
      console.error("Error fetching books:", error.message);
      toast({
        title: "Error fetching books",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
  
  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
    
    let sorted = [...filteredBooks];
    
    switch (sortValue) {
      case "recently-added":
        sorted = sorted.sort((a, b) => 
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
        break;
      case "title":
        sorted = sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "author":
        sorted = sorted.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "progress":
        sorted = sorted.sort((a, b) => {
          const progressA = a.progress?.percentage || 0;
          const progressB = b.progress?.percentage || 0;
          return progressB - progressA;
        });
        break;
      default:
        break;
    }
    
    setFilteredBooks(sorted);
  };
  
  if (isLoading) {
    return (
      <div>
        <div className="border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Skeleton className="h-10 w-32 mb-4" />
            <div className="h-12 mb-4">
              <Skeleton className="h-full w-full" />
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <Skeleton className="h-10 w-full sm:w-64" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          
          <div className="mb-8 space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
          
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold mb-4">My Books</h1>
          
          <BookshelfTabs />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 animate-fade-in">
          <div className="relative w-full sm:w-auto sm:flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search your books"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <label htmlFor="sort-by" className="text-sm text-muted-foreground whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="recently-added">Recently Added</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="progress">Progress</option>
            </select>
            
            <Link
              to="/add-book"
              className="ml-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Add Book
            </Link>
          </div>
        </div>
        
        <div className="mb-8">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg animate-fade-in">
              <p className="text-lg text-muted-foreground mb-4">No books found.</p>
              <Link
                to="/add-book"
                className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Your First Book
              </Link>
            </div>
          ) : (
            filteredBooks.map((book) => (
              <BookListItem key={book.id} book={book} onFavoriteToggle={fetchBooks} />
            ))
          )}
        </div>
        
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold mb-4">Book Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{books.length}</div>
                <div className="text-sm text-muted-foreground">In your collection</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <BookMarked className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{books.filter(b => b.status === 'currently-reading').length}</div>
                <div className="text-sm text-muted-foreground">Currently reading</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{books.filter(b => b.status === 'completed').length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <ListTodo className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{books.filter(b => b.status === 'want-to-read').length}</div>
                <div className="text-sm text-muted-foreground">Want to read</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
