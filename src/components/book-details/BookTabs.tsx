
interface BookTabsProps {
  activeTab: 'details' | 'reviews' | 'similar';
  setActiveTab: (tab: 'details' | 'reviews' | 'similar') => void;
}

const BookTabs = ({ activeTab, setActiveTab }: BookTabsProps) => {
  return (
    <div className="border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-5 border-b-2 text-sm font-medium
              ${activeTab === 'details'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            Details
          </button>
          
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-5 border-b-2 text-sm font-medium
              ${activeTab === 'reviews'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            Reviews
          </button>
          
          <button
            onClick={() => setActiveTab('similar')}
            className={`py-3 px-5 border-b-2 text-sm font-medium
              ${activeTab === 'similar'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            Similar Books
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookTabs;
