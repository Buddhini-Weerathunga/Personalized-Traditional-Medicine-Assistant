import React from 'react';

const PlantCard = ({ plant, onClick }) => {
  const {
    plantName,
    scientificName,
    image,
    confidence,
    medicinalUses,
    commonNames
  } = plant;

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full focus:outline-2 focus:outline-green-600 focus:outline-offset-2" 
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        {image ? (
          <img src={image} alt={plantName} className="w-full h-full object-cover transition-transform hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
            <span className="text-6xl opacity-50">🌿</span>
          </div>
        )}
        
        {confidence && (
          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full font-semibold text-sm text-green-800">
            {confidence}%
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-green-800 text-xl font-semibold mb-2">{plantName}</h3>
        
        {scientificName && (
          <p className="text-gray-500 text-sm mb-3">
            <em>{scientificName}</em>
          </p>
        )}

        {commonNames && commonNames.length > 0 && (
          <div className="mb-3 text-sm">
            <span className="block text-gray-400 mb-1">Also known as:</span>
            <span className="text-gray-600">{commonNames.slice(0, 2).join(', ')}</span>
          </div>
        )}

        {medicinalUses && medicinalUses.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-md text-sm text-green-800 mt-auto">
            <span className="text-base">💊</span>
            <span>{medicinalUses.length} medicinal use{medicinalUses.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="p-5 pt-0 border-t border-gray-100">
        <button className="w-full py-2.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default PlantCard;
