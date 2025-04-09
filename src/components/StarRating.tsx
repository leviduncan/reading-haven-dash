
import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  count?: number;
  disabled?: boolean;
}

const StarRating = ({ 
  value, 
  onChange, 
  size = "md", 
  count = 5,
  disabled = false 
}: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }[size];
  
  const handleClick = (index: number) => {
    if (!disabled && onChange) {
      onChange(index + 1);
    }
  };
  
  const handleMouseOver = (index: number) => {
    if (!disabled) {
      setHoverValue(index + 1);
    }
  };
  
  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverValue(null);
    }
  };
  
  return (
    <div 
      className="star-rating flex" 
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: count }).map((_, index) => {
        const filled = (hoverValue !== null ? index < hoverValue : index < value);
        
        return (
          <Star
            key={index}
            className={`${sizeClass} ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} ${!disabled && 'cursor-pointer'} transition-colors mr-0.5`}
            onClick={() => handleClick(index)}
            onMouseOver={() => handleMouseOver(index)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
