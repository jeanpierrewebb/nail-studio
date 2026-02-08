"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Offline Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-pink-100 mb-4">
            <svg
              className="w-12 h-12 text-pink-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">
          You&apos;re offline
        </h1>
        <p className="text-gray-600 mb-6">
          Your saved collections are still available! 💅
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/saves"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            View Saved Collections
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-pink-300 text-pink-600 font-medium rounded-full hover:bg-pink-50 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center gap-2">
          <span className="text-2xl">💅</span>
          <span className="text-2xl opacity-60">✨</span>
          <span className="text-2xl opacity-40">💕</span>
        </div>
      </div>
    </div>
  );
}
