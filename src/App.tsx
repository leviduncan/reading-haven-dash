
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MyBooks from "./pages/MyBooks";
import Discover from "./pages/Discover";
import ReadingStats from "./pages/ReadingStats";
import BookDetails from "./pages/BookDetails";
import CurrentlyReading from "./pages/CurrentlyReading";
import WantToRead from "./pages/WantToRead";
import Completed from "./pages/Completed";
import Favorites from "./pages/Favorites";
import AddReview from "./pages/AddReview";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="my-books" element={<MyBooks />} />
                <Route path="discover" element={<Discover />} />
                <Route path="reading-stats" element={<ReadingStats />} />
                <Route path="book/:id" element={<BookDetails />} />
                <Route path="currently-reading" element={<CurrentlyReading />} />
                <Route path="want-to-read" element={<WantToRead />} />
                <Route path="completed" element={<Completed />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="add-review/:id" element={<AddReview />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);

export default App;
