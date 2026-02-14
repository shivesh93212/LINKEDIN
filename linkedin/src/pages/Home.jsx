import React from 'react'
import Navbar from "../components/Navbar/Navbar"



function Home() {
  return (
    <div className="min-h-screen bg-[#f3f2ef] pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 mt-6">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">


          <div className="hidden md:block md:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-14 bg-gray-300">

              </div>

              <div className="flex flex-col items-center -mt-7 p-4">
                <img
                src="https://i.pravatar.cc/100"
                alt="profile"
                className="w-16 h-16 rounded-full border-2 border-white"
                />
                <h2 className="mt-2 font-semibold text-gray-900">
                  Shivesh Patel
                </h2>

                <p className="text-xs text-gray-600 text-center mt-1 ">
                  Full Stack Developer | MERN | DSA
                </p>
              </div>

              <div className="border-t border-gray-200 p-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Profile viwers</span>
                  <span className="text-blue-600 font-semibold">70</span>
                </div>

                <div className="flex justify-between mt-2">
                  <span>Post impression</span>
                  <span className="text-blue-600 font-semibold">28</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 space-y-4">

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <img 
                 src="https://i.pravatar.cc/50"
                 alt="profile"
                 className="w-12 h-12 rounded-full"
                  />

                  <button className="flex-1 text-left border border-gray-300 rounded-full px-4 py-2 text-gray-500 hover:bg-gray-100">
                    Start a post
                  </button>
              </div>

              <div className="flex justify-between mt-4 text-sm text-gray-600">
                <button className="hover:bg-gray-100 px-3 py-2 rounded-md">
                  🎥 Video
                </button>

                <button className="hover:bg-gray-100 px-3 py-2 rounded-md">
                  🖼 Photo
                </button>

                <button className="hover:bg-gray-100 px-3 py-2 rounded-md">
                  📝 Write article
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <img
                src="https://i.pravatar.cc/50?img=12"
                alt="user"
                className="w-12 h-12 rounded-full"
                />

                <div className="font-semibold text-gray-900" >
              <h3 className="font-semibold text-gray-900">
                Harsh Kumar Geed
              </h3>

              <p className="text-sm text-gray-500">
                Full Stack Developer | MERN | DSA
              </p>

              <p className="text-xs text-gray-400 mt-1">
                3h • 🌍
              </p>
              </div>
            </div>

          <p className="mt-3 text-sm text-gray-800">
             I recently crossed 600+ problems solved on LeetCode 🚀
          </p>

          <div className="mt-3">
            <img
            src="https://picsum.photos/600/350"
            alt="post"
            className="rounded-lg w-full"
            />

          </div>
           
           <div className="flex justify-between mt-3 text-sm text-gray-600">
            <button className="hover:text-blue-600">👍 Like</button>
            <button className="hover:text-blue-600">💬 Comment</button>
            <button className="hover:text-blue-600">🔁 Repost</button>
            <button className="hover:text-blue-600">📤 Send</button>
           </div>
        </div>
      </div>


      <div className="hidden md:block md:col-span-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">LinkedIn News</h2>

          <ul className="mt-3 space-y-3 text-sm">
            <li>
              <p className="mt-3 space-y-3 text-sm">Retail Inflation surges</p>
              <p className="text-xs text-gray-500">10h ago • 1,069 readers</p>
            </li>

            <li>
              <p className="font-medium text-gray-800">
                World Cup opens to record viewership
              </p>

              <p className="text-xs text-gray-500">
                12h ago • 2,294 readers
              </p>
            </li>

            <li>
              <p className="font-medium text-gray-800">
                  Where Indians love travelling
              </p>
              <p className="text-xs text-gray-500">12h ago • 1,948 readers</p>
            </li>
          </ul>

          <button className="mt-4 text-sm font-semibold text-gray-700 hover:underline">
            Show more
          </button>

                  </div>
              </div>
             </div>
      </div>
    </div>
  )
}

export default Home
