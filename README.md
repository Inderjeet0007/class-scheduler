# Class Scheduling App

## Overview
This project is a full-stack application for managing class schedules. Users can upload CSV files to **create**, **update**, or **delete** class schedules. The app enforces:

- Validation for overlapping sessions (student/instructor)
- Configurable limits for students, instructors, and class types
- Automatic creation of new students if they are not already in the system
- Detailed per-row success/error messages

The frontend provides a UI for CSV uploads and real-time reporting.

---

## Features
- 📤 Upload CSV with `new`, `update`, `delete` actions  
- ⚙️ Configurable via environment variables  
- 🔄 Real-time validation for overlapping student/instructor schedules  
- 🧮 Configurable limits:
  - Each class duration (minutes)
  - Max classes per student per day
  - Max classes per instructor per day
  - Max classes per class type per day  
- 🧑‍🎓 Automatic student creation (if not in master list)  
- 🧠 Validation for instructor/class type existence  
- 📊 UI with:
  - CSV upload (non-blocking)
  - Daily scheduled class graph
  - Filterable class report
  - Optional config editor (bonus)

---

## Tech Stack
- **Frontend:** React (deployed on Netlify)
- **Backend:** Node.js + Express (deployed on Railway)
- **Database:** MongoDB Atlas  

---

## Live Links
- **Frontend:** [https://class-scheduler-fe.netlify.app/](https://class-scheduler-fe.netlify.app/)  
- **Backend API:** [https://class-scheduler-production-9791.up.railway.app/](https://class-scheduler-production-9791.up.railway.app/)  
- **GitHub Repo:** [https://github.com/Inderjeet0007/class-scheduler](https://github.com/Inderjeet0007/class-scheduler)  

---

## Setup

### 1. Clone Repository
```bash
git clone https://github.com/Inderjeet0007/class-scheduler.git
cd class-scheduling-app
```

### 2. MongoDB Setup
You can use either a local MongoDB instance or MongoDB Atlas (cloud).

#### Option 1: Local MongoDB

Make sure MongoDB is installed and running on your system.
Default connection string:
```bash
mongodb://127.0.0.1:27017/<clusterName>
```
#### Option 2: MongoDB Atlas

- Go to https://www.mongodb.com/cloud/atlas
- Create a cluster and obtain your connection string:
```bash
mongodb+srv://<username>:<password>@cluster0.mongodb.net/<clusterName>
```

### 3. Create .env file in parent directory (of Frontend and Backend) and add the following
```bash
// Frontend
REACT_APP_PROD_API_BASE=http://localhost:5001/api

// Backend
PORT=5000
# Use either of these:
PROD_MONGO_URI=mongodb://127.0.0.1:27017/<clusterName>
# PROD_MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<clusterName>
UPLOAD_DIR=uploads
```
### Open **two terminal windows** (or tabs):

### 4. Install Dependencies & Start the Application
#### Terminal 1 — Start the Backend
```bash
cd backend
npm install
npm run start
```
The backend will start on `http://localhost:5001`

#### Terminal 2 — Start the Frontend
```bash
cd frontend
npm install
npm run start
```
The frontend will start on `http://localhost:3000`

### Notes
- Overlapping sessions are automatically rejected.
- Invalid instructor or class IDs return errors.
- New students are auto-added to the master list.
- All configuration values are environment-controlled.
- Works with both local and Atlas MongoDB instances.