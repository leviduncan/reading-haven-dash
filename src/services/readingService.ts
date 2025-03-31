
import { supabase } from "@/integrations/supabase/client";
import { ReadingStats, ReadingChallenge } from "@/lib/types";
import { DbReadingStats, DbReadingChallenge } from "@/types/supabase";
import { toast } from "@/components/ui/use-toast";

// Maps for converting between app types and DB types
export const mapDbStatsToStats = (dbStats: DbReadingStats): ReadingStats => {
  return {
    booksRead: dbStats.books_read,
    totalPages: dbStats.total_pages,
    readingTime: dbStats.reading_time,
    currentStreak: dbStats.current_streak,
    averageRating: Number(dbStats.average_rating)
  };
};

export const mapDbChallengeToChallenge = (dbChallenge: DbReadingChallenge): ReadingChallenge => {
  return {
    id: dbChallenge.id,
    name: dbChallenge.name,
    target: dbChallenge.target,
    current: dbChallenge.current,
    percentage: Number(dbChallenge.percentage)
  };
};

// Reading stats functions
export const fetchReadingStats = async (): Promise<ReadingStats | null> => {
  try {
    const { data, error } = await supabase
      .from('reading_stats')
      .select('*')
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error("Error fetching reading stats:", error);
        toast({
          title: "Error fetching reading stats",
          description: error.message,
          variant: "destructive"
        });
      }
      return null;
    }

    return mapDbStatsToStats(data);
  } catch (err) {
    console.error("Unexpected error fetching reading stats:", err);
    toast({
      title: "Error fetching reading stats",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const updateReadingStats = async (
  stats: Partial<ReadingStats>
): Promise<ReadingStats | null> => {
  try {
    const { data, error } = await supabase
      .from('reading_stats')
      .update({
        books_read: stats.booksRead,
        total_pages: stats.totalPages,
        reading_time: stats.readingTime,
        current_streak: stats.currentStreak,
        average_rating: stats.averageRating,
        last_updated: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error updating reading stats:", error);
      toast({
        title: "Error updating reading stats",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    return mapDbStatsToStats(data);
  } catch (err) {
    console.error("Unexpected error updating reading stats:", err);
    toast({
      title: "Error updating reading stats",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Reading challenge functions
export const fetchReadingChallenges = async (): Promise<ReadingChallenge[]> => {
  try {
    const { data, error } = await supabase
      .from('reading_challenges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching reading challenges:", error);
      toast({
        title: "Error fetching reading challenges",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }

    return (data || []).map(mapDbChallengeToChallenge);
  } catch (err) {
    console.error("Unexpected error fetching reading challenges:", err);
    toast({
      title: "Error fetching reading challenges",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};

export const createReadingChallenge = async (
  challenge: Partial<ReadingChallenge>,
  userId: string
): Promise<ReadingChallenge | null> => {
  try {
    const percentage = challenge.current && challenge.target 
      ? Math.round((challenge.current / challenge.target) * 100 * 100) / 100
      : 0;

    const { data, error } = await supabase
      .from('reading_challenges')
      .insert({
        user_id: userId,
        name: challenge.name!,
        target: challenge.target!,
        current: challenge.current || 0,
        percentage
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating reading challenge:", error);
      toast({
        title: "Error creating reading challenge",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Challenge created",
      description: "Your reading challenge has been created successfully"
    });

    return mapDbChallengeToChallenge(data);
  } catch (err) {
    console.error("Unexpected error creating reading challenge:", err);
    toast({
      title: "Error creating reading challenge",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const updateReadingChallenge = async (
  id: string,
  challenge: Partial<ReadingChallenge>
): Promise<ReadingChallenge | null> => {
  try {
    const { data: currentData } = await supabase
      .from('reading_challenges')
      .select('target, current')
      .eq('id', id)
      .single();
    
    const target = challenge.target ?? currentData?.target ?? 1;
    const current = challenge.current ?? currentData?.current ?? 0;
    const percentage = Math.round((current / target) * 100 * 100) / 100;

    const { data, error } = await supabase
      .from('reading_challenges')
      .update({
        name: challenge.name,
        target,
        current,
        percentage,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating reading challenge:", error);
      toast({
        title: "Error updating reading challenge",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Challenge updated",
      description: "Your reading challenge has been updated successfully"
    });

    return mapDbChallengeToChallenge(data);
  } catch (err) {
    console.error("Unexpected error updating reading challenge:", err);
    toast({
      title: "Error updating reading challenge",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteReadingChallenge = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reading_challenges')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting reading challenge:", error);
      toast({
        title: "Error deleting reading challenge",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Challenge deleted",
      description: "Your reading challenge has been deleted successfully"
    });

    return true;
  } catch (err) {
    console.error("Unexpected error deleting reading challenge:", err);
    toast({
      title: "Error deleting reading challenge",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};
