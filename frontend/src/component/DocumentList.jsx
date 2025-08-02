import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ITEMS_PER_PAGE = 5;

const DocumentList = ({ documents: allDocuments = [], onDelete }) => {
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredDocuments(allDocuments);
    } else {
      const filtered = allDocuments.filter((doc) =>
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocuments(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, allDocuments]);

  const handleDelete = async (id) => {
    const filename = allDocuments.find((doc) => doc._id === id)?.filename || "Document";
    try {
      const res = await fetch(`http://localhost:5000/documents/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`${filename} deleted successfully!`);
        onDelete?.(id);
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      toast.error(`Failed to delete ${filename}`);
    }
  };

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 py-6 sm:py-8 bg-white shadow-md rounded-lg">
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: "#363636", color: "#fff" } }} />

      <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-6">
        📁 Uploaded Documents
      </h2>

      <input
        type="text"
        placeholder="🔍 Search documents..."
        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {allDocuments.length === 0 ? (
        <p className="text-center text-gray-600">No documents uploaded yet.</p>
      ) : filteredDocuments.length === 0 ? (
        <p className="text-center text-gray-600">No matching documents found.</p>
      ) : (
        <>
          <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {paginatedDocuments.map((doc) => (
              <li key={doc._id} className="bg-gray-100 p-4 rounded-md shadow-sm flex flex-col justify-between">
                <p className="text-sm font-medium text-gray-800 truncate mb-2">{doc.filename}</p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <a
                    href={`http://localhost:5000/documents/view/${doc._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm px-3 py-1 rounded text-center"
                  >
                    View
                  </a>
                  <a
                    href={`http://localhost:5000/documents/${doc._id}`}
                    download
                    className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm px-3 py-1 rounded text-center"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm px-3 py-1 rounded text-center"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange("prev")}
              className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              ◀ Prev
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange("next")}
              className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentList;
