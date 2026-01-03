import React from 'react';
import SafetyBadge from './SafetyBadge';

const WarningCard = ({ warning, onViewDetails }) => {
  const {
    title,
    description,
    severity,
    category,
    affectedPlants = [],
    recommendations = []
  } = warning;

  const getCategoryIcon = (cat) => {
    const icons = {
      toxicity: '☠️',
      allergy: '🤧',
      interaction: '💊',
      pregnancy: '🤰',
      children: '👶',
      dosage: '📏',
      environment: '🌍',
      general: '⚠️'
    };
    return icons[cat] || '⚠️';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-5 border-l-4 border-orange-500">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getCategoryIcon(category)}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <span className="text-xs text-gray-500 uppercase font-medium">{category}</span>
          </div>
        </div>
        <SafetyBadge severity={severity} size="small" />
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>

      {affectedPlants.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-2">AFFECTED PLANTS:</p>
          <div className="flex flex-wrap gap-2">
            {affectedPlants.map((plant, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md border border-orange-200"
              >
                {plant}
              </span>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-2">RECOMMENDATIONS:</p>
          <ul className="space-y-1">
            {recommendations.slice(0, 2).map((rec, index) => (
              <li key={index} className="text-sm text-gray-700 pl-4 relative">
                <span className="absolute left-0 text-green-600">✓</span>
                {rec}
              </li>
            ))}
          </ul>
          {recommendations.length > 2 && (
            <button
              onClick={onViewDetails}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
            >
              +{recommendations.length - 2} more recommendations
            </button>
          )}
        </div>
      )}

      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full mt-3 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg font-medium text-sm transition-colors"
        >
          View Full Details →
        </button>
      )}
    </div>
  );
};

export default WarningCard;
