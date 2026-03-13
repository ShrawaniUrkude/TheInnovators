import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import twilio from 'twilio';
import cron from 'node-cron';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reportsDir = path.resolve(__dirname, '../reports');
fs.mkdirSync(reportsDir, { recursive: true });

const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : '*';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/reports', express.static(reportsDir));

const http = axios.create({ timeout: 15000 });

const safeGet = (obj, path, fallback = null) => {
  const value = path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  return value === undefined ? fallback : value;
};

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

const parsePoint = (query) => {
  const lat = Number(query.lat);
  const lon = Number(query.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return { lat: 28.6139, lon: 77.2090 }; // New Delhi default
  }

  return { lat, lon };
};

let latestReportSource = {
  city: 'Delhi',
  area: 'Central Delhi',
  generatedAt: new Date().toISOString(),
  summary: 'Auto-generated urban operations summary.',
  insights: [
    {
      category: 'Traffic',
      impact: 'Medium',
      problem: 'Peak-hour congestion increases commute time in dense corridors.',
      solution: 'Deploy adaptive signal timing and enforce no-parking in choke points.',
    },
    {
      category: 'Environment',
      impact: 'High',
      problem: 'AQI spikes in mixed-use areas impact outdoor workers and students.',
      solution: 'Run ward-level alerts and prioritize low-emission public transit.',
    },
    {
      category: 'Water',
      impact: 'Medium',
      problem: 'Leakage hotspots reduce pressure in tail-end supply zones.',
      solution: 'Use DMA leak detection and planned night pressure management.',
    },
  ],
};

const sanitizeFilePart = (text) => String(text || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')
  .slice(0, 60);

const normalizeWhatsappTo = (to) => {
  if (!to) return null;
  const trimmed = String(to).trim();
  if (trimmed.startsWith('whatsapp:')) return trimmed;
  const digits = trimmed.replace(/[^0-9+]/g, '');
  return `whatsapp:${digits}`;
};

const getPublicBaseUrl = (req) => {
  const configured = process.env.PUBLIC_BASE_URL;
  if (configured) return configured.replace(/\/$/, '');
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  return `${proto}://${req.get('host')}`;
};

async function buildReportPdf(source, req) {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const cityPart = sanitizeFilePart(source.city || 'city');
  const areaPart = sanitizeFilePart(source.area || 'area');
  const filename = `urban-report-${cityPart}-${areaPart}-${stamp}.pdf`;
  const filePath = path.join(reportsDir, filename);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('Urban Analysis Report', { align: 'left' });
    doc.moveDown(0.4);
    doc.fontSize(11).fillColor('#555').text(`City: ${source.city || 'N/A'}`);
    doc.text(`Area: ${source.area || 'N/A'}`);
    doc.text(`Generated at: ${source.generatedAt || new Date().toISOString()}`);
    doc.moveDown();

    doc.fillColor('#111').fontSize(13).text('Executive Summary');
    doc.moveDown(0.35);
    doc.fontSize(11).fillColor('#222').text(source.summary || 'No summary provided.', { lineGap: 4 });
    doc.moveDown();

    doc.fillColor('#111').fontSize(13).text('Problem-Solution Insights');
    doc.moveDown(0.5);

    const insights = Array.isArray(source.insights) ? source.insights : [];
    if (!insights.length) {
      doc.fontSize(11).fillColor('#444').text('No insights provided.');
    } else {
      insights.forEach((item, idx) => {
        doc.fillColor('#111').fontSize(11).text(`${idx + 1}. ${item.category || 'General'} (${item.impact || 'Unknown'} impact)`);
        doc.moveDown(0.2);
        doc.fillColor('#333').fontSize(10).text(`Problem: ${item.problem || 'N/A'}`, { lineGap: 3 });
        doc.moveDown(0.15);
        doc.fillColor('#333').fontSize(10).text(`Solution: ${item.solution || 'N/A'}`, { lineGap: 3 });
        doc.moveDown(0.7);
      });
    }

    // Alerts section (optional)
    const alerts = Array.isArray(source.alerts) ? source.alerts : [];
    if (alerts.length) {
      doc.addPage();
      doc.fillColor('#111').fontSize(13).text('Alerts & Notifications');
      doc.moveDown(0.5);

      alerts.forEach((alert) => {
        const title = alert.title || alert.type || 'Alert';
        const category = alert.category ? ` (${alert.category})` : '';
        const time = alert.time ? ` – ${alert.time}` : '';

        doc.fillColor('#111').fontSize(11).text(`${title}${category}${time}`);
        doc.moveDown(0.15);
        doc.fillColor('#333').fontSize(10).text(alert.message || 'No details provided.', { lineGap: 3 });
        doc.moveDown(0.4);
      });
    }

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return {
    filename,
    filePath,
    reportUrl: `${getPublicBaseUrl(req)}/reports/${filename}`,
  };
}

async function sendReportOnWhatsapp({ to, reportUrl, summary }) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!sid || !token || !from) {
    return {
      status: 'skipped',
      skipped: true,
      reason: 'Twilio credentials are missing. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM.',
    };
  }

  const whatsappTo = normalizeWhatsappTo(to || process.env.ADMIN_WHATSAPP_NUMBER);
  if (!whatsappTo) {
    return {
      status: 'skipped',
      skipped: true,
      reason: 'Missing destination WhatsApp number. Provide ADMIN_WHATSAPP_NUMBER or to in request body.',
    };
  }

  const client = twilio(sid, token);
  const body = [
    'Urban Auto Report',
    summary || 'Latest analysis and recommended actions attached.',
  ].join('\n');

  const message = await client.messages.create({
    from,
    to: whatsappTo,
    body,
    mediaUrl: reportUrl ? [reportUrl] : undefined,
  });

  return {
    sid: message.sid,
    status: message.status,
    to: whatsappTo,
  };
}

