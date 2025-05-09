import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/lib/types";
import { DbBook, BookStatus } from "@/types/supabase";
import { toast } from "@/components/ui/use-toast";

export const mapDbBookToBook = (dbBook: DbBook): Book => {
  return {
    id: dbBook.id,
    title: dbBook.title,
    author: dbBook.author,
    coverImage: dbBook.cover_image,
    description: dbBook.description,
    genre: dbBook.genre,
    pageCount: dbBook.page_count,
    progress: dbBook.progress_percentage ? {
      currentPage: dbBook.current_page || 0,
      percentage: Number(dbBook.progress_percentage)
    } : undefined,
    startedReading: dbBook.started_reading,
    finishedReading: dbBook.finished_reading,
    rating: dbBook.rating || undefined,
    status: dbBook.status,
    isFavorite: dbBook.is_favorite,
    dateAdded: dbBook.date_added,
    lastUpdated: dbBook.last_updated
  };
};

export const mapBookToDbBook = (book: Partial<Book>, userId: string): Partial<DbBook> => {
  const status = book.status as BookStatus;
  
  return {
    user_id: userId,
    title: book.title,
    author: book.author,
    cover_image: book.coverImage,
    description: book.description,
    genre: book.genre,
    page_count: book.pageCount,
    current_page: book.progress?.currentPage || null,
    progress_percentage: book.progress?.percentage || null,
    started_reading: book.startedReading || null,
    finished_reading: book.finishedReading || null,
    rating: book.rating || null,
    status: status,
    is_favorite: book.isFavorite
  };
};

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('last_updated', { ascending: false });

    if (error) {
      console.error("Error fetching books:", error);
      toast({
        title: "Error fetching books",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }

    return (data || []).map(mapDbBookToBook);
  } catch (err) {
    console.error("Unexpected error fetching books:", err);
    toast({
      title: "Error fetching books",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};

export const fetchBooksByStatus = async (status: BookStatus): Promise<Book[]> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('status', status)
      .order('last_updated', { ascending: false });

    if (error) {
      console.error(`Error fetching ${status} books:`, error);
      toast({
        title: `Error fetching ${status} books`,
        description: error.message,
        variant: "destructive"
      });
      return [];
    }

    return (data || []).map(mapDbBookToBook);
  } catch (err) {
    console.error(`Unexpected error fetching ${status} books:`, err);
    toast({
      title: `Error fetching ${status} books`,
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};

export const fetchBook = async (id: string): Promise<Book | null> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching book:", error);
      toast({
        title: "Error fetching book",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    return mapDbBookToBook(data as DbBook);
  } catch (err) {
    console.error("Unexpected error fetching book:", err);
    toast({
      title: "Error fetching book",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const createBook = async (book: Partial<Book>, userId: string): Promise<Book | null> => {
  try {
    const dbBook = mapBookToDbBook(book, userId);
    
    if (!dbBook.title || !dbBook.author || !dbBook.cover_image || !dbBook.description || 
        !dbBook.genre || !dbBook.page_count || !dbBook.status) {
      toast({
        title: "Error creating book",
        description: "Required fields are missing",
        variant: "destructive"
      });
      return null;
    }
    
    const insertData = {
      user_id: userId,
      title: dbBook.title,
      author: dbBook.author,
      cover_image: dbBook.cover_image,
      description: dbBook.description,
      genre: dbBook.genre,
      page_count: dbBook.page_count,
      current_page: dbBook.current_page,
      progress_percentage: dbBook.progress_percentage,
      started_reading: dbBook.started_reading,
      finished_reading: dbBook.finished_reading,
      rating: dbBook.rating,
      status: dbBook.status,
      is_favorite: dbBook.is_favorite
    };
    
    const { data, error } = await supabase
      .from('books')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating book:", error);
      toast({
        title: "Error creating book",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Book added",
      description: "Your book has been added successfully"
    });

    return mapDbBookToBook(data as DbBook);
  } catch (err) {
    console.error("Unexpected error creating book:", err);
    toast({
      title: "Error creating book",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const updateBook = async (id: string, book: Partial<Book>, userId: string): Promise<Book | null> => {
  try {
    const dbBook = mapBookToDbBook(book, userId);
    
    const { data, error } = await supabase
      .from('books')
      .update({
        ...dbBook,
        last_updated: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating book:", error);
      toast({
        title: "Error updating book",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Book updated",
      description: "Your book has been updated successfully"
    });

    return mapDbBookToBook(data as DbBook);
  } catch (err) {
    console.error("Unexpected error updating book:", err);
    toast({
      title: "Error updating book",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const updateBookProgress = async (
  id: string, 
  currentPage: number, 
  totalPages: number
): Promise<Book | null> => {
  try {
    const percentage = Math.min(Math.round((currentPage / totalPages) * 100 * 100) / 100, 100);
    
    const { data: currentBook } = await supabase
      .from('books')
      .select('status, current_page, page_count')
      .eq('id', id)
      .single();
    
    const wasCompleted = currentBook?.current_page === currentBook?.page_count;
    const isNowCompleted = currentPage === totalPages;
    
    const updates: any = {
      current_page: currentPage,
      progress_percentage: percentage,
      last_updated: new Date().toISOString()
    };
    
    if (!wasCompleted && isNowCompleted) {
      updates.status = 'completed';
      updates.finished_reading = new Date().toISOString();
    }
    
    if (currentBook?.current_page === 0 && currentPage > 0) {
      updates.started_reading = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating book progress:", error);
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    if (!wasCompleted && isNowCompleted) {
      try {
        const { data: statsData } = await supabase
          .from('reading_stats')
          .select('*')
          .single();
        
        if (statsData) {
          await supabase
            .from('reading_stats')
            .update({
              books_read: (statsData.books_read || 0) + 1,
              total_pages: (statsData.total_pages || 0) + totalPages,
              last_updated: new Date().toISOString()
            });
        }
      } catch (statsError) {
        console.error("Error updating reading stats:", statsError);
      }
    }

    return mapDbBookToBook(data as DbBook);
  } catch (err) {
    console.error("Unexpected error updating book progress:", err);
    toast({
      title: "Error updating progress",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const toggleBookFavorite = async (id: string, isFavorite: boolean): Promise<Book | null> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .update({
        is_favorite: isFavorite,
        last_updated: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling favorite status:", error);
      toast({
        title: "Error updating favorite status",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    return mapDbBookToBook(data as DbBook);
  } catch (err) {
    console.error("Unexpected error toggling favorite status:", err);
    toast({
      title: "Error updating favorite status",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteBook = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error deleting book",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Book deleted",
      description: "Your book has been deleted successfully"
    });

    return true;
  } catch (err) {
    console.error("Unexpected error deleting book:", err);
    toast({
      title: "Error deleting book",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};
