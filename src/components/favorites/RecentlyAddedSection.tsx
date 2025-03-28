
import { useAppSelector } from "@/lib/redux/hooks";
import RecentlyAddedCard from "./RecentlyAddedCard";
import { Link } from "react-router-dom";

const RecentlyAddedSection = () => {
  const { recentlyAdded } = useAppSelector(state => state.favorites);
  
  return (
    <section className="mb-10">
      <h2 className="section-heading mb-6">Recently Added Favorites</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentlyAdded.length > 0 ? (
          recentlyAdded.map(book => (
            <RecentlyAddedCard key={book.id} book={book} />
          ))
        ) : (
          <div className="col-span-3 text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground mb-4">No recently added favorites yet.</p>
            <Link
              to="/discover"
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Discover Books
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyAddedSection;