async function generateAndDispatchReport({ req, source, to }) {
  const pdf = await buildReportPdf(source, req);
  const whatsapp = await sendReportOnWhatsapp({
    to,
    reportUrl: pdf.reportUrl,
    summary: source.summary,
  });

  return { pdf, whatsapp };
}

const providerCatalog = {
  traffic: ['tomtom', 'here', 'mappls', 'data_gov'],
  air: ['openaq', 'iqair', 'cpcb', 'data_gov'],
  transport: ['otd_delhi', 'railwayapi', 'data_gov'],
  waste: ['smart_cities', 'sbm_urban', 'data_gov'],
  energy: ['electricity_maps', 'grid_india', 'iex', 'data_gov'],
};

async function fetchDataGov({ resourceId, query = {} }) {
  const apiKey = requireEnv('DATA_GOV_API_KEY');

  if (!resourceId) {
    throw new Error('resourceId is required for data.gov.in integration');
  }

  const response = await http.get(`https://api.data.gov.in/resource/${resourceId}`, {
    params: {
      'api-key': apiKey,
      format: 'json',
      ...query,
    },
  });

  return {
    provider: 'data_gov',
    resourceId,
    totalRecords: safeGet(response.data, 'total', null),
    records: safeGet(response.data, 'records', []),
    raw: response.data,
  };
}

async function getTraffic(provider, query) {
  if (provider === 'tomtom') {
    const key = requireEnv('TOMTOM_API_KEY');
    const { lat, lon } = parsePoint(query);

    const response = await http.get(
      'https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json',
      { params: { key, point: `${lat},${lon}` } },
    );

    return {
      provider,
      point: { lat, lon },
      data: safeGet(response.data, 'flowSegmentData', response.data),
      raw: response.data,
    };
  }

  if (provider === 'here') {
    const apiKey = requireEnv('HERE_API_KEY');
    const { lat, lon } = parsePoint(query);

    const response = await http.get('https://data.traffic.hereapi.com/v7/flow', {
      params: {
        in: `circle:${lat},${lon};r=5000`,
        locationReferencing: 'shape',
        apiKey,
      },
    });

    return {
      provider,
      point: { lat, lon },
      data: response.data,
    };
  }

  if (provider === 'mappls') {
    const apiKey = requireEnv('MAPPLS_API_KEY');
    const baseUrl = process.env.MAPPLS_TRAFFIC_BASE_URL;

    if (!baseUrl) {
      throw new Error('Missing environment variable: MAPPLS_TRAFFIC_BASE_URL');
    }

    const response = await http.get(baseUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
      params: query,
    });

    return {
      provider,
      data: response.data,
    };
  }

  if (provider === 'data_gov') {
    return fetchDataGov({ resourceId: query.resourceId, query });
  }

  throw new Error(`Unsupported traffic provider: ${provider}`);
}

