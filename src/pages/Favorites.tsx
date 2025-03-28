
import { Link } from "react-router-dom";
import BookshelfTabs from "@/components/BookshelfTabs";
import CollectionOverview from "@/components/favorites/CollectionOverview";
import RecentlyAddedSection from "@/components/favorites/RecentlyAddedSection";
import FavoritesTable from "@/components/favorites/FavoritesTable";

const Favorites = () => {
  return (
    <div>
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/my-books" className="hover:text-foreground">My Books</Link>
            <span>›</span>
            <span className="text-foreground">Favorites</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Favorite Books</h1>
          
          <BookshelfTabs />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        <CollectionOverview />
        <RecentlyAddedSection />
        <FavoritesTable />
      </div>
    </div>
  );
};

export default Favorites;
