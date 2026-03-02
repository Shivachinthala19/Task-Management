# Scalable Task Management System (Internship Assignment)

A secure, scalable REST API built with FastAPI and a modern React frontend.

## Features

### 🚀 Backend (FastAPI)
- **JWT Authentication**: Secure user login and registration with password hashing (Bcrypt).
- **Role-Based Access Control (RBAC)**: Supports `User` and `Admin` roles.
- **Task CRUD**: Full Create, Read, Update, and Delete operations for tasks.
- **Ownership Security**: Users can only manage their own tasks, while Admins have global access.
- **API Versioning**: Structured under `/api/v1/`.
- **Auto-Documentation**: Integrated Swagger UI available at `/docs`.
- **Database**: SQLAlchemy models with PostgreSQL support (SQLite used for local dev).

### 🎨 Frontend (React + Vite)
- **Premium UI**: Styled with modern CSS and Lucide icons.
- **Authentication Flow**: Login and Registration pages with validation and feedback.
- **Dashboard**: Task management interface with real-time feedback.
- **Responsive Design**: Works across different screen sizes.

## Project Structure

```bash
backend/
├── app/
│   ├── api/          # API endpoints (v1)
│   ├── core/         # Config, security, database setup
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic validation models
│   └── main.py       # FastAPI initialization
└── .env              # Environment variables

frontend/
├── src/
│   ├── api/          # Axios configuration
│   ├── components/   # UI components
│   ├── pages/        # Login, Register, Dashboard
│   └── App.jsx       # Routing setup
└── vite.config.js    # Vite configuration
```

## Getting Started

### Backend Setup
1. `cd backend`
2. `pip install -r requirements.txt`
3. `uvicorn app.main:app --reload`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

## 📈 Scalability Note

To ensure this system can handle growth, the following strategies should be implemented:

### 1. Database Scaling
- **Read Replicas**: Use multiple read instances for the database to handle heavy read loads.
- **Sharding**: Distribute data across multiple database instances based on keys like `user_id`.
- **Migrations**: Use Alembic for structured database schema evolution.

### 2. Caching (Redis)
- Cache frequently accessed data (like user profiles or task lists) in Redis to reduce database hits.
- Caching JWT blacklists if/when token revocation is needed.

### 3. Microservices Architecture
- Split the User/Auth service and the Task service into independent microservices.
- Use a Message Broker (RabbitMQ/Kafka) for asynchronous communication and event-driven tasks.

### 4. Load Balancing & Docker
- Containerize components with Docker for consistent deployment.
- Use Nginx or a cloud load balancer (AWS ELB) to distribute traffic across multiple API instances.

### 5. Logging & Monitoring
- Implement central logging (ELK Stack) and metrics (Prometheus/Grafana) to track performance and errors.