async function getAir(provider, query) {
  if (provider === 'openaq') {
    const city = query.city;

    const response = await http.get('https://api.openaq.org/v3/locations', {
      params: {
        country: 'IN',
        city,
        limit: Number(query.limit || 50),
      },
      headers: process.env.OPENAQ_API_KEY
        ? { 'X-API-Key': process.env.OPENAQ_API_KEY }
        : undefined,
    });

    return {
      provider,
      city: city || null,
      data: response.data,
    };
  }

  if (provider === 'iqair') {
    const key = requireEnv('IQAIR_API_KEY');
    const city = query.city || 'Delhi';
    const state = query.state || 'Delhi';

    const response = await http.get('https://api.airvisual.com/v2/city', {
      params: {
        city,
        state,
        country: 'India',
        key,
      },
    });

    return {
      provider,
      city,
      state,
      data: response.data,
    };
  }

  if (provider === 'cpcb') {
    const baseUrl = process.env.CPCB_BASE_URL;
    if (!baseUrl) {
      throw new Error('Missing environment variable: CPCB_BASE_URL');
    }

    const response = await http.get(baseUrl, { params: query });

    return {
      provider,
      data: response.data,
    };
  }

  if (provider === 'data_gov') {
    return fetchDataGov({ resourceId: query.resourceId, query });
  }

  throw new Error(`Unsupported air provider: ${provider}`);
}

async function getTransport(provider, query) {
  if (provider === 'otd_delhi') {
    const baseUrl = process.env.OTD_BASE_URL || 'https://otd.delhi.gov.in';
    const path = query.path || '/api/realtime/vehicle-positions';

    const response = await http.get(`${baseUrl}${path}`, {
      headers: process.env.OTD_API_TOKEN
        ? { Authorization: `Bearer ${process.env.OTD_API_TOKEN}` }
        : undefined,
    });

    return {
      provider,
      data: response.data,
      source: `${baseUrl}${path}`,
    };
  }

  if (provider === 'railwayapi') {
    const apiKey = requireEnv('RAILWAY_API_KEY');
    const trainNo = query.trainNo;

    if (!trainNo) {
      throw new Error('trainNo query parameter is required for railwayapi provider');
    }

    const response = await http.get(`https://api.railwayapi.com/v2/live/train/${trainNo}/apikey/${apiKey}/`);

    return {
      provider,
      trainNo,
      data: response.data,
    };
  }

  if (provider === 'data_gov') {
    return fetchDataGov({ resourceId: query.resourceId, query });
  }

  throw new Error(`Unsupported transport provider: ${provider}`);
}

async function getWaste(provider, query) {
  if (provider === 'smart_cities') {
    const baseUrl = process.env.SMART_CITIES_BASE_URL || 'https://smartcities.gov.in';
    const path = query.path || '/';

    const response = await http.get(`${baseUrl}${path}`, { params: query });

    return {
      provider,
      source: `${baseUrl}${path}`,
      data: response.data,
    };
  }

  if (provider === 'sbm_urban') {
    const baseUrl = process.env.SBM_URBAN_BASE_URL || 'https://sbmurban.org';
    const path = query.path || '/';

    const response = await http.get(`${baseUrl}${path}`, { params: query });

    return {
      provider,
      source: `${baseUrl}${path}`,
      data: response.data,
    };
  }

  if (provider === 'data_gov') {
    return fetchDataGov({ resourceId: query.resourceId, query });
  }

  throw new Error(`Unsupported waste provider: ${provider}`);
}

