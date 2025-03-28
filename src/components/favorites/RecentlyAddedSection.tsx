
import { useAppSelector } from "@/lib/redux/hooks";
import RecentlyAddedCard from "./RecentlyAddedCard";

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
            <p className="text-muted-foreground">No recently added favorites yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyAddedSection;
