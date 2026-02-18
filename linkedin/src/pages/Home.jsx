import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import CreatePostModel from "../components/Post/CreatePostModel";
import { getFeedPosts } from "../api/postApi";
import PostCard from "../components/Post/PostCard";


function Home() {
  const [isPostModelOpen, setIsPostModelOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  const fetchFeed = async () => {
    try {
      const data = await getFeedPosts(1, 10);
      setPosts(data);
    } catch (err) {
      console.log("Feed error:", err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleDeleteFromUI = (postId) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="hidden md:block md:col-span-3">
          <div className="sticky top-20">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-14 bg-gray-300"></div>

              <div className="flex flex-col items-center -mt-7 p-4">
                <img
                  src="https://i.pravatar.cc/100"
                  alt="profile"
                  className="w-16 h-16 rounded-full border-2 border-white"
                />

                <h2 className="mt-2 font-semibold text-gray-900">
                  Shivesh Patel
                </h2>

                <p className="text-xs text-gray-600 text-center mt-1">
                  Full Stack Developer | MERN | DSA
                </p>
              </div>
            </div>
          </div>
          </div>

          {/* CENTER FEED */}
          <div className="md:col-span-6 space-y-4 py-14">
            {/* CREATE POST BOX */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/50"
                  alt="profile"
                  className="w-12 h-12 rounded-full"
                />

                <button
                  onClick={() => setIsPostModelOpen(true)}
                  className="flex-1 text-left border border-gray-300 rounded-full px-4 py-2 text-gray-500 hover:bg-gray-100"
                >
                  Start a post
                </button>
              </div>
            </div>

            {/* POSTS LIST */}
            {posts.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                No posts found...
              </p>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handleDeleteFromUI} />
              ))
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden md:block md:col-span-3">
            <div className="sticky top-20">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900">LinkedIn News</h2>

              <ul className="mt-3 space-y-3 text-sm">
                <li>
                  <p className="font-medium text-gray-800">
                    Retail Inflation surges
                  </p>
                  <p className="text-xs text-gray-500">
                    10h ago • 1,069 readers
                  </p>
                </li>
              </ul>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* CREATE POST MODAL */}
      <CreatePostModel
        isOpen={isPostModelOpen}
        onClose={() => setIsPostModelOpen(false)}
        onPostCreated={fetchFeed}
      />
    </div>
  );
}

export default Home;
