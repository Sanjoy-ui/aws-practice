# Full-Stack Web Application (FastAPI MVC + React Vite)

A complete full-stack web application featuring an MVC FastAPI backend connected to PostgreSQL and a React + TypeScript frontend built with Vite.

---

## 🏗️ Architecture (Same-Origin / Zero-CORS)

The application uses a **Same-Origin Reverse Proxy Architecture**, eliminating cross-origin requests, preflight `OPTIONS` requests, and CORS configuration entirely:

```
[ Browser ] ───> Same Origin (http://localhost:5173 or https://yourdomain.com)
                      │
                      ├─── /* ───────────> React Frontend (Vite / S3)
                      └─── /api/*, /health > FastAPI Backend (via Vite Proxy in Dev / CloudFront in AWS)
```

- **Local Development**: Vite dev server reverse-proxies `/api`, `/health`, and `/docs` directly to `http://localhost:8000`.
- **AWS Production**: Amazon CloudFront routes `/*` to your S3 bucket and `/api/*` + `/health` to your Application Load Balancer (ALB).
- **Result**: Zero CORS headers to manage, zero preflight latency overhead, and no risk of browser CORS rejections.

---

## 🚀 Running the Project

### Terminal 1: Backend
```bash
cd backend
source venv/bin/activate
python run.py
```
* **Backend**: `http://localhost:8000`
* **API Docs**: `http://localhost:8000/docs`
* **Health Check**: `http://localhost:8000/health`

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
* **Frontend App**: `http://localhost:5173`
* The frontend makes relative calls (`/api/items`, `/health`), which are proxied without any CORS issues.

---

## 🧪 Testing

### Backend Unit & Integration Tests:
```bash
cd backend
./venv/bin/pytest
```

### Frontend Build:
```bash
cd frontend
npm run build
```
