
import { useEffect, useState } from "react";
import { mockBooks } from "@/lib/mock-data";
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
import { Book, Clock, Calendar, BookOpen, BarChart2, Trophy, Star, ChevronDown } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { fetchReadingStats } from "@/services/readingService";
import { fetchBooks } from "@/services/bookService";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Get current year
const currentYear = new Date().getFullYear();

const ReadingStats = () => {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [availableYears, setAvailableYears] = useState<number[]>([currentYear, currentYear - 1]);
  const [activeTab, setActiveTab] = useState<string>("summary");
  
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [genreStats, setGenreStats] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [yearlyStats, setYearlyStats] = useState<any>({
    booksRead: 0,
    pagesRead: 0,
    readingHours: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageRating: 0
  });
  
  // Fetch real book data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch books
        const booksData = await fetchBooks();
        setBooks(booksData);
        
        // Get all years from book data (started or finished reading)
        const years = new Set<number>();
        years.add(currentYear);
        years.add(currentYear - 1);
        
        booksData.forEach(book => {
          if (book.startedReading) {
            const year = new Date(book.startedReading).getFullYear();
            years.add(year);
          }
          if (book.finishedReading) {
            const year = new Date(book.finishedReading).getFullYear();
            years.add(year);
          }
        });
        
        setAvailableYears(Array.from(years).sort((a, b) => b - a));
        
        // Fetch stats from service if needed
        const stats = await fetchReadingStats();
        if (stats) {
          setYearlyStats(prev => ({
            ...prev,
            booksRead: stats.booksRead,
            readingHours: stats.readingTime,
            currentStreak: stats.currentStreak,
            averageRating: stats.averageRating
          }));
        }
        
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
  }, []);
  
  // Update stats when year changes
  useEffect(() => {
    // Filter books by the selected year
    const booksInSelectedYear = books.filter(book => {
      const startYear = book.startedReading ? new Date(book.startedReading).getFullYear() : null;
      const endYear = book.finishedReading ? new Date(book.finishedReading).getFullYear() : null;
      
      return startYear === selectedYear || endYear === selectedYear;
    });
    
    // Generate monthly reading stats for selected year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((month, index) => {
      const monthIndex = index;
      
      // Count books completed this month in the selected year
      const booksCompletedThisMonth = booksInSelectedYear.filter(book => {
        if (!book.finishedReading) return false;
        const finishDate = new Date(book.finishedReading);
        return finishDate.getMonth() === monthIndex && finishDate.getFullYear() === selectedYear;
      }).length;
      
      // Estimate pages read (using actual data or mockup)
      const pagesRead = booksCompletedThisMonth * 300 + Math.floor(Math.random() * 200);
      const hoursRead = pagesRead / 30; // Assume 30 pages per hour
      
      return {
        month,
        booksCompleted: booksCompletedThisMonth,
        pagesRead,
        hoursRead: Math.round(hoursRead)
      };
    });
    
    setMonthlyStats(monthlyData);
    
    // Calculate total pages read this year
    const totalPagesRead = booksInSelectedYear.reduce((total, book) => {
      if (book.status === 'completed' && book.finishedReading && 
          new Date(book.finishedReading).getFullYear() === selectedYear) {
        return total + book.pageCount;
      }
      return total;
    }, 0);
    
    // Update yearly stats
    setYearlyStats(prev => ({
      ...prev,
      pagesRead: totalPagesRead || 4672, // Fallback if no real data
      booksRead: booksInSelectedYear.filter(book => 
        book.status === 'completed' && 
        book.finishedReading && 
        new Date(book.finishedReading).getFullYear() === selectedYear
      ).length || prev.booksRead
    }));
    
    // Calculate genre stats
    const allBooks = selectedYear === currentYear ? books : booksInSelectedYear;
    const genreCounts: Record<string, number> = {};
    
    allBooks.forEach(book => {
      const mainGenre = book.genre?.split(',')[0]?.trim() || 'Unknown';
      genreCounts[mainGenre] = (genreCounts[mainGenre] || 0) + 1;
    });
    
    const genreData = Object.entries(genreCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    setGenreStats(genreData);
    
  }, [selectedYear, books]);
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl">Reading Stats</h1>
        
        <div className="flex items-center gap-4">
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detail">Detailed Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-6">
          {/* This Year Summary */}
          <section className="mb-10">
            <h2 className="section-heading mb-4">{selectedYear === currentYear ? "This Year" : selectedYear}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white  shadow-sm p-6 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Book className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{yearlyStats.booksRead}</div>
                  <div className="text-sm text-muted-foreground">Books Read</div>
                </div>
              </div>
              
              <div className="bg-white  shadow-sm p-6 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{yearlyStats.pagesRead.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Pages Read</div>
                </div>
              </div>
              
              <div className="bg-white  shadow-sm p-6 flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{yearlyStats.readingHours}</div>
                  <div className="text-sm text-muted-foreground">Hours Reading</div>
                </div>
              </div>
              
              <div className="bg-white  shadow-sm p-6 flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{yearlyStats.currentStreak}</div>
                  <div className="text-sm text-muted-foreground">Current Streak</div>
                </div>
              </div>
              
              <div className="bg-white  shadow-sm p-6 flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <BarChart2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{yearlyStats.longestStreak}</div>
                  <div className="text-sm text-muted-foreground">Longest Streak</div>
                </div>
              </div>
              
              <div className="bg-white  shadow-sm p-6 flex items-center gap-4">
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
            <div className="bg-white  shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold">{selectedYear} Reading Challenge</h2>
              </div>
              
              <p className="mb-3">You've read {yearlyStats.booksRead} of 24 books ({Math.round((yearlyStats.booksRead / 24) * 100)}%)</p>
              
              <ProgressBar 
                value={yearlyStats.booksRead} 
                max={24} 
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
        </TabsContent>
        
        <TabsContent value="detail" className="mt-6">
          {/* Monthly Reading */}
          <section className="mb-10">
            <h2 className="section-heading mb-4">Monthly Reading Activity</h2>
            <div className="bg-white  shadow-sm p-6">
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
            <div className="bg-white  shadow-sm overflow-hidden">
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
                <button className="px-6 py-2 border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
                  View Full History
                </button>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReadingStats;
