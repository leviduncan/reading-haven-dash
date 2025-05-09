
import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutGrid, BookOpen, Search, BarChart2, BookMarked, ListTodo, CheckCircle, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserAuthButtons from "./UserAuthButtons";

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside className={`w-56 border-r bg-sidebar flex flex-col fixed top-0 left-0 bottom-0 z-20  
                  transform transition-transform duration-300 ease-in-out shadow-md bg-stone-300
                  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                  md:translate-x-0 md:w-56 md:shadow-none`}>
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

        {/* User Section - Updated to use UserAuthButtons which contains the user info */}
        <div className="p-4 border-t bg-neutral-400">
          <UserAuthButtons />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full md:ml-56 bg-stone-200">
        <button className="fixed top-4 right-4 z-20 md:hidden py-3 px-4 bg-sidebar rounded " onClick={toggleSidebar}>
          ☰
        </button>

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
