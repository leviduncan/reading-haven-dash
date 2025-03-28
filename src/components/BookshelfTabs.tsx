
import { Link, useLocation } from "react-router-dom";

interface Tab {
  label: string;
  value: string;
  path: string;
}

const tabs: Tab[] = [
  { label: "All Books", value: "all", path: "/my-books" },
  { label: "Currently Reading", value: "currently-reading", path: "/currently-reading" },
  { label: "Want to Read", value: "want-to-read", path: "/want-to-read" },
  { label: "Completed", value: "completed", path: "/completed" },
  { label: "Favorites", value: "favorites", path: "/favorites" }
];

const BookshelfTabs = () => {
  const location = useLocation();
  
  return (
    <div className="border-b">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            to={tab.path}
            className={`inline-flex items-center py-3 px-5 border-b-2 text-sm font-medium whitespace-nowrap
              ${location.pathname === tab.path
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }
            `}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookshelfTabs;
