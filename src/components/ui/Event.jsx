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
        className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] cursor-pointer group flex-shrink-0"
        onClick={() => setShowModal(true)}
      >
        <div className="relative w-full h-[210px] sm:h-[240px] md:h-[270px] lg:h-[300px] overflow-hidden rounded-2xl shadow-xl shadow-black/30 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-purple-500/20">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://tse2.mm.bing.net/th?id=OIP.tG2FrC7ttKs4XkcRaKzT1QHaFu&pid=Api&P=0&h=180';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-xs font-medium bg-purple-600/90 backdrop-blur-sm px-2 py-1 rounded-full inline-block">
              {genre}
            </p>
          </div>
        </div>
        <div className="mt-3 px-1">
          <h3 className="text-sm sm:text-base text-white font-bold truncate mb-1 group-hover:text-purple-300 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-xs text-gray-400 font-medium">{genre}</p>
        </div>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-2xl font-light transition-all duration-200 hover:rotate-90 hover:scale-110"
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* Image Section */}
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://tse2.mm.bing.net/th?id=OIP.tG2FrC7ttKs4XkcRaKzT1QHaFu&pid=Api&P=0&h=180';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Title and Genre */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{title}</h2>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm font-semibold border border-purple-500/30">
                    {genre}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Release Date</p>
                  <p className="text-white font-semibold">{releaseDate || 'N/A'}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-white font-semibold">{getTruncatedDuration(duration) || 'N/A'}</p>
                </div>
              </div>

              {/* Cast */}
              {cast && cast.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">Cast</h4>
                  <p className="text-sm text-gray-200 leading-relaxed">{getFormattedCast(cast)}</p>
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">Description</h4>
                  <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                    {getTruncatedDescription(description)}
                  </p>
                  {description.length > 150 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-3 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors duration-200 flex items-center gap-1"
                    >
                      {showFullDescription ? (
                        <>
                          <span>Show Less</span>
                          <span>↑</span>
                        </>
                      ) : (
                        <>
                          <span>Show More</span>
                          <span>↓</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="p-6 sm:p-8 pt-0 border-t border-white/10 bg-gradient-to-t from-gray-900/50 to-transparent">
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  onBookClick(eventId, title);
                  setShowModal(false);
                }}
              >
                Book Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Event;
