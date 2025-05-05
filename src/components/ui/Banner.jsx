import React from 'react';

export default function Banner() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center relative"
      style={{
        backgroundImage:
          "url('https://wallpaperaccess.com/full/3988284.jpg')",
      }}
    >
      {/* Optional: dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

      <div className="relative z-10 text-center px-4">
        <header className="text-4xl font-bold mb-4 text-white">
          Welcome to Nextshow
        </header>
        <p className="text-lg text-gray-200 mb-8">
          Discover our features, services, and more!
        </p>
      </div>
    </div>
  );
}
