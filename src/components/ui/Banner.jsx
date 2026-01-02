import React from 'react';

export default function Banner() {
  return (
    <div
      className="min-h-[70vh] sm:min-h-[80vh] lg:min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://wallpaperaccess.com/full/3988284.jpg')",
      }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-yellow-900/20 z-0" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-purple-400 drop-shadow-2xl">
            Welcome to NextShow
          </header>
          <div className="h-1.5 w-32 bg-gradient-to-r from-purple-600 to-yellow-400 rounded-full mx-auto mb-6"></div>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 mb-8 font-medium leading-relaxed">
            Discover amazing events, shows, and experiences
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-semibold">
              🎬 Movies
            </div>
            <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-semibold">
              ⚽ Sports
            </div>
            <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-semibold">
              🎭 Live Shows
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
