
import { Heart, BookOpen, User, Library } from "lucide-react";

interface StatsCardProps {
  icon: "heart" | "library" | "user" | "book";
  value: string | number;
  label: string;
  sublabel: string;
}

const FavoriteStatsCard = ({ icon, value, label, sublabel }: StatsCardProps) => {
  const getIconComponent = () => {
    switch (icon) {
      case "heart":
        return <Heart className="h-6 w-6 text-red-600" />;
      case "library":
        return <Library className="h-6 w-6 text-blue-600" />;
      case "user":
        return <User className="h-6 w-6 text-purple-600" />;
      case "book":
        return <BookOpen className="h-6 w-6 text-yellow-600" />;
      default:
        return <Heart className="h-6 w-6 text-red-600" />;
    }
  };

  const getBgColor = () => {
    switch (icon) {
      case "heart":
        return "bg-red-100";
      case "library":
        return "bg-blue-100";
      case "user":
        return "bg-purple-100";
      case "book":
        return "bg-yellow-100";
      default:
        return "bg-red-100";
    }
  };

  return (
    <div className="bg-white  shadow-sm p-6 flex items-center gap-4">
      <div className={`${getBgColor()} p-3 rounded-full`}>
        {getIconComponent()}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{sublabel}</div>
      </div>
    </div>
  );
};

export default FavoriteStatsCard;
