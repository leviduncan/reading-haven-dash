
import { ReadingChallenge } from "@/lib/types";
import { Trophy } from "lucide-react";
import ProgressBar from "./ProgressBar";

interface ReadingChallengeCardProps {
  challenge: ReadingChallenge;
  onUpdate?: () => void;
  onViewDetails?: () => void;
}

const ReadingChallengeCard = ({ 
  challenge, 
  onUpdate, 
  onViewDetails 
}: ReadingChallengeCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-yellow-100 p-2 rounded-full">
          <Trophy className="h-6 w-6 text-yellow-600" />
        </div>
        <h3 className="text-lg font-bold">{challenge.name}</h3>
      </div>
      
      <p className="mb-3">You've read {challenge.current} of {challenge.target} books ({challenge.percentage}%)</p>
      
      <ProgressBar 
        value={challenge.current} 
        max={challenge.target} 
        showText={false}
        className="mb-4"
      />
      
      <div className="flex gap-3">
        <button
          onClick={onUpdate}
          className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Update Goal
        </button>
        
        <button
          onClick={onViewDetails}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ReadingChallengeCard;
