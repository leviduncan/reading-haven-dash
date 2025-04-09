
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReadingChallenge } from "@/lib/types";
import { mockReadingChallenge } from "@/lib/mock-data";
import BookshelfTabs from "@/components/BookshelfTabs";
import ReadingChallengeCard from "@/components/ReadingChallengeCard";
import { BookOpen, BarChart2, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";
import CurrentlyReadingList from "@/components/CurrentlyReadingList";

const CurrentlyReading = () => {
  const [readingStats, setReadingStats] = useState({
    booksInProgress: 0,
    pagesThisWeek: 0,
    readingStreak: 0,
    avgDailyReading: 0
  });
  const [challenge, setChallenge] = useState<ReadingChallenge | null>(null);
  const [recentlyUpdated, setRecentlyUpdated] = useState<any[]>([]);
  
  useEffect(() => {
    // Set reading stats
    setReadingStats({
      booksInProgress: 0, // Will be updated based on books
      pagesThisWeek: 187,
      readingStreak: 12,
      avgDailyReading: 42
    });
    
    // Set reading challenge
    setChallenge(mockReadingChallenge);
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
          <CurrentlyReadingList showViewAll={false} />
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
