
import { Book } from "@/lib/types";
import { BookCopy, Clock, BarChart2 } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBookProgress } from "@/services/bookService";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface BookDetailsTabProps {
  book: Book;
}

const BookDetailsTab = ({ book }: BookDetailsTabProps) => {
  const [currentPage, setCurrentPage] = useState<number>(book.progress?.currentPage || 0);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    book.lastUpdated ? new Date(book.lastUpdated) : new Date()
  );

  const handleUpdateProgress = async () => {
    if (currentPage > book.pageCount) {
      toast({
        title: "Invalid page number",
        description: `Page number cannot exceed the total pages (${book.pageCount})`,
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingProgress(true);
    try {
      await updateBookProgress(book.id, currentPage, book.pageCount);
      
      toast({
        title: "Progress updated",
        description: "Your reading progress has been updated successfully",
      });
      
      setIsProgressDialogOpen(false);
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error updating progress",
        description: "Failed to update your reading progress",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  // Calculate reading stats
  const daysReading = book.startedReading 
    ? Math.ceil((new Date().getTime() - new Date(book.startedReading).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const pagesPerDay = daysReading > 0 && book.progress 
    ? Math.round(book.progress.currentPage / daysReading)
    : 0;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Book Summary</h2>
      <p className="mb-6 text-gray-700 leading-relaxed">{book.description}</p>
      
      <h2 className="text-xl font-bold mb-4">Reading Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center p-6 bg-white border ">
          <BookCopy className="h-6 w-6 mb-3 text-gray-500" />
          <div className="text-2xl font-bold">{book.pageCount}</div>
          <div className="text-sm text-muted-foreground">Pages</div>
          {book.status === 'completed' && <div className="text-sm">Completed</div>}
        </div>
        
        {book.status === 'currently-reading' && book.progress && (
          <>
            <div className="flex flex-col items-center p-6 bg-white border ">
              <Clock className="h-6 w-6 mb-3 text-gray-500" />
              <div className="text-2xl font-bold">{daysReading || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Reading Time</div>
              <div className="text-sm">
                {book.startedReading 
                  ? `${format(new Date(book.startedReading), 'MMM d, yyyy')} - Present` 
                  : 'Not started yet'}
              </div>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white border ">
              <BarChart2 className="h-6 w-6 mb-3 text-gray-500" />
              <div className="text-2xl font-bold">{pagesPerDay || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Pages/Day</div>
              <div className="text-sm">Average</div>
            </div>
          </>
        )}
      </div>
      
      {book.status !== 'want-to-read' && (
        <div className="mt-6">
          <div className="mb-2 flex justify-between">
            <span className="text-sm">
              Page {book.progress?.currentPage || 0} of {book.pageCount}
            </span>
            <span className="text-sm">{book.progress?.percentage || 0}% complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-book-progress rounded-full"
              style={{ width: `${book.progress?.percentage || 0}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="mt-8 flex gap-3">
        <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Update Progress</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Reading Progress</DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div>
                <label htmlFor="currentPage" className="block text-sm font-medium mb-1">
                  Current Page
                </label>
                <Input
                  id="currentPage"
                  type="number"
                  min={0}
                  max={book.pageCount}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Page {currentPage} of {book.pageCount} 
                  ({Math.round((currentPage / book.pageCount) * 100)}%)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border rounded-md"
                  disabled={(date) => date > new Date()}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProgressDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateProgress}
                disabled={isUpdatingProgress}
              >
                {isUpdatingProgress ? 'Updating...' : 'Update Progress'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button variant="outline">Add to Favorites</Button>
      </div>
    </div>
  );
};

export default BookDetailsTab;
