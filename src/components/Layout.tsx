
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutGrid, BookOpen, Search, BarChart2, BookMarked, ListTodo, CheckCircle, Heart } from "lucide-react";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 border-r bg-sidebar flex flex-col">
        <div className="p-4 font-bold text-xl flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span>BookTracker</span>
          </Link>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink
            to="/my-books"
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
          >
            <BookOpen className="h-4 w-4" />
            <span>My Books</span>
          </NavLink>
          
          <NavLink
            to="/discover"
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
          >
            <Search className="h-4 w-4" />
            <span>Discover</span>
          </NavLink>
          
          <NavLink
            to="/reading-stats"
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Reading Stats</span>
          </NavLink>
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              BOOKSHELVES
            </p>
          </div>
          
          <NavLink
            to="/currently-reading"
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
          >
            <BookMarked className="h-4 w-4" />
            <span>Currently Reading</span>
          </NavLink>
          
          <NavLink
            to="/want-to-read"
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
          >
            <ListTodo className="h-4 w-4" />
            <span>Want to Read</span>
          </NavLink>
          
          <NavLink
            to="/completed"
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
          >
            <CheckCircle className="h-4 w-4" />
            <span>Completed</span>
          </NavLink>
          
          <NavLink
            to="/favorites"
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
          >
            <Heart className="h-4 w-4" />
            <span>Favorites</span>
          </NavLink>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            <img
              src="https://ui-avatars.com/api/?name=Alex+Johnson&background=random"
              alt="Alex Johnson"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Alex Johnson</span>
            <span className="text-xs text-muted-foreground">alex@example.com</span>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
