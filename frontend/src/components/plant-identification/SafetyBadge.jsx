import React from 'react';

const SafetyBadge = ({ severity, size = 'medium' }) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const severityConfig = {
    critical: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: '🚨'
    },
    high: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-300',
      icon: '⚠️'
    },
    medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      icon: '⚡'
    },
    low: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
      icon: 'ℹ️'
    },
    safe: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      icon: '✅'
    }
  };

  const config = severityConfig[severity] || severityConfig.low;

  return (
    <span
      className={`inline-flex items-center gap-1 ${config.bg} ${config.text} ${config.border} border rounded-full font-semibold ${sizeClasses[size]}`}
    >
      <span>{config.icon}</span>
      <span className="uppercase">{severity}</span>
    </span>
  );
};

export default SafetyBadge;
