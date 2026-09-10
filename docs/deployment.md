# 🌐 WattVision — Commercial Production Deployment & Hosting Guide

This guide provides end-to-end instructions for deploying the **WattVision Smart Energy Monitoring & IoT Analytics Platform** to production cloud environments (Vercel, Netlify, Render, Railway, Docker, or self-hosted VPS).

---

## 🏛️ 1. Recommended Production Architecture

```text
                                  CLIENT BROWSER
                                        │
                    ┌───────────────────┴───────────────────┐
                    │ HTTPS (Port 443)                      │ WSS (WebSocket Secure)
                    ▼                                       ▼
       [ Frontend CDN / Edge ]                 [ Reverse Proxy / Load Balancer ]
       Vercel / Netlify / Cloudflare           Nginx / Caddy / Traefik
                    │                                       │
                    │ Static Assets (SPA)                   │ proxy_pass http://localhost:5000
                    ▼                                       ▼
       React 19 + Vite Production Bundle        [ WattVision Node.js Gateway ]
                                                Express REST API + WebSocket Server
                                                            ▲
                                                            │ HTTP POST / Telemetry
                                                [ Physical ESP32 Hardware ]
                                                Wi-Fi 802.11 b/g/n (or Benchtop Sim)
```

---

## ⚙️ 2. Environment Variables Reference

### Frontend (`.env` or Cloud Provider Dashboard)
> **Note:** Never commit production `.env` containing secrets to public Git repositories.

| Variable | Local Development | Production Example | Description |
|---|---|---|---|
| `VITE_API_URL` | *(empty / proxy)* | `https://api.wattvision.io` | Absolute URL to backend API. Leave blank if deployed behind a unified reverse proxy. |
| `VITE_WS_URL` | *(empty / proxy)* | `wss://api.wattvision.io/ws` | Full-duplex WebSocket secure URL. Leave blank for auto-discovery via `window.location`. |
| `VITE_DEFAULT_TARIFF` | `bescom_karnataka` | `bescom_karnataka` | Default Indian DISCOM preset (`bescom`, `tangedco`, `msedcl`, `bses`, `uppcl`). |

### Backend (`backend/.env` or Server Environment)

| Variable | Default | Recommended Production | Description |
|---|---|---|---|
| `PORT` | `5000` | `5000` (or `$PORT`) | HTTP and WebSocket server listening port. |
| `NODE_ENV` | `development` | `production` | Enables Express production optimizations. |
| `CORS_ORIGIN` | `*` | `https://wattvision.io,https://dashboard.wattvision.io` | Allowed frontend origins (comma-separated). |
| `DEVICE_SECRET_KEY` | `wattvision-iot-key-2026` | *(Strong random 32+ char key)* | Secret key validated in `X-Device-Key` header from ESP32. |
| `ALERT_VOLTAGE_MAX` | `255.0` | `255.0` | Overvoltage ceiling trigger in Volts RMS. |
| `ALERT_VOLTAGE_MIN` | `195.0` | `195.0` | Undervoltage brownout floor trigger in Volts RMS. |
| `ALERT_POWER_MAX` | `5000.0` | `5000.0` | Active real power overload limit in Watts. |
| `ALERT_PF_MIN` | `0.80` | `0.80` | Minimum acceptable power factor threshold. |

---

## 🚀 3. Frontend Deployment Options

### Option A: Vercel (Recommended)
1. Push repository to GitHub.
2. Link the repository in **Vercel Dashboard**.
3. Set the build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add single-page application rewrite rule in `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
5. Configure Environment Variables:
   - `VITE_API_URL`: `https://your-backend.onrender.com`
   - `VITE_WS_URL`: `wss://your-backend.onrender.com/ws`

### Option B: Netlify
1. Connect repository in **Netlify Dashboard**.
2. Set build command to `npm run build` and publish directory to `dist`.
3. Create `public/_redirects` to support SPA routing:
```text
/*    /index.html   200
```

---

## 🖥️ 4. Backend Gateway Deployment Options

### Option A: Render / Railway / Fly.io
1. In your Render/Railway dashboard, create a **Web Service**.
2. Set root directory to `backend`.
3. Build command: `npm install`
4. Start command: `node src/server.js`
5. Configure environment variables:
   - `PORT`: `5000` (or leave default on Render)
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: `https://your-frontend.vercel.app`
   - `DEVICE_SECRET_KEY`: `generate-strong-key-here`

### Option B: Self-Hosted Linux VPS with Nginx Reverse Proxy
Install Nginx and configure SSL via Let's Encrypt Certbot:

```nginx
# /etc/nginx/sites-available/wattvision.conf

# 1. Frontend SPA
server {
    listen 443 ssl http2;
    server_name wattvision.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/wattvision.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wattvision.yourdomain.com/privkey.pem;

    root /var/www/wattvision/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 2. Backend REST API & WebSocket
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # REST API endpoints
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Full-Duplex WebSocket Upgrade
    location /ws {
        proxy_pass http://127.0.0.1:5000/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

---

## 🐳 5. Containerized Deployment via Docker

### Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
USER node
CMD ["node", "src/server.js"]
```

### Docker Compose (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - CORS_ORIGIN=http://localhost:3000
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped
```

---

## 🔒 6. HTTPS & WSS (WebSocket Secure) Requirements

> [!IMPORTANT]
> Modern web browsers block unencrypted WebSocket (`ws://`) connections when the parent web page is served over `https://` (Mixed Content Security Policy).
> When hosting frontend on HTTPS, **you must configure a secure `wss://` endpoint** using an SSL certificate.

---

## 🛠️ 7. Troubleshooting Common Production Issues

### Issue 1: `WebSocket connection to 'ws://...' failed: Mixed Content`
- **Cause**: Frontend is served via `https://` but trying to open insecure `ws://`.
- **Solution**: Supply `VITE_WS_URL=wss://api.yourdomain.com/ws` with valid TLS certificate.

### Issue 2: `CORS policy: No 'Access-Control-Allow-Origin' header`
- **Cause**: Backend `CORS_ORIGIN` does not match the frontend domain.
- **Solution**: Set `CORS_ORIGIN=https://wattvision.yourdomain.com` in backend environment.

### Issue 3: `404 Not Found on Page Refresh (/presentation or /dashboard)`
- **Cause**: Web server is searching for a physical directory instead of serving `index.html`.
- **Solution**: Ensure your server has single-page application fallback configured (`try_files $uri $uri/ /index.html;` in Nginx, or `vercel.json` rewrites).

### Issue 4: Physical ESP32 Cannot Reach Cloud Backend
- **Cause**: ESP32 firmware pointing to local IP (`192.168.1.145`) instead of public domain.
- **Solution**: Update `firmware/esp32/include/config.h` with the public HTTPS endpoint and valid Wi-Fi credentials.
