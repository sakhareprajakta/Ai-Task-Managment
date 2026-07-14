# AI Task Management System

An AI-powered task management web application that helps users create, organize, prioritize, and track tasks efficiently. The application provides a clean and responsive user interface with secure authentication and intelligent task management features.

## 🚀 Live Demo

🔗 https://ai-task-managment.vercel.app/

## 📌 Features

- User Registration & Login
- JWT Authentication
- Create, Update, Delete Tasks
- Mark Tasks as Completed
- Task Prioritization
- Responsive User Interface
- Protected Routes
- AI-assisted task workflow
- REST API Integration
- Secure Password Encryption
- Modern React UI

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Context API

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt.js

## 📂 Project Structure

```
AI-Task-Management/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── package.json
│   └── server.js
│
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/sakhareprajakta/Ai-Task-Managment.git
```

Move into the project

```bash
cd Ai-Task-Managment
```

### Install Frontend

```bash
cd frontend
npm install
npm run dev
```

### Install Backend

```bash
cd backend
npm install
npm start
```

## 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_google_gemini_api_key
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |

### Tasks

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/tasks | Get All Tasks |
| POST | /api/tasks | Create Task |
| PUT | /api/tasks/:id | Update Task |
| DELETE | /api/tasks/:id | Delete Task |

## Deployment

### Frontend
- Vercel

### Backend
- Render / Railway / VPS

## Future Improvements

- AI Task Suggestions
- Task Reminder Notifications
- Calendar Integration
- Drag & Drop Tasks
- Team Collaboration
- Dark Mode
- File Attachments

## 👩‍💻 Author

**Prajakta Sakhare**

- GitHub: https://github.com/sakhareprajakta
- LinkedIn: https://www.linkedin.com/in/prajaktasakhare-b77b49220

---

⭐ If you like this project, don't forget to give it a star on GitHub!
