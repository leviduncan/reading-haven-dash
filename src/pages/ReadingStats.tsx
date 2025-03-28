import { useEffect, useState } from "react";
import { mockBooks, mockReadingChallenge, mockReadingStats } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import { Book, Clock, Calendar, BookOpen, BarChart2, Trophy, Star } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";

const ReadingStats = () => {
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [genreStats, setGenreStats] = useState<any[]>([]);
  const [yearlyStats, setYearlyStats] = useState<any>({
    booksRead: 0,
    pagesRead: 0,
    readingHours: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageRating: 0
  });
  
  useEffect(() => {
    // Generate monthly reading stats
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mockMonthlyData = months.map((month, index) => {
      // Generate some sample data
      const booksCompleted = Math.floor(Math.random() * 3) + (index === 4 ? 5 : 0); // More books in May
      const pagesRead = booksCompleted * 300 + Math.floor(Math.random() * 200);
      const hoursRead = pagesRead / 30; // Assume 30 pages per hour
      
      return {
        month,
        booksCompleted,
        pagesRead,
        hoursRead: Math.round(hoursRead)
      };
    });
    setMonthlyStats(mockMonthlyData);
    
    // Generate genre stats
    const books = mockBooks;
    const genreCounts: Record<string, number> = {};
    
    books.forEach(book => {
      const mainGenre = book.genre.split(',')[0].trim();
      genreCounts[mainGenre] = (genreCounts[mainGenre] || 0) + 1;
    });
    
    const genreData = Object.entries(genreCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    setGenreStats(genreData);
    
    // Set yearly stats
    setYearlyStats({
      booksRead: mockReadingStats.booksRead,
      pagesRead: 4672,
      readingHours: mockReadingStats.readingTime,
      currentStreak: mockReadingStats.currentStreak,
      longestStreak: 14,
      averageRating: mockReadingStats.averageRating
    });
  }, []);
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Reading Stats</h1>
      </header>
      
      {/* This Year Summary */}
      <section className="mb-10">
        <h2 className="section-heading mb-4">This Year</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Book className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{yearlyStats.booksRead}</div>
              <div className="text-sm text-muted-foreground">Books Read</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{yearlyStats.pagesRead.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Pages Read</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{yearlyStats.readingHours}</div>
              <div className="text-sm text-muted-foreground">Hours Reading</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{yearlyStats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <BarChart2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{yearlyStats.longestStreak}</div>
              <div className="text-sm text-muted-foreground">Longest Streak</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{yearlyStats.averageRating.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Reading Challenge */}
      <section className="mb-10">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold">2023 Reading Challenge</h2>
          </div>
          
          <p className="mb-3">You've read {mockReadingChallenge.current} of {mockReadingChallenge.target} books ({mockReadingChallenge.percentage}%)</p>
          
          <ProgressBar 
            value={mockReadingChallenge.current} 
            max={mockReadingChallenge.target} 
            className="mb-6"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Books Per Month</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="booksCompleted" fill="#3b82f6" name="Books Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Reading By Genre</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={genreStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {genreStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
      
      {/* Monthly Reading */}
      <section className="mb-10">
        <h2 className="section-heading mb-4">Monthly Reading Activity</h2>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyStats}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="pagesRead" name="Pages Read" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="hoursRead" name="Hours Read" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      
      {/* Reading History */}
      <section>
        <h2 className="section-heading mb-4">Reading History</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="font-medium mb-2">Monthly Summary</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Month</th>
                  <th className="text-left py-2">Books Completed</th>
                  <th className="text-left py-2">Pages Read</th>
                  <th className="text-left py-2">Hours Reading</th>
                </tr>
              </thead>
              <tbody>
                {monthlyStats.slice().reverse().map((month, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{month.month}</td>
                    <td className="py-2">{month.booksCompleted}</td>
                    <td className="py-2">{month.pagesRead}</td>
                    <td className="py-2">{month.hoursRead}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6">
            <button className="px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
              View Full History
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReadingStats;
