import React from 'react';

export const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="text-gray-600 mb-4">{icon}</div>}
      <h3 className="text-sm font-semibold text-gray-300 mb-2">{title}</h3>
      {description && <p className="text-xs text-gray-500 mb-4 max-w-sm">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
