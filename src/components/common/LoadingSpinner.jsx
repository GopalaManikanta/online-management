import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3 min-h-[200px]">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} text-sky-500 animate-spin`} />
      {message && <p className="text-xs font-semibold text-slate-500">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
