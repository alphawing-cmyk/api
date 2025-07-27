import ReviewCard from "../components/ReviewCard";
import AddReviewModal from "../components/AddReviewModal";
import { useEffect, useState } from "react";

interface Review {
  id: number;
  first_name: string;
  last_name: string;
  message: string;
  rating: number;
  date_created: string;
}

const Reviews = ({ reviews }: { reviews: Array<Review> }) => {
  const [computedGroups, setComputedGroups] = useState<Array<Array<Review>>>([]);
  const [idx, setIdx] = useState<number>(0);
  const [dots, setDots] = useState<number>(1);
  const [showAddReviewModal, setShowAddReviewModal] = useState<boolean>(false);

  useEffect(() => {
    setComputedGroups(generateComputedGroups());
    setDots(Math.ceil(reviews.length / 3));
  }, []);

  const handleDots = (idx: number) => {
    setIdx(idx);
  };

  const generateComputedGroups = () => {
    const groups = [];
    for (let i = 0; i < reviews.length; i += 3) {
      groups.push(reviews.slice(i, i + 3));
    }
    return groups;
  };

  const closeAddReviewModal = () => {
    setShowAddReviewModal(false);
  };

  return reviews?.length === 0 ? (
    <div>
      <p
        className="text-4xl font-semibold max-w-[1240px] mx-auto mt-16"
        id="reviews"
      >
        Reviews
      </p>
      <p className="text-3xl font-semibold max-w-[1240px] mx-auto mt-16 text-slate-400">
        No Reviews Present
      </p>
    </div>
  ) : (
    <>
      <p
        className="text-4xl font-semibold max-w-[1240px] mx-auto mt-16"
        id="reviews"
      >
        Reviews
      </p>
      <div className="gap-4 mt-[50px]  max-w-[1240px] mx-auto relative">
        <div className="grid md:grid-cols-3 gap-4 w-full">
          {computedGroups.map((group: Array<Review>, index: number) =>
            group.map((review: Review) =>
              idx === index ? (
                <ReviewCard key={review.id} review={review} />
              ) : null
            ),
          )}
        </div>
      </div>
      <div className="flex justify-center items-center max-w-[1240px] mx-auto mt-16">
        {Array.from(Array(dots), (e, i) => {
          return (
            <span
              key={i}
              className={`w-[12px] h-[12px] rounded-full mx-1 cursor-pointer ${
                i === idx ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => {
                handleDots(i);
              }}
            ></span>
          );
        })}
      </div>
      <div className="flex justify-center items-center max-w-[1240px] mx-auto mt-16">
        <button
          className="bg-tmGolden w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3 text-black cursor-pointer"
          onClick={() => {
            setShowAddReviewModal(true);
          }}
        >
          Leave us a review
        </button>
        <AddReviewModal
          show={showAddReviewModal}
          title="Leave us a review :)"
          handleClose={closeAddReviewModal}
        />
      </div>
    </>
  );
};

export default Reviews;