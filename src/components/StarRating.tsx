
import { useState } from "react";

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
      className="star-rating" 
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: count }).map((_, index) => {
        const filled = (hoverValue !== null ? index < hoverValue : index < value);
        
        return (
          <svg 
            key={index}
            className={`${sizeClass} ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} ${!disabled && 'cursor-pointer'} transition-colors`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            onClick={() => handleClick(index)}
            onMouseOver={() => handleMouseOver(index)}
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
