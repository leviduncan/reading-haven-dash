
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

const UserAuthButtons = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = () => {
    if (!user) return "U";
    if (user.user_metadata?.username) {
      return user.user_metadata.username.substring(0, 2).toUpperCase();
    }
    return user.email?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={user.email || "User"} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium hidden md:inline-block">
          {user.user_metadata?.username || user.email}
        </span>
      </div>
      <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default UserAuthButtons;
