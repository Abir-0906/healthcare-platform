# 📄 Document Upload & Management System

This is a full-stack application built with *Express.js* and *MongoDB* that allows users to:

- Upload PDF documents  
- View them in-browser  
- Download them  
- Delete them  
- Get a paginated list of all documents  

> Frontend built using *React + Vite, Backend uses **Express.js, File uploads handled via **Multer, and data is stored in **MongoDB*.

---

## 🚀 Project Overview

*Backend Features:*
- Upload PDFs (Multer + Express)
- List all uploaded documents (paginated)
- Download documents
- Delete documents (both DB + filesystem)
- View PDFs in browser

*Frontend (React + Vite):*
- Upload UI
- List of uploaded documents
- Preview & delete support
- Uses Axios with .env for API base URL

---

## 🛠 How to Run Locally

### 📦 Prerequisites
- Node.js ≥ 14
- MongoDB running locally (or use MongoDB Atlas)

---

### 📁 Backend Setup

```bash
cd backend
npm install

---