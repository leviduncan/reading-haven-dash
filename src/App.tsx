
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
