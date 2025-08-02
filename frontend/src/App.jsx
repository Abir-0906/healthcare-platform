import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadForm from './components/UploadForm';
import DocumentList from './components/DocumentList';
import { formatBytes, formatDate } from './utils/helpers';



// Configure axios to send credentials if needed
axios.defaults.withCredentials = true;

// Set base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Adjust this to your backend API URL
axios.defaults.baseURL = API_BASE_URL;


function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDocuments();
  }, [currentPage]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/documents?page=${currentPage}`);
      setDocuments(response.data.documents);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch documents');
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('File uploaded successfully!');
      fetchDocuments();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents/${id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.response?.data?.error || 'Download failed');
    }
  };

  const handleView = (id) => {
    window.open(`${API_BASE_URL}/documents/view/${id}`, '_blank');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/documents/${id}`);
      setMessage('Document deleted successfully!');
      fetchDocuments();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Medical Document Portal</h1>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <UploadForm onUpload={handleUpload} />
        
        <DocumentList 
          documents={documents} 
          loading={loading}
          onDownload={handleDownload}
          onView={handleView}
          onDelete={handleDelete}
        />
        
        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;