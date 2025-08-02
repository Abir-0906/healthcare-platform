// App.jsx
import { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import DocumentList from "./components/DocumentList";

const App = () => {
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://localhost:5000/documents");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-2">
          Healthcare Patient Portal
        </h1>
        <p className="text-gray-600">
          Securely upload, view, and manage your medical documents
        </p>
      </header>
      <UploadForm onUploadSuccess={fetchDocuments} />
      <DocumentList documents={documents} />
    </div>
  );
};

export default App;
