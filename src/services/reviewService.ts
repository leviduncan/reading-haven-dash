
import { supabase } from "@/integrations/supabase/client";
import { Review } from "@/lib/types";
import { DbReview } from "@/types/supabase";
import { toast } from "@/components/ui/use-toast";

// Convert database review to application review
export const mapDbReviewToReview = (dbReview: DbReview): Review => {
  return {
    id: dbReview.id,
    bookId: dbReview.book_id,
    title: dbReview.title,
    content: dbReview.content,
    rating: dbReview.rating,
    dateStarted: dbReview.date_started || undefined,
    dateFinished: dbReview.date_finished || undefined,
    isPublic: dbReview.is_public,
    isFavorite: dbReview.is_favorite,
    createdAt: dbReview.created_at
  };
};

// Convert application review to database review
export const mapReviewToDbReview = (review: Partial<Review>, userId: string): Partial<DbReview> => {
  // Make sure all required fields are present
  const dbReview: Partial<DbReview> = {
    user_id: userId,
    book_id: review.bookId!,
    title: review.title!,
    content: review.content!,
    rating: review.rating!,
    date_started: review.dateStarted || null,
    date_finished: review.dateFinished || null,
    is_public: review.isPublic ?? true,
    is_favorite: review.isFavorite ?? false
  };
  
  return dbReview;
};

export const fetchReviewsByBookId = async (bookId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error fetching reviews",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }

    return (data || []).map(review => mapDbReviewToReview(review as DbReview));
  } catch (err) {
    console.error("Unexpected error fetching reviews:", err);
    toast({
      title: "Error fetching reviews",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};

export const createReview = async (review: Partial<Review>, userId: string): Promise<Review | null> => {
  try {
    const dbReview = mapReviewToDbReview(review, userId);
    
    // Validate required fields
    if (!dbReview.book_id || !dbReview.title || !dbReview.content || 
        dbReview.rating === undefined || dbReview.rating === null) {
      toast({
        title: "Error creating review",
        description: "Required fields are missing",
        variant: "destructive"
      });
      return null;
    }
    
    // Create a complete object with all required fields for insert
    const insertData = {
      user_id: userId,
      book_id: dbReview.book_id,
      title: dbReview.title,
      content: dbReview.content,
      rating: dbReview.rating,
      date_started: dbReview.date_started,
      date_finished: dbReview.date_finished,
      is_public: dbReview.is_public,
      is_favorite: dbReview.is_favorite
    };
    
    const { data, error } = await supabase
      .from('reviews')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating review:", error);
      toast({
        title: "Error creating review",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Review added",
      description: "Your review has been added successfully"
    });

    return mapDbReviewToReview(data as DbReview);
  } catch (err) {
    console.error("Unexpected error creating review:", err);
    toast({
      title: "Error creating review",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const updateReview = async (id: string, review: Partial<Review>, userId: string): Promise<Review | null> => {
  try {
    const dbReview = mapReviewToDbReview(review, userId);
    
    const { data, error } = await supabase
      .from('reviews')
      .update(dbReview)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating review:", error);
      toast({
        title: "Error updating review",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Review updated",
      description: "Your review has been updated successfully"
    });

    return mapDbReviewToReview(data as DbReview);
  } catch (err) {
    console.error("Unexpected error updating review:", err);
    toast({
      title: "Error updating review",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteReview = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error deleting review",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Review deleted",
      description: "Your review has been deleted successfully"
    });

    return true;
  } catch (err) {
    console.error("Unexpected error deleting review:", err);
    toast({
      title: "Error deleting review",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};
