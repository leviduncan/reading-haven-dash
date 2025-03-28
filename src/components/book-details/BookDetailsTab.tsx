
import { Book } from "@/lib/types";
import { BookCopy, Clock, BarChart2 } from "lucide-react";

interface BookDetailsTabProps {
  book: Book;
}

const BookDetailsTab = ({ book }: BookDetailsTabProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Book Summary</h2>
      <p className="mb-6 text-gray-700 leading-relaxed">{book.description}</p>
      
      <h2 className="text-xl font-bold mb-4">Reading Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center p-6 bg-white border rounded-lg">
          <BookCopy className="h-6 w-6 mb-3 text-gray-500" />
          <div className="text-2xl font-bold">{book.pageCount}</div>
          <div className="text-sm text-muted-foreground">Pages</div>
          {book.status === 'completed' && <div className="text-sm">Completed</div>}
        </div>
        
        {book.status === 'currently-reading' && book.progress && (
          <>
            <div className="flex flex-col items-center p-6 bg-white border rounded-lg">
              <Clock className="h-6 w-6 mb-3 text-gray-500" />
              <div className="text-2xl font-bold">7 days</div>
              <div className="text-sm text-muted-foreground">Reading Time</div>
              <div className="text-sm">Apr 27 - May 4, 2023</div>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white border rounded-lg">
              <BarChart2 className="h-6 w-6 mb-3 text-gray-500" />
              <div className="text-2xl font-bold">71</div>
              <div className="text-sm text-muted-foreground">Pages/Day</div>
              <div className="text-sm">Average</div>
            </div>
          </>
        )}
      </div>
      
      {book.status === 'currently-reading' && book.progress && (
        <div className="mt-6">
          <div className="mb-2 flex justify-between">
            <span className="text-sm">Page {book.progress.currentPage} of {book.pageCount}</span>
            <span className="text-sm">{book.progress.percentage}% complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-book-progress rounded-full"
              style={{ width: `${book.progress.percentage}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="mt-8 flex gap-3">
        <button className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
          Add to Favorites
        </button>
        
        <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          Find Similar Books
        </button>
      </div>
    </div>
  );
};

export default BookDetailsTab;
