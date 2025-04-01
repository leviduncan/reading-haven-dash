
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const UserAuthButtons = () => {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!user) {
    return null;
  }

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isSigningOut) return;
    
    try {
      setIsSigningOut(true);
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account"
      });
    } catch (error) {
      console.error("Error during sign out:", error);
      toast({
        title: "Sign out error",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSigningOut(false);
    }
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
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleSignOut} 
        title="Sign out"
        disabled={isSigningOut}
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default UserAuthButtons;
