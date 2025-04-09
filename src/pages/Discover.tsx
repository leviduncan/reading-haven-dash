
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/lib/types";
import { mapDbBookToBook } from "@/services/bookService";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  number_of_pages_median?: number;
  subject?: string[];
}

interface OpenLibraryResponse {
  numFound: number;
  docs: OpenLibraryBook[];
}

interface FilterOptions {
  title: string;
  author: string;
  genre: string;
}

type SortColumn = 'title' | 'author' | 'genre';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;
const GENRES = [
  "fiction", "fantasy", "science_fiction", "mystery", 
  "thriller", "romance", "historical_fiction", "biography", 
  "non-fiction", "poetry", "horror", "adventure"
];

const Discover = () => {
  const [books, setBooks] = useState<Book[]>([]); // Existing books in user library
  const [openLibraryBooks, setOpenLibraryBooks] = useState<OpenLibraryBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<OpenLibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<Record<string, boolean>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    title: "",
    author: "",
    genre: ""
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<SortColumn>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const { user } = useAuth();
  
  useEffect(() => {
    fetchUserBooks();
    fetchMixedGenreBooks();
  }, []);

  useEffect(() => {
    applyFiltersAndPagination();
  }, [openLibraryBooks, filters, currentPage, sortColumn, sortDirection]);

  const fetchUserBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      const mappedBooks = data.map(mapDbBookToBook);
      setBooks(mappedBooks);
    } catch (error: any) {
      console.error("Error fetching user books:", error.message);
    }
  };
  
  const fetchMixedGenreBooks = async () => {
    setIsLoading(true);
    try {
      // Select a random genre to feature
      const randomGenres = GENRES.sort(() => 0.5 - Math.random()).slice(0, 3);
      
      // Fetch books from multiple genres
      const promises = randomGenres.map(genre => 
        fetch(`https://openlibrary.org/search.json?subject=${genre}&limit=15`)
          .then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      
      // Combine and shuffle books from different genres
      const allBooks = results.flatMap((data: OpenLibraryResponse) => 
        data.docs.filter(book => book.title && book.author_name)
      );
      
      // Shuffle the books for variety
      const shuffledBooks = allBooks.sort(() => 0.5 - Math.random());
      
      setOpenLibraryBooks(shuffledBooks);
      applyFiltersAndPagination();
    } catch (error: any) {
      console.error("Error fetching books from Open Library:", error.message);
      toast({
        title: "Error fetching books",
        description: "Could not load books from Open Library",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=30`);
      const data: OpenLibraryResponse = await response.json();
      
      setOpenLibraryBooks(data.docs.filter(book => book.title && book.author_name));
      setCurrentPage(1);
      applyFiltersAndPagination();
    } catch (error: any) {
      console.error("Error searching books:", error.message);
      toast({
        title: "Error searching books",
        description: "Could not perform search",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSortChange = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const applyFiltersAndPagination = () => {
    // Apply filters
    let result = [...openLibraryBooks];
    
    if (filters.title) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    
    if (filters.author) {
      result = result.filter(book => 
        book.author_name?.some(author => 
          author.toLowerCase().includes(filters.author.toLowerCase())
        )
      );
    }
    
    if (filters.genre) {
      result = result.filter(book => 
        book.subject?.some(subject => 
          subject.toLowerCase().includes(filters.genre.toLowerCase())
        )
      );
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortColumn === 'title') {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } 
      else if (sortColumn === 'author') {
        const authorA = a.author_name?.[0] || 'Unknown';
        const authorB = b.author_name?.[0] || 'Unknown';
        return sortDirection === 'asc'
          ? authorA.localeCompare(authorB)
          : authorB.localeCompare(authorA);
      }
      else if (sortColumn === 'genre') {
        const genreA = a.subject?.[0] || 'Fiction';
        const genreB = b.subject?.[0] || 'Fiction';
        return sortDirection === 'asc'
          ? genreA.localeCompare(genreB)
          : genreB.localeCompare(genreA);
      }
      return 0;
    });
    
    // Calculate pagination
    const total = Math.ceil(result.length / ITEMS_PER_PAGE);
    setTotalPages(total || 1);
    
    // Ensure current page is valid
    if (currentPage > total && total > 0) {
      setCurrentPage(1);
    }
    
    // Apply pagination
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBooks = result.slice(start, start + ITEMS_PER_PAGE);
    
    setFilteredBooks(paginatedBooks);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const toggleBookSelection = (key: string) => {
    setSelectedBooks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleAddSelectedBooks = async () => {
    const selectedBookKeys = Object.keys(selectedBooks).filter(key => selectedBooks[key]);
    
    if (selectedBookKeys.length === 0) {
      toast({
        title: "No books selected",
        description: "Please select at least one book to add",
        variant: "destructive"
      });
      return;
    }
    
    setIsAdding(true);
    let addedCount = 0;
    
    try {
      for (const key of selectedBookKeys) {
        const book = openLibraryBooks.find(b => b.key === key);
        if (!book) continue;
        
        // Check if book already exists in user's library
        const isBookInLibrary = books.some(
          userBook => userBook.title.toLowerCase() === book.title.toLowerCase() && 
                     userBook.author.toLowerCase() === (book.author_name?.[0] || "Unknown").toLowerCase()
        );
        
        if (isBookInLibrary) {
          continue; // Skip books already in the library
        }
        
        // Create book entry
        const { error } = await supabase
          .from('books')
          .insert({
            user_id: user?.id,
            title: book.title,
            author: book.author_name?.[0] || "Unknown",
            cover_image: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "/placeholder.svg",
            description: "Added from Open Library",
            genre: book.subject?.[0] || "Fiction",
            page_count: book.number_of_pages_median || 200,
            status: "want-to-read",
            is_favorite: false,
            date_added: new Date().toISOString(),
            last_updated: new Date().toISOString()
          });
          
        if (error) throw error;
        addedCount++;
      }
      
      // Clear selections and refresh books
      setSelectedBooks({});
      fetchUserBooks();
      
      toast({
        title: "Books added",
        description: `${addedCount} ${addedCount === 1 ? 'book' : 'books'} added to your library`,
      });
    } catch (error: any) {
      console.error("Error adding books:", error.message);
      toast({
        title: "Error adding books",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="ml-1 h-4 w-4" />
      : <ChevronDown className="ml-1 h-4 w-4" />;
  };
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Discover Books</h1>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 w-full max-w-xl">
          <Input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for books..."
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Search
          </Button>
        </form>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">
          {searchQuery ? `Search results for "${searchQuery}"` : "Discover Books"}
        </h2>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          <Button 
            onClick={handleAddSelectedBooks} 
            disabled={Object.values(selectedBooks).filter(Boolean).length === 0 || isAdding}
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Add Selected Books
          </Button>
        </div>
      </div>
      
      {isFilterOpen && (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
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
      
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-16"></TableHead>
                <TableHead onClick={() => handleSortChange('title')} className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    Title
                    {renderSortIcon('title')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSortChange('author')} className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    Author
                    {renderSortIcon('author')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSortChange('genre')} className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    Genre
                    {renderSortIcon('genre')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => {
                  const isInLibrary = books.some(
                    userBook => userBook.title.toLowerCase() === book.title.toLowerCase() && 
                               userBook.author.toLowerCase() === (book.author_name?.[0] || "Unknown").toLowerCase()
                  );
                  
                  return (
                    <TableRow key={book.key} className={isInLibrary ? "bg-gray-50" : ""}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedBooks[book.key] || false}
                          disabled={isInLibrary}
                          onCheckedChange={() => toggleBookSelection(book.key)}
                          id={`book-${book.key}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="h-12 w-10 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                          {book.cover_i ? (
                            <img 
                              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`} 
                              alt={book.title} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <BookOpen className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {book.title}
                        {isInLibrary && <span className="ml-2 text-xs text-muted-foreground">(Already in library)</span>}
                      </TableCell>
                      <TableCell>{book.author_name?.[0] || "Unknown"}</TableCell>
                      <TableCell>{book.subject?.[0] || "Fiction"}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No books found. Try a different search term or filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          <div className="py-4 border-t">
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
  );
};

export default Discover;
