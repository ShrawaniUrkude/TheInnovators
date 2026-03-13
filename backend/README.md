# Urban Backend (India Infrastructure APIs)

This backend proxies and normalizes real-time data providers across five domains:

- Traffic
- Air Quality
- Public Transport
- Waste Management
- Energy Grid

## 1) Setup

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env` and add provider keys.

## 2) Run

```bash
npm run dev
```

Server default: `http://localhost:4000`

## 3) Endpoints

- `GET /api/health`
- `GET /api/providers`
- `GET /api/traffic?provider=...`
- `GET /api/air?provider=...`
- `GET /api/transport?provider=...`
- `GET /api/waste?provider=...`
- `GET /api/energy?provider=...`
- `GET /api/reports/latest-source`
- `POST /api/reports/source`
- `POST /api/reports/generate`
- `POST /api/reports/send-whatsapp`
- `POST /api/reports/dispatch`

## 4) Example Calls

### Traffic (TomTom)

```bash
curl "http://localhost:4000/api/traffic?provider=tomtom&lat=28.6139&lon=77.2090"
```

### Traffic (HERE)

```bash
curl "http://localhost:4000/api/traffic?provider=here&lat=19.0760&lon=72.8777"
```

### Air Quality (OpenAQ)

```bash
curl "http://localhost:4000/api/air?provider=openaq&city=Delhi&limit=25"
```

### Air Quality (IQAir)

```bash
curl "http://localhost:4000/api/air?provider=iqair&city=Delhi&state=Delhi"
```

### Transport (OTD Delhi)

```bash
curl "http://localhost:4000/api/transport?provider=otd_delhi&path=/api/realtime/vehicle-positions"
```

### Transport (Railway API wrapper)

```bash
curl "http://localhost:4000/api/transport?provider=railwayapi&trainNo=12002"
```

### Waste (Smart Cities)

```bash
curl "http://localhost:4000/api/waste?provider=smart_cities&path=/"
```

### Energy (Electricity Maps)

```bash
curl "http://localhost:4000/api/energy?provider=electricity_maps&zone=IN-SO"
```

### Any Domain via data.gov.in

```bash
curl "http://localhost:4000/api/air?provider=data_gov&resourceId=<resource-id>&limit=10"
```

## 5) Notes

- Many Indian public dashboards are not fully open REST APIs. For those providers, this backend uses configurable base URLs and paths.
- For production, add rate limiting, retries, request caching (Redis), and a background scheduler.
- Keep API keys in `.env` only.

## 6) Auto Reports (PDF + WhatsApp)

Add these env vars in `.env`:

```dotenv
PUBLIC_BASE_URL=http://localhost:4000
AUTO_REPORT_ENABLED=false
AUTO_REPORT_CRON=0 9 * * *
ADMIN_WHATSAPP_NUMBER=+91XXXXXXXXXX
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

Manual dispatch (generate PDF + send WhatsApp):

```bash
curl -X POST http://localhost:4000/api/reports/dispatch \
	-H "Content-Type: application/json" \
	-d '{
		"source": {
			"city": "Delhi",
			"area": "Central Delhi",
			"summary": "Daily infra risk summary.",
			"insights": [
				{
					"category": "Traffic",
					"impact": "High",
					"problem": "Congestion above threshold.",
					"solution": "Adaptive signaling + peak-hour diversion."
				}
			]
		},
		"to": "+91XXXXXXXXXX"
	}'
```

The generated PDFs are served at `/reports/<filename>`. For WhatsApp media delivery, `PUBLIC_BASE_URL` must be publicly reachable (for example via cloud host or tunnel).