async function getEnergy(provider, query) {
  if (provider === 'electricity_maps') {
    const token = requireEnv('ELECTRICITY_MAPS_API_KEY');

    const response = await http.get('https://api.electricitymap.org/v3/power-breakdown/latest', {
      params: { zone: query.zone || 'IN-SO' },
      headers: { 'auth-token': token },
    });

    return {
      provider,
      zone: query.zone || 'IN-SO',
      data: response.data,
    };
  }

  if (provider === 'grid_india') {
    const baseUrl = process.env.GRID_INDIA_BASE_URL || 'https://grid-india.in';
    const path = query.path || '/real-time-data';

    const response = await http.get(`${baseUrl}${path}`, { params: query });

    return {
      provider,
      source: `${baseUrl}${path}`,
      data: response.data,
    };
  }

  if (provider === 'iex') {
    const baseUrl = process.env.IEX_BASE_URL || 'https://www.iexindia.com';
    const path = query.path || '/';

    const response = await http.get(`${baseUrl}${path}`, { params: query });

    return {
      provider,
      source: `${baseUrl}${path}`,
      data: response.data,
    };
  }

  if (provider === 'data_gov') {
    return fetchDataGov({ resourceId: query.resourceId, query });
  }

  throw new Error(`Unsupported energy provider: ${provider}`);
}

async function handleDomainRequest(req, res, getter, domain) {
  try {
    const provider = String(req.query.provider || '').trim().toLowerCase();

    if (!provider) {
      return res.status(400).json({
        error: 'Missing provider query parameter',
        supportedProviders: providerCatalog[domain],
      });
    }

    const payload = await getter(provider, req.query);
    return res.json({
      ok: true,
      domain,
      provider,
      payload,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const status = error.response?.status || 500;
    return res.status(status).json({
      ok: false,
      domain,
      error: error.message,
      providerResponse: error.response?.data || null,
    });
  }
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'urban-backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/providers', (_req, res) => {
  res.json({
    ok: true,
    providers: providerCatalog,
  });
});

app.get('/api/traffic', (req, res) => handleDomainRequest(req, res, getTraffic, 'traffic'));
app.get('/api/air', (req, res) => handleDomainRequest(req, res, getAir, 'air'));
app.get('/api/transport', (req, res) => handleDomainRequest(req, res, getTransport, 'transport'));
app.get('/api/waste', (req, res) => handleDomainRequest(req, res, getWaste, 'waste'));
app.get('/api/energy', (req, res) => handleDomainRequest(req, res, getEnergy, 'energy'));

app.get('/api/reports/latest-source', (_req, res) => {
  res.json({ ok: true, source: latestReportSource });
});

app.post('/api/reports/source', (req, res) => {
  const body = req.body || {};
  const next = {
    city: body.city || latestReportSource.city,
    area: body.area || latestReportSource.area,
    generatedAt: body.generatedAt || new Date().toISOString(),
    summary: body.summary || latestReportSource.summary,
    insights: Array.isArray(body.insights) ? body.insights : latestReportSource.insights,
  };

  latestReportSource = next;
  res.json({ ok: true, source: latestReportSource });
});

app.post('/api/reports/generate', async (req, res) => {
  try {
    const source = req.body?.source || latestReportSource;
    const pdf = await buildReportPdf(source, req);
    return res.json({ ok: true, pdf, source });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/api/reports/send-whatsapp', async (req, res) => {
  try {
    const reportUrl = req.body?.reportUrl;
    const summary = req.body?.summary || latestReportSource.summary;
    const to = req.body?.to;

    const whatsapp = await sendReportOnWhatsapp({ to, reportUrl, summary });
    return res.json({ ok: true, whatsapp });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/api/reports/dispatch', async (req, res) => {
  try {
    const source = req.body?.source || latestReportSource;
    const to = req.body?.to;
    const result = await generateAndDispatchReport({ req, source, to });
    return res.json({ ok: true, source, ...result });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.listen(port, () => {
  console.log(`Urban backend running on http://localhost:${port}`);
});

if (process.env.AUTO_REPORT_ENABLED === 'true') {
  const cronExpr = process.env.AUTO_REPORT_CRON || '0 9 * * *';
  cron.schedule(cronExpr, async () => {
    try {
      const fakeReq = {
        protocol: 'http',
        get: (name) => (name.toLowerCase() === 'host' ? `localhost:${port}` : ''),
        headers: {},
      };
      await generateAndDispatchReport({ req: fakeReq, source: latestReportSource, to: process.env.ADMIN_WHATSAPP_NUMBER });
      console.log(`[auto-report] Sent successfully at ${new Date().toISOString()}`);
    } catch (error) {
      console.error('[auto-report] Failed:', error.message);
    }
  });
  console.log(`[auto-report] Scheduler enabled: ${cronExpr}`);
}
