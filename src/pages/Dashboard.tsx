
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book, ReadingStats } from "@/lib/types";
import { getRecentActivity } from "@/lib/mock-data";
import BookCard from "@/components/BookCard";
import StatCard from "@/components/StatCard";
import ActivityItem from "@/components/ActivityItem";
import { BookOpen, Clock, BarChart2, Star, Search, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchBooksByStatus } from "@/services/bookService";
import { fetchReadingStats } from "@/services/readingService";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [readingStats, setReadingStats] = useState<ReadingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddFirstBook, setShowAddFirstBook] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch currently reading books
        const books = await fetchBooksByStatus('currently-reading');
        setCurrentlyReading(books.slice(0, 3));
        
        // Fetch reading stats
        const stats = await fetchReadingStats();
        if (stats) {
          setReadingStats(stats);
        }
        
        // Get recent activity data (still using mock for now)
        setRecentActivity(getRecentActivity());
        
        // Show dialog if user has no books
        if (books.length === 0) {
          setShowAddFirstBook(true);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load your dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleToggleFavorite = (bookId: string) => {
    // This will be updated in a future implementation
    console.log('Toggle favorite for book:', bookId);
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Reading Dashboard</h2>
      </header>
      
      {/* Currently Reading Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-heading">Currently Reading</h2>
          <Link to="/currently-reading" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : currentlyReading.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentlyReading.map(book => (
              <BookCard 
                key={book.id} 
                book={book}
                showProgress={true}
                actionButtons={
                  <div className="w-full flex flex-col gap-2">
                    <Link
                      to={`/book/${book.id}`}
                      className="w-full text-center px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Continue Reading
                    </Link>
                    <button
                      onClick={() => handleToggleFavorite(book.id)}
                      className="w-full text-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Heart className={`h-4 w-4 ${book.isFavorite ? 'fill-book-favorite text-book-favorite' : ''}`} />
                      {book.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-lg text-muted-foreground mb-4">You're not currently reading any books.</p>
            <Link
              to="/discover"
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Find Books to Read
            </Link>
          </div>
        )}
      </section>
      
      {/* Reading Stats Section */}
      <section className="mb-8">
        <h2 className="section-heading mb-4">Reading Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={<BookOpen className="h-5 w-5" />}
            value={readingStats?.booksRead || 0}
            label="Books Read this year"
          />
          
          <StatCard 
            icon={<Clock className="h-5 w-5" />}
            value={readingStats?.readingTime || 0}
            label="Total reading time"
          />
          
          <StatCard 
            icon={<BarChart2 className="h-5 w-5" />}
            value={readingStats?.currentStreak || 0}
            label="Current streak"
          />
          
          <StatCard 
            icon={<Star className="h-5 w-5" />}
            value={readingStats?.averageRating || 0}
            label="Average rating"
          />
        </div>
      </section>
      
      {/* Discover New Books */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-heading">Discover New Books</h2>
          <Link to="/discover" className="text-sm text-primary hover:underline">
            Browse More
          </Link>
        </div>
        
        <div className="relative bg-gray-100 rounded-lg p-6 flex items-center mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Title, author, or ISBN"
              className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Link to="/discover" className="ml-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            Search
          </Link>
        </div>
      </section>
      
      {/* Recent Activity */}
      <section>
        <h2 className="section-heading mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm p-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <ActivityItem 
                key={activity.id}
                id={activity.id}
                type={activity.type}
                book={activity.book}
                date={activity.date}
                shelf={activity.shelf}
                rating={activity.rating}
              />
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No recent activity to show</p>
            </div>
          )}
        </div>
      </section>

      {/* First book dialog */}
      <Dialog open={showAddFirstBook} onOpenChange={setShowAddFirstBook}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to your reading journey!</DialogTitle>
            <DialogDescription>
              Start by adding your first book to your collection.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              Your personal library is empty. Add books to track your reading progress, set goals, and keep a record of your literary journey.
            </p>
          </div>
          <DialogFooter>
            <Link to="/discover">
              <Button variant="outline">Browse Books</Button>
            </Link>
            <Link to="/add-book">
              <Button>Add Your First Book</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
