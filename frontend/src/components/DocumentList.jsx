import React from 'react';
import { formatBytes, formatDate } from '../utils/helpers';

const DocumentList = ({ documents, loading, onDownload, onView, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-blue-50 shadow rounded-lg p-6 text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-blue-50 shadow rounded-lg p-6 text-center py-12">
        <p className="text-gray-600">No documents found. Upload your first medical document.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-blue-100">
        <h2 className="text-xl font-semibold text-gray-800">Your Medical Documents</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Filename</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Upload Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-200">
            {documents.map(doc => (
              <tr key={doc._id} className="bg-blue-30 hover:bg-blue-100 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.filename}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatBytes(doc.filesize)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(doc.created_at)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(doc._id)}
                      className="px-3 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300 text-xs sm:text-sm transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onDownload(doc._id, doc.filename)}
                      className="px-3 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300 text-xs sm:text-sm transition-colors"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => onDelete(doc._id)}
                      className="px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300 text-xs sm:text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentList;