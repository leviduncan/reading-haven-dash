
import { useEffect, useState } from "react";
import { Book } from "@/lib/types";
import BookshelfTabs from "@/components/BookshelfTabs";
import BookListItem from "@/components/BookListItem";
import { Search, BookOpen, BookMarked, ListTodo, CheckCircle2, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { mapDbBookToBook } from "@/services/bookService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const MyBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [paginatedBooks, setPaginatedBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recently-added");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    author: "",
    genre: ""
  });
  
  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user]);
  
  useEffect(() => {
    applyFiltersAndSort();
  }, [books, searchQuery, sortBy, filters]);
  
  useEffect(() => {
    applyPagination();
  }, [filteredBooks, currentPage]);
  
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
  
  const applyFiltersAndSort = () => {
    let result = [...books];
    
    // Apply search query
    if (searchQuery) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply advanced filters
    if (filters.title) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    
    if (filters.author) {
      result = result.filter(book => 
        book.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }
    
    if (filters.genre) {
      result = result.filter(book => 
        book.genre.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "recently-added":
        result = result.sort((a, b) => 
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
        break;
      case "title":
        result = result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "author":
        result = result.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "progress":
        result = result.sort((a, b) => {
          const progressA = a.progress?.percentage || 0;
          const progressB = b.progress?.percentage || 0;
          return progressB - progressA;
        });
        break;
      default:
        break;
    }
    
    setFilteredBooks(result);
    
    // Reset to first page when filters change
    setCurrentPage(1);
    
    // Calculate total pages
    const totalPagesCount = Math.ceil(result.length / ITEMS_PER_PAGE);
    setTotalPages(totalPagesCount || 1);
  };
  
  const applyPagination = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedBooks(filteredBooks.slice(startIndex, endIndex));
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };
  
  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
  };
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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
          <h1 className="text-3xl mb-4">My Books</h1>
          
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
              className="w-full border border-gray-300  py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </Button>
            
            <label htmlFor="sort-by" className="text-sm text-muted-foreground whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300  py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="recently-added">Recently Added</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="progress">Progress</option>
            </select>
          </div>
        </div>
        
        {isFilterOpen && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4  animate-fade-in">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Title</label>
              <Input
                placeholder="Filter by title"
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Author</label>
              <Input
                placeholder="Filter by author"
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Genre</label>
              <Input
                placeholder="Filter by genre"
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
              />
            </div>
          </div>
        )}
        
        <div className="mb-8">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12 bg-gray-50  animate-fade-in">
              <p className="text-lg text-muted-foreground mb-4">No books found.</p>
            </div>
          ) : (
            <div>
              {paginatedBooks.map((book) => (
                <BookListItem key={book.id} book={book} onFavoriteToggle={fetchBooks} />
              ))}
              
              <div className="py-4 mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      // Show limited page numbers for better UX
                      if (
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              isActive={page === currentPage}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <PaginationItem key={page}>...</PaginationItem>;
                      }
                      
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
        
        <div className="animate-fade-in">
          <h2 className="text-xl mb-4">Book Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white  shadow-sm p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{books.length}</div>
                <div className="text-sm text-muted-foreground">In your collection</div>
              </div>
            </div>
            
            <div className="bg-white  shadow-sm p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <BookMarked className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{books.filter(b => b.status === 'currently-reading').length}</div>
                <div className="text-sm text-muted-foreground">Currently reading</div>
              </div>
            </div>
            
            <div className="bg-white  shadow-sm p-6 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{books.filter(b => b.status === 'completed').length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
            
            <div className="bg-white  shadow-sm p-6 flex items-center gap-4">
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
