import { useState } from "react";
import Button from "./Button";

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("⚠️ Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setMessage("✅ File uploaded successfully!");
      setFile(null);
      onUploadSuccess();
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to upload file.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 sm:p-8 bg-white shadow-md rounded-lg border border-blue-100">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-700 text-center">
        Upload Your Medical Document (PDF)
      </h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <Button type="submit" className="w-full sm:w-auto">Upload</Button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default UploadForm;
