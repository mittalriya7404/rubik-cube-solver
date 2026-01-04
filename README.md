# 🧩 Rubik Cube Solver — Web App

A web-based Rubik’s Cube solver that allows users to input cube colors manually or scan faces using the camera, validate the cube state, and generate a step-by-step solving guide.

**🌐 Live Demo**

https://rubik-cube-solver-vfkk-git-main-mittalriya7404s-projects.vercel.app

**🚀 Features**

Interactive cube color editor

Camera-based face scanning

Real-time cube state sync with backend

Cube validation before solving

Full solution mode + step-by-step mode

**🗂 Project Structure**
```
project
 ├── frontend   → HTML, CSS, JavaScript (Vercel)
 └── backend    → Node.js / Express API (Render)
```

**⚙️ Tech Stack**

Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express

**🔗 API Endpoints**

POST /api/cube/scan-face

POST /api/cube/edit-cell

POST /api/cube/reset

GET /api/cube/validate

GET /api/cube/solve


**🏗 Run Locally**
Backend
```
cd backend
npm install
npm start
```


Frontend
```
Open frontend/index.html in browser
(or use Live Server)

To run locally, set:

const API_BASE = "http://localhost:5000";
```

**🌍 Deployment**

Frontend: Vercel
Backend: Render

Backend must use:

process.env.PORT || 5000

🙌 Author

Riya Mittal
