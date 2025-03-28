
import { Review } from "@/lib/types";
import { Link } from "react-router-dom";
import { User, Edit, Trash } from "lucide-react";
import StarRating from "@/components/StarRating";

interface BookReviewsTabProps {
  bookId: string;
  reviews: Review[];
}

const BookReviewsTab = ({ bookId, reviews }: BookReviewsTabProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Review</h2>
        <Link
          to={`/add-review/${bookId}`}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Write a Review
        </Link>
      </div>
      
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id} className="bg-white border rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div className="star-rating mb-2">
                    <StarRating value={review.rating} size="sm" disabled />
                  </div>
                  <h3 className="font-bold text-lg">{review.title}</h3>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <Edit className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <Trash className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <p className="mt-4 text-gray-700">{review.content}</p>
          </div>
        ))
      ) : (
        <div className="bg-gray-50 border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">You haven't reviewed this book yet.</p>
          <Link
            to={`/add-review/${bookId}`}
            className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Add Review
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookReviewsTab;
