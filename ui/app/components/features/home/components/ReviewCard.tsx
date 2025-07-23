import { Star } from "lucide-react";


interface Review {
  id: number;
  first_name: string;
  last_name: string;
  message: string;
  rating: number;
  date_created: string;
}

function ReviewCard({ review }: { review: Review }) {
  const name = review.first_name + " " + review.last_name;
  const limit = 5;

  const setInitial = (initial: string | null) => {
    if (initial) {
      return initial[0].toUpperCase();
    } else {
      return "X";
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white shadow-md p-4">
      {/* <!-- Profile and Rating --> */}
      <div className="flex justify-between">
        <div className="flex-row justify-start items-center min-w-[150px]">
          <div className="w-10 h-10 flex justify-center items-center text-xl text-white rounded-full bg-red-500">
            <span>{setInitial(name)}</span>
          </div>
          <div className="mt-2 fsm-bold text-sm text-gray-700">{name}</div>
        </div>
        <div className="flex p-1 gap-1">
          {Array.from(Array(limit), (e, i) => {
            return (
              <Star
                key={i}
                size="1em"
                className={`${i <= review.rating ? "text-yellow-300" : "text-gray-300"}`}
                fill="currentColor"
              />
            );
          })}
        </div>
      </div>
      <div className="min-h-[199px] max-h-[200px] overflow-y-auto text-black">
        {review.message}
      </div>
      <div className="flex justify-between text-sm font-light text-slate-400">
        <span>{review.date_created}</span>
      </div>
    </div>
  );
}

export default ReviewCard;
