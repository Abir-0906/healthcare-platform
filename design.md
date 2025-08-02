Q1. What frontend framework did you use and why?
React (with Vite)

React is component-based and highly performant with virtual DOM.

Vite provides faster build times and better DX compared to CRA.

Q2. What backend framework did you choose and why?
Express.js

Lightweight, fast to develop, and integrates seamlessly with MongoDB and middleware like Multer and CORS.

Good for building RESTful APIs.

Q3. What database did you choose and why?
MongoDB (via Mongoose)

Schema-less, great for storing metadata about documents.

Easy integration with Express using Mongoose ORM.

Q4. If you were to support 1,000 users, what changes would you consider?
Enable clustering / horizontal scaling (e.g., PM2, load balancer like NGINX)

Move file storage to AWS S3 or Cloudinary instead of local disk

Rate limiting + caching for API

Add authentication and role-based access

Use MongoDB Atlas with replication and increase write concern level  

2. Architecture Overview 

Frontend (React) ↔ Backend (Express.js)
                          ⬇
         MongoDB (for metadata) + File System (for PDF files)
🔁 Request Flow:
React frontend sends requests via Axios (e.g., upload/download).

Express backend handles logic:

Stores file in /uploads/

Stores metadata in MongoDB

Frontend fetches & displays document list or downloads files.


3. API Specification

3. API Specification (from routes/documentRoutes.js)
✅ 1. Upload a Document
Endpoint: /documents/upload

Method: POST

Request:
multipart/form-data with field name: file (must be a .pdf)

Response (Success):

json
Copy
Edit
{
  "message": "File uploaded successfully!",
  "document": {
    "_id": "688d99...",
    "filename": "report.pdf",
    "filepath": "1689279938_report.pdf",
    "filesize": 123456,
    "createdAt": "2025-08-01T..."
  }
}
Description:
Uploads a PDF file using multer, stores it in uploads/, and saves metadata to MongoDB.

✅ 2. List All Documents
Endpoint: /documents

Method: GET

Response (Success):

json
Copy
Edit
{
  "documents": [
    {
      "_id": "688d99...",
      "filename": "report.pdf",
      "filepath": "1689279938_report.pdf",
      "filesize": 123456,
      "createdAt": "2025-08-01T..."
    },
    ...
  ],
  "totalPages": 2
}
Description:
Retrieves a paginated list of all uploaded documents with metadata.

✅ 3. Download a Document
Endpoint: /documents/:id

Method: GET

Response:
Triggers file download with proper CORS and Content-Disposition headers.

Description:
Downloads a specific PDF by its MongoDB ID. File is streamed from the server's local uploads/ directory.

✅ 4. Delete a Document
Endpoint: /documents/:id

Method: DELETE

Response (Success):

json
Copy
Edit
{ "message": "Document deleted successfully" }
Description:
Deletes the document metadata from MongoDB and also removes the file from the uploads/ folder.

✅ 5. View Document in Browser
Endpoint: /documents/view/:id

Method: GET

Response:
Sends the PDF file to be rendered in-browser (using res.sendFile).

Description:
Allows user to view the PDF inline in a new tab instead of downloading it.

4. Data Flow Description
✅ Download a File:
User clicks "Download".

Frontend sends GET /documents/:id.

Backend finds document in DB.

Reads file from /uploads/ and sends it with appropriate headers.

Frontend receives blob and triggers download.

✅ Delete a File:
User clicks "Delete".

Frontend sends DELETE /documents/:id.

Backend:

Finds the document in DB.

Deletes the file from /uploads/.

Deletes document metadata from MongoDB.

Response is sent to frontend, which updates the UI.

5. Step-by-Step Flow
✅ When a File is Uploaded:
User selects a file and clicks "Upload".

React sends a POST request using Axios with multipart/form-data.

Multer middleware:

Saves the file in /uploads/.

Generates a unique filename.

Backend saves metadata (filename, size, path, date) in MongoDB.

Response sent to React. UI updates.

✅ When a File is Downloaded:
User clicks "Download".

Frontend sends a GET /documents/:id.

Express:

Finds file path using MongoDB.

Sends file using res.download() with CORS headers.

Frontend creates a Blob and downloads it.

6. Assumptions
Q6. What assumptions did you make while building this?
📄 PDF-only uploads are allowed (enforced via Multer).

🔒 No authentication yet, assuming trusted users.

📁 Files are stored locally, not in cloud (for demo simplicity).

⚖ Max file size assumed to be under 10MB (can be limited in Multer).

⚡ Basic single-instance Express server, no horizontal scaling yet.

🧪 No concurrency controls for multiple simultaneous uploads.