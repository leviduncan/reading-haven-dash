
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "@/lib/types";
import { mockBooks, mockReadingStats, getRecentActivity } from "@/lib/mock-data";
import BookCard from "@/components/BookCard";
import StatCard from "@/components/StatCard";
import ActivityItem from "@/components/ActivityItem";
import { BookOpen, Clock, BarChart2, Star, Search } from "lucide-react";

const Dashboard = () => {
  const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
  useEffect(() => {
    // Filter books that are currently being read
    const reading = mockBooks.filter(book => book.status === 'currently-reading');
    setCurrentlyReading(reading);
    
    // Get recent activity data
    setRecentActivity(getRecentActivity());
  }, []);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Reading Dashboard</h1>
      </header>
      
      {/* Currently Reading Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-heading">Currently Reading</h2>
          <Link to="/currently-reading" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>
        
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
                  <Link
                    to={`/book/${book.id}`}
                    className="w-full text-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Details
                  </Link>
                </div>
              }
            />
          ))}
        </div>
      </section>
      
      {/* Reading Stats Section */}
      <section className="mb-8">
        <h2 className="section-heading mb-4">Reading Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={<BookOpen className="h-5 w-5" />}
            value={mockReadingStats.booksRead}
            label="Books Read this year"
          />
          
          <StatCard 
            icon={<Clock className="h-5 w-5" />}
            value={mockReadingStats.readingTime}
            label="Total reading time"
          />
          
          <StatCard 
            icon={<BarChart2 className="h-5 w-5" />}
            value={mockReadingStats.currentStreak}
            label="Current streak"
          />
          
          <StatCard 
            icon={<Star className="h-5 w-5" />}
            value={mockReadingStats.averageRating}
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
          <button className="ml-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            Search
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockBooks.slice(0, 4).map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img 
                src={book.coverImage} 
                alt={book.title}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      </section>
      
      {/* Recent Activity */}
      <section>
        <h2 className="section-heading mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm p-4">
          {recentActivity.map((activity) => (
            <ActivityItem 
              key={activity.id}
              id={activity.id}
              type={activity.type}
              book={activity.book}
              date={activity.date}
              shelf={activity.shelf}
              rating={activity.rating}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
