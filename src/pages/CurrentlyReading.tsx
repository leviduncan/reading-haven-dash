
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book, ReadingChallenge } from "@/lib/types";
import { mockBooks, mockReadingChallenge } from "@/lib/mock-data";
import BookshelfTabs from "@/components/BookshelfTabs";
import ReadingChallengeCard from "@/components/ReadingChallengeCard";
import { BookOpen, BarChart2, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";

const CurrentlyReading = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [readingStats, setReadingStats] = useState({
    booksInProgress: 0,
    pagesThisWeek: 0,
    readingStreak: 0,
    avgDailyReading: 0
  });
  const [challenge, setChallenge] = useState<ReadingChallenge | null>(null);
  const [recentlyUpdated, setRecentlyUpdated] = useState<any[]>([]);
  
  useEffect(() => {
    // Filter books that are currently being read
    const currentBooks = mockBooks.filter(book => book.status === 'currently-reading');
    setBooks(currentBooks);
    
    // Set reading stats
    setReadingStats({
      booksInProgress: currentBooks.length,
      pagesThisWeek: 187,
      readingStreak: 12,
      avgDailyReading: 42
    });
    
    // Set reading challenge
    setChallenge(mockReadingChallenge);
    
    // Set recently updated books
    setRecentlyUpdated(
      currentBooks.map(book => ({
        id: book.id,
        title: book.title,
        lastUpdated: book.lastUpdated || book.dateAdded,
        currentPage: book.progress?.currentPage || 0,
        totalPages: book.pageCount,
        progress: book.progress?.percentage || 0
      }))
    );
  }, []);
  
  const handleUpdateGoal = () => {
    toast.success("Reading goal updated!");
  };
  
  return (
    <div>
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/my-books" className="hover:text-foreground">My Books</Link>
            <span>›</span>
            <span className="text-foreground">Currently Reading</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Currently Reading</h1>
          
          <BookshelfTabs />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* In Progress Section */}
        <section className="mb-10">
          <h2 className="section-heading mb-6">In Progress</h2>
          
          {books.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg text-muted-foreground mb-4">You are not currently reading any books.</p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/discover"
                  className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Discover Books
                </Link>
                <Link
                  to="/want-to-read"
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Want to Read List
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map(book => (
                <div key={book.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="flex p-4 items-center gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={book.coverImage} 
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="text-sm text-muted-foreground">{book.author}</div>
                      <h3 className="font-bold mb-2">{book.title}</h3>
                      
                      {book.progress && (
                        <div className="mb-1 text-sm">
                          Currently on page {book.progress.currentPage} of {book.pageCount} ({book.progress.percentage}%)
                        </div>
                      )}
                      
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                        <div 
                          className="h-full bg-book-progress rounded-full"
                          style={{ width: `${book.progress?.percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t grid grid-cols-2">
                    <Link
                      to={`/book/${book.id}`}
                      className="py-3 text-center font-medium text-primary border-r hover:bg-gray-50 transition-colors"
                    >
                      Continue Reading
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
          )}
        </section>
        
        {/* Reading Statistics */}
        <section className="mb-10">
          <h2 className="section-heading mb-4">Reading Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{readingStats.booksInProgress}</div>
                <div className="text-sm text-muted-foreground">Books in Progress</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <BarChart2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{readingStats.pagesThisWeek}</div>
                <div className="text-sm text-muted-foreground">Pages Read This Week</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{readingStats.readingStreak}</div>
                <div className="text-sm text-muted-foreground">Reading Streak</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{readingStats.avgDailyReading}</div>
                <div className="text-sm text-muted-foreground">Average Daily Reading</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Reading Goals */}
        <section className="mb-10">
          <h2 className="section-heading mb-4">Reading Goals</h2>
          
          {challenge && (
            <ReadingChallengeCard 
              challenge={challenge}
              onUpdate={handleUpdateGoal}
              onViewDetails={() => {}}
            />
          )}
        </section>
        
        {/* Recently Updated */}
        <section>
          <h2 className="section-heading mb-4">Recently Updated</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Book</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Last Updated</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Progress</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {recentlyUpdated.map(book => {
                  // Format the date
                  let updatedText = '';
                  try {
                    const date = new Date(book.lastUpdated);
                    const now = new Date();
                    const diffHours = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60));
                    
                    if (diffHours < 24) {
                      updatedText = diffHours <= 1 ? 'Updated 2 hours ago' : `Updated ${diffHours} hours ago`;
                    } else if (diffHours < 48) {
                      updatedText = 'Updated yesterday';
                    } else if (diffHours < 72) {
                      updatedText = 'Updated 3 days ago';
                    } else {
                      updatedText = `Updated ${date.toLocaleDateString()}`;
                    }
                  } catch (e) {
                    updatedText = 'Unknown date';
                  }
                  
                  return (
                    <tr key={book.id} className="border-b">
                      <td className="py-4 px-4">
                        <Link to={`/book/${book.id}`} className="font-medium hover:underline">
                          {book.title}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {updatedText}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="text-sm whitespace-nowrap">
                            Page {book.currentPage} of {book.totalPages}
                          </div>
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-book-progress rounded-full"
                              style={{ width: `${book.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-sm whitespace-nowrap">
                            {book.progress}% complete
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-sm text-gray-400 hover:text-gray-600">•••</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CurrentlyReading;
