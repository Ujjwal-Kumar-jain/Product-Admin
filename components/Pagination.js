import React from 'react';

export default function Pagination({ total, limit, page, onPageChange, onLimitChange }) {
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mt-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 backdrop-blur-md shadow-xl">
      <div className="text-sm text-slate-400">
        Showing <span className="text-white font-semibold">{total > 0 ? start : 0}</span> to <span className="text-white font-semibold">{end}</span> of <span className="text-white font-semibold">{total}</span>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        <select 
          className="bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={2}>2 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
          <button 
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-4 py-1.5 rounded-md disabled:opacity-40 text-sm hover:bg-slate-800 transition text-slate-300 font-medium disabled:hover:bg-transparent"
          >
            Previous
          </button>
          <div className="px-3 text-sm text-slate-500 font-medium border-l border-r border-slate-700/50">
            <span className="text-white">{page}</span> / {totalPages}
          </div>
          <button 
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-4 py-1.5 rounded-md disabled:opacity-40 text-sm hover:bg-slate-800 transition text-slate-300 font-medium disabled:hover:bg-transparent"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
