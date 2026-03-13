# UrbanPulse (TheInnovators)

A full-stack smart city dashboard demo app with:

- **Frontend**: React + Vite UI with dashboards for Traffic, Environment, Energy, Transport, Water/Waste, and AI Insights.
- **Backend**: Express API with mock data, PDF report generation, and (optional) WhatsApp report dispatch via Twilio.

---

## 📁 Repository Structure

- `frontend/` – React app built with Vite
- `backend/` – Express server (Node.js) + report generation (PDF + optional Twilio)

---

## 🚀 Getting Started

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Run the backend

```bash
cd backend
npm run dev
```

Default backend URL: `http://localhost:4000`

### 3) Run the frontend

```bash
cd frontend
npm run dev -- --host
```

Default frontend URL: `http://localhost:5173`

---

## 🧠 Features

### Frontend
- City + Area selection (with voice search)
- Traffic, Environment, Energy, Transport, Water/Waste dashboards
- AI Insights page with report download and WhatsApp dispatch
- Map visualizations (heatmap-like congestion indicators, proposed road suggestions)

### Backend
- Exposes API endpoints for mocked city data
- Generates PDF reports with insights and alerts
- Optional WhatsApp dispatch using Twilio credentials

---

## 🧩 Configuring WhatsApp report dispatch (optional)

Create a `.env` file inside `backend/` with:

```
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_FROM=whatsapp:+1234567890
ADMIN_WHATSAPP_NUMBER=whatsapp:+1234567890
```

---

## 📝 Notes

- The app uses mocked data in `frontend/src/data/mockData.js` and generates per-city/area variants in `frontend/src/hooks/useCityData.js`.
- Reports are generated as PDFs and stored under `backend/reports/`.

---

If you want a deployment guide (Docker, Vercel, etc.) or want to hook real APIs, just say so!