import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  title = 'No Data Found',
  description = 'There are no records available to display right now.',
  icon: Icon = Inbox,
  actionText,
  onAction,
}) => {
  return (
    <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center border border-sky-100 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
