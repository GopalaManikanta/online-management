import React from 'react';

export const CardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-3 bg-slate-200 rounded w-24"></div>
            <div className="w-9 h-9 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="h-8 bg-slate-200 rounded w-16"></div>
          <div className="h-2 bg-slate-200 rounded w-32"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-36"></div>
        <div className="h-8 bg-slate-200 rounded w-24"></div>
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div key={cIdx} className="h-3 bg-slate-200 rounded flex-1"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-48"></div>
        <div className="h-8 bg-slate-200 rounded w-20"></div>
      </div>
      <div className="h-64 bg-slate-100 rounded-2xl flex items-end justify-between p-4 gap-2">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-slate-200 rounded-t-lg flex-1"
            style={{ height: `${(idx % 5 + 2) * 18}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CardSkeleton;
