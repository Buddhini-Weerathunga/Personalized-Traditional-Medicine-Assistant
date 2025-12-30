import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import LoadingSpinner from '../../components/plant-identification/LoadingSpinner';
import { getRiskAlerts, dismissAlert } from '../../services/plant-identification/plantApi';

const RiskAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, critical, warning, info
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await getRiskAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (alertId) => {
    try {
      await dismissAlert(alertId);
      setAlerts(alerts.filter(alert => alert._id !== alertId));
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      case 'low':
        return 'ℹ️';
      default:
        return '📋';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  if (loading) {
    return <LoadingSpinner message="Loading risk alerts..." />;
  }

  return (
    <>
      <PlantNavbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      {/* Background Decorations */}
      <div className="pointer-events-none">
        <div className="absolute -top-16 -left-10 w-72 h-72 bg-red-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-xs font-semibold mb-4">
            <span>🚨 Important Safety Information</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Safety Alerts
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Important safety information about medicinal plants
          </p>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-red-700">
            {alerts.filter(a => a.severity === 'critical').length}
          </div>
          <div className="text-xs text-red-600 font-medium mt-1">Critical</div>
        </div>
        <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-orange-700">
            {alerts.filter(a => a.severity === 'high').length}
          </div>
          <div className="text-xs text-orange-600 font-medium mt-1">High</div>
        </div>
        <div className="bg-yellow-50/50 border border-yellow-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-yellow-700">
            {alerts.filter(a => a.severity === 'medium').length}
          </div>
          <div className="text-xs text-yellow-600 font-medium mt-1">Medium</div>
        </div>
        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-blue-700">
            {alerts.filter(a => a.severity === 'low').length}
          </div>
          <div className="text-xs text-blue-600 font-medium mt-1">Info</div>
        </div>
      </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-gray-700 text-white'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          All Alerts
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'critical'
              ? 'bg-red-600 text-white'
              : 'bg-white border-2 border-red-300 text-red-600 hover:border-red-400'
          }`}
        >
          Critical
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'high'
              ? 'bg-orange-600 text-white'
              : 'bg-white border-2 border-orange-300 text-orange-600 hover:border-orange-400'
          }`}
        >
          High
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'medium'
              ? 'bg-yellow-600 text-white'
              : 'bg-white border-2 border-yellow-300 text-yellow-600 hover:border-yellow-400'
          }`}
        >
          Medium
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'low'
              ? 'bg-blue-600 text-white'
              : 'bg-white border-2 border-blue-300 text-blue-600 hover:border-blue-400'
          }`}
        >
          Info
        </button>
      </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Alerts</h2>
          <p className="text-gray-600">You're all clear! No safety warnings at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert._id}
              className={`border-l-4 ${getSeverityColor(alert.severity)} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getSeverityIcon(alert.severity)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{alert.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase mt-1 ${
                      alert.severity === 'critical' ? 'bg-red-200 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                      alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {alert.severity} Risk
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDismiss(alert._id)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                  title="Dismiss alert"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{alert.description}</p>

              {alert.affectedPlants && alert.affectedPlants.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Affected Plants:</h4>
                  <div className="flex flex-wrap gap-2">
                    {alert.affectedPlants.map((plant, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
                      >
                        🌿 {plant}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {alert.recommendations && alert.recommendations.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {alert.recommendations.map((rec, index) => (
                      <li key={index} className="pl-6 relative text-gray-700">
                        <span className="absolute left-0">✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  Posted: {new Date(alert.createdAt).toLocaleDateString()}
                </span>
                {alert.plantId && (
                  <button
                    onClick={() => navigate(`/plant-details/${alert.plantId}`)}
                    className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                  >
                    View Plant Details →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

        {/* Safety Guidelines Section */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
        <h2 className="text-2xl font-bold text-green-800 mb-4">General Safety Guidelines</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
              <span>🏥</span> Before Using Any Medicinal Plant:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                Consult with a qualified healthcare provider
              </li>
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                Verify plant identification with an expert
              </li>
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                Check for drug interactions
              </li>
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                Start with small doses to test tolerance
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
              <span>⚠️</span> Avoid If:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                You are pregnant or breastfeeding (unless approved)
              </li>
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                You have chronic health conditions
              </li>
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                You are taking prescription medications
              </li>
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                You have known allergies to similar plants
              </li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RiskAlerts;
