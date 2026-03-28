import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { toggleLike, getLikeCount, getLikeStatus } from "../api/likeApi";

export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const status = await getLikeStatus(postId);
        const countRes = await getLikeCount(postId);

        setLiked(status.liked);
        setCount(countRes.likes);
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, [postId]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await toggleLike(postId);

      if (res.liked) {
        setLiked(true);
        setCount((prev) => prev + 1);
      } else {
        setLiked(false);
        setCount((prev) => prev - 1);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col mt-2">
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-200
        ${
          liked
            ? "text-blue-300 font-semibold"
            : "text-gray-600 hover:text-blue-600"
        }`}
    >
      <ThumbsUp
        size={14}
        className={`transition-transform duration-200 ${
          liked ? "fill-blue-600 scale-11" : ""
        }`}
      />
      {/* <span>Like</span> */}
      {count > 0 && <span className="text-xs">{count}</span>}
    </button>
      <p className="pl-3 -ml-1 font-semibold text-[12px]">Like</p>
    </div>
  );
}