
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  className?: string;
}

const StatCard = ({ icon, value, label, className = "" }: StatCardProps) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="flex flex-col">
        <div className="mb-2 text-muted-foreground">
          {icon}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
