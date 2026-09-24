import React from 'react';

export default function Pagination({ total, limit, page, onPageChange, onLimitChange }) {
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-gray-600">
        Showing {total > 0 ? start : 0}–{end} of {total}
      </div>
      
      <div className="flex items-center gap-4">
        <select 
          className="border border-gray-300 rounded p-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>

        <div className="flex items-center gap-2">
          <button 
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm hover:bg-gray-50 transition"
          >
            Previous
          </button>
          <span className="text-sm font-medium">Page {page} of {totalPages}</span>
          <button 
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm hover:bg-gray-50 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
