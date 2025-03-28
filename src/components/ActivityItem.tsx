
import { CheckCircle, Play, BookPlus, Star } from "lucide-react";
import { useState } from "react";

interface ActivityItemProps {
  id: string;
  type: 'finished' | 'started' | 'added' | 'rated';
  book: string;
  date: string;
  shelf?: string;
  rating?: number;
}

const ActivityItem = ({ type, book, date, shelf, rating }: ActivityItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getIcon = () => {
    switch (type) {
      case 'finished':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'started':
        return <Play className="h-5 w-5 text-blue-500" />;
      case 'added':
        return <BookPlus className="h-5 w-5 text-purple-500" />;
      case 'rated':
        return <Star className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  const getMessage = () => {
    switch (type) {
      case 'finished':
        return (
          <>
            Finished <span className="font-semibold">'{book}'</span>
          </>
        );
      case 'started':
        return (
          <>
            Started <span className="font-semibold">'{book}'</span>
          </>
        );
      case 'added':
        return (
          <>
            Added <span className="font-semibold">'{book}'</span> to {shelf}
          </>
        );
      case 'rated':
        return (
          <>
            Rated <span className="font-semibold">'{book}'</span> {rating} stars
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-3 flex items-start">
      <div className="bg-gray-100 rounded-full p-2 mr-3">
        {getIcon()}
      </div>
      
      <div className="flex-1">
        <div className="font-medium">{getMessage()}</div>
        <div className="text-sm text-muted-foreground">{date}</div>
      </div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  );
};

export default ActivityItem;
