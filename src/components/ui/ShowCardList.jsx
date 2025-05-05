import React from "react";

const ShowCardList = ({ shows }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl max-h-72 overflow-y-auto mt-4">
      <h2 className="text-lg font-semibold mb-2">Shows</h2>
      {shows && shows.length > 0 ? (
        shows.map((show, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-2 border-b border-gray-200 last:border-b-0"
          >
            <img
              src={show.image}
              alt={show.name}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div>
              <h3 className="font-medium">{show.name}</h3>
              <p className="text-sm text-gray-600">
                {show.startTime} - {show.endTime}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No shows available</p>
      )}
    </div>
  );
};

export default ShowCardList;
