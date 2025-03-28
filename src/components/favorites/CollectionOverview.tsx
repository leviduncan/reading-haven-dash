
import { useAppSelector } from "@/lib/redux/hooks";
import FavoriteStatsCard from "./FavoriteStatsCard";

const CollectionOverview = () => {
  const { stats } = useAppSelector(state => state.favorites);
  
  return (
    <section className="mb-10">
      <h2 className="section-heading mb-4">Collection Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FavoriteStatsCard 
          icon="heart" 
          value={stats.totalFavorites} 
          label="Favorite Books" 
          sublabel="Total collection" 
        />
        
        <FavoriteStatsCard 
          icon="library" 
          value={stats.topGenre.name || 'None'} 
          label="Top Genre" 
          sublabel={`${stats.topGenre.count} ${stats.topGenre.count === 1 ? 'book' : 'books'}`} 
        />
        
        <FavoriteStatsCard 
          icon="user" 
          value={stats.favoriteAuthor.name || 'None'} 
          label="Favorite Author" 
          sublabel={`${stats.favoriteAuthor.count} ${stats.favoriteAuthor.count === 1 ? 'book' : 'books'}`} 
        />
        
        <FavoriteStatsCard 
          icon="book" 
          value={stats.averageRating.toFixed(1)} 
          label="Average Rating" 
          sublabel="Out of 5" 
        />
      </div>
    </section>
  );
};

export default CollectionOverview;
