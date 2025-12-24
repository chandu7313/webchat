# NexusChat (Spring Boot + React)

Realtime chat app with React frontend and a new Spring Boot/Maven backend plus Dockerized local stack.

## Stack
- Frontend: React + Vite, Tailwind, Socket.io client
- Backend: Spring Boot (web, security, MongoDB), JWT auth, Cloudinary uploads, Socket.IO server (netty-socketio)
- Database: MongoDB
- Containers: Docker/Docker Compose

## Run locally (Docker)
```
docker compose up --build
```
Services:
- Client: http://localhost:5173
- API: http://localhost:5001
- Socket.IO: http://localhost:8081
- MongoDB: MongoDB Atlas (cloud)

Required env vars (pass to `docker compose` or shell):
- `SERVER_PORT` (default: `5001`)
- `MONGODB_URI` (default: MongoDB Atlas connection string)
- `JWT_SECRET` (>=32 chars; default: `chandra9000chandra9000chandra9000chandra`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (configured)

## Run backend locally (without Docker)
```bash
cd server-java
export SERVER_PORT=5001
export MONGODB_URI="mongodb+srv://Chandramohan4156:Gcm12316144@cluster0.9ujym.mongodb.net"
export JWT_SECRET="chandra9000chandra9000chandra9000chandra"
export CLOUDINARY_CLOUD_NAME="dazwmir34"
export CLOUDINARY_API_KEY="417586392283584"
export CLOUDINARY_API_SECRET="joAiIFH_AdRV9uEBbLaBNl_PWK0"
mvn spring-boot:run
```

**Note:** Default values are already set in `application.properties`, so you can just run `mvn spring-boot:run` without setting env vars.

## Run frontend locally

**Option 1: Using environment variables (recommended)**
```bash
cd client
npm install
VITE_BACKEND_URL=http://localhost:5001 VITE_SOCKET_URL=http://localhost:8081 npm run dev -- --host --port 5173
```

**Option 2: Create `.env.local` file in `client/` directory**
```bash
cd client
echo "VITE_BACKEND_URL=http://localhost:5001" > .env.local
echo "VITE_SOCKET_URL=http://localhost:8081" >> .env.local
npm install
npm run dev -- --host --port 5173
```

**Note:** If you see `ERR_CONNECTION_REFUSED`, make sure:
1. The backend server is running on `http://localhost:5001` (check with `curl http://localhost:5001/api/status`)
2. MongoDB Atlas connection is accessible (no local MongoDB needed)
3. The frontend has the correct `VITE_BACKEND_URL` set (defaults to `http://localhost:5001` if not set)
