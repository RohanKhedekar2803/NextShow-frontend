import React, { useState } from 'react';

const Event = ({
  eventId,
  title,
  genre,
  image,
  cast = [],
  description = '',
  duration = '',
  releaseDate = '',
  onBookClick,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getFormattedCast = (cast) => {
    if (!Array.isArray(cast)) return '';
    const limitedCast = cast.slice(0, 8).join(', ');
    return cast.length > 8 ? `${limitedCast} ...` : limitedCast;
  };

  const getTruncatedDuration = (duration) => {
    return duration?.length > 8 ? duration.substring(0, 8) : duration;
  };

  const getTruncatedDescription = (desc) => {
    if (!desc) return '';
    if (desc.length <= 150 || showFullDescription) return desc;
    return desc.slice(0, 150) + '...';
  };

  return (
    <>
      <div
        className="min-w-40 cursor-pointer transition-transform transform hover:scale-105"
        onClick={() => setShowModal(true)}
      >
        <div className="relative w-40 h-60 overflow-hidden rounded-xl shadow-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://tse2.mm.bing.net/th?id=OIP.tG2FrC7ttKs4XkcRaKzT1QHaFu&pid=Api&P=0&h=180';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
        </div>
        <div className="mt-2 px-1">
          <h3 className="text-base text-white font-semibold truncate">{title}</h3>
          <p className="text-xs text-gray-400">{genre}</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-scroll p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
            >
              &times;
            </button>
            <img
              src={image}
              alt={title}
              className="w-full h-40 object-contain rounded mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://tse2.mm.bing.net/th?id=OIP.tG2FrC7ttKs4XkcRaKzT1QHaFu&pid=Api&P=0&h=180';
              }}
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="font-semibold text-sm text-gray-600 mb-2">Genre: {genre}</p>
            <p className="font-semibold text-sm text-gray-600 mb-2">Release Date: {releaseDate}</p>
            <p className="font-semibold text-sm text-gray-600 mb-4">Duration: {getTruncatedDuration(duration)}</p>

            <div className="mb-4 text-sm flex">
              <h4 className="font-semibold text-gray-700 mb-1">Cast: </h4>
              <p className="text-sm text-gray-600 pl-2">{getFormattedCast(cast)}</p>
            </div>

            <div className="mb-4 text-sm">
              <h4 className="font-semibold text-gray-700">Description:</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {getTruncatedDescription(description)}
              </p>
              {description.length > 1500 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 mt-1 text-sm hover:underline focus:outline-none"
                >
                  {showFullDescription ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>

            <button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition"
              onClick={() => {
                onBookClick(eventId, title);
                setShowModal(false);
              }}
            >
              Book Ticket
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Event;
