import React from 'react';

export const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500">{message}</span>
      </div>
    </div>
  );
};
