# Local & Cloud Deployment Guide

This guide describes how to run and deploy **WattVision** across local development environments and production servers.

---

## 💻 1. Local Development Setup

### Prerequisites:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Modern Web Browser**: Chrome, Edge, Firefox, or Safari

### Steps:
```bash
# 1. Clone repository or navigate to directory
cd smart-energy-monitor

# 2. Install dependencies cleanly
npm install

# 3. Start local development server with HMR
npm run dev
```

The web dashboard will be available at `http://localhost:3000` (or next available port).

---

## 🏗️ 2. Production Build

To generate optimized, minified production assets:

```bash
npm run build
```

This generates production static files in the `dist/` directory ready for deployment to **Vercel**, **Netlify**, **GitHub Pages**, or **Firebase Hosting**.

---

## ☁️ 3. One-Click Cloud Hosting (Vercel / Netlify)

1. Push your repository to **GitHub**.
2. Connect repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy!
