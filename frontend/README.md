# Task Manager — AI Powered

A full-stack web application for managing employee tasks with AI-powered suggestions.

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **AI**: Google Gemini API

## Features

- Add employees with ID, name, and skills
- AI-generated task description suggestions (Gemini API)
- AI-predicted task completion time
- Task board with delete functionality
- Success popup notifications

## How to Run Locally

### Backend
```
cd backend
npm install
# Create .env file with your GEMINI_API_KEY and MONGO_URI
node server.js
```

### Frontend
```
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend folder:
```
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=your_mongodb_connection_string_here
```


