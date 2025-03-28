
interface ProgressBarProps {
  value: number;
  max: number;
  showText?: boolean;
  className?: string;
}

const ProgressBar = ({ value, max, showText = true, className = "" }: ProgressBarProps) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  return (
    <div className={className}>
      {showText && (
        <div className="flex justify-between items-center text-xs mb-1">
          <span>{value} of {max}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="progress-bar">
        <div 
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
