
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/lib/types";
import { mapDbBookToBook } from "@/services/bookService";
import { toast } from "@/components/ui/use-toast";
import BookCard from "@/components/BookCard";
import BookActionButtons from "@/components/BookActionButtons";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

const Discover = () => {
  const [books, setBooks] = useState<Book[]>([]); // Existing books in user library
  const [openLibraryBooks, setOpenLibraryBooks] = useState<OpenLibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<Record<string, boolean>>({});
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchUserBooks();
    fetchPopularBooks();
  }, []);

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
  
  const fetchPopularBooks = async () => {
    setIsLoading(true);
    try {
      // Fetch popular books from Open Library
      const response = await fetch('https://openlibrary.org/search.json?q=subject:fiction&sort=rating&limit=40');
      const data: OpenLibraryResponse = await response.json();
      
      setOpenLibraryBooks(data.docs.filter(book => book.title && book.author_name));
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

  const toggleBookSelection = (key: string) => {
    setSelectedBooks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Discover Books</h1>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 w-full max-w-xl">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for books..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Search
          </Button>
        </form>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {searchQuery ? `Search results for "${searchQuery}"` : "Popular Books"}
        </h2>
        <Button 
          onClick={handleAddSelectedBooks} 
          disabled={Object.values(selectedBooks).filter(Boolean).length === 0 || isAdding}
        >
          {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Add Selected Books
        </Button>
      </div>
      
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
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Genre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openLibraryBooks.length > 0 ? (
                openLibraryBooks.map((book) => {
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
                      <TableCell>{book.number_of_pages_median || "Unknown"}</TableCell>
                      <TableCell>{book.subject?.[0] || "Fiction"}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No books found. Try a different search term.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Discover;
