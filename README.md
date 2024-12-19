# Collaborative Whiteboard Application

## Overview
A web-based collaborative whiteboard application built with **React**, **Tailwind CSS**, and **PostgreSQL**, featuring real-time communication using **Socket.IO**. This app allows multiple users to collaborate on a shared canvas in real-time.

## Features
- **Real-Time Collaboration:** Multiple users can draw and interact simultaneously on the whiteboard.
- **Tool Selection:** Use tools like Pencil, Line, and Rectangle.
- **Color Picker:** Select custom colours for drawing.
- **Undo and Redo:** Navigate between previous and current actions.
- **User List:** Display of active users in the session.

## Tech Stack
- **Frontend:** React, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Real-Time Communication:** Socket.IO

## Installation

### Prerequisites
- Node.js installed on your machine.
- PostgreSQL database set up and running.

### Steps
1. Clone the repository:
   ```
      git clone <repository-url>
   cd collaborative-whiteboard
   ```

2. Install dependencies:
   ```cd frontend
   npm install
   cd backend
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and set the following variables:
   ```
   PORT=5000
   DATABASE_URL=your_database_url
   SOCKET_PORT=5001
   ```

4. Start the server:
   ```
   fronted> npm run dev
   backend> nodemon server.js
   ```

6. Open the application in your browser:
   ```
   http://localhost:3000
   ```




