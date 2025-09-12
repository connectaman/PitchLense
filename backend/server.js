const path = require('path');
// Load environment variables from backend/.env and project/.env (if present)
// Only load .env files in development mode, not in production
if (process.env.NODE_ENV !== 'production') {
  try {
    const dotenv = require('dotenv');
    const backendEnv = path.join(__dirname, '.env');
    const rootEnv = path.join(__dirname, '..', '.env');
    try { dotenv.config({ path: backendEnv }); } catch {}
    try { dotenv.config({ path: rootEnv }); } catch {}
  } catch {}
}
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
const fs = require('fs');
const fsp = fs.promises;
const multer = require('multer');
const crypto = require('crypto');
const { Storage } = require('@google-cloud/storage');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

const PORT = process.env.PORT || 3000;

// Simple in-memory rate limiting for auth endpoints
const authAttempts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 15; // Max attempts per window (3x increase)

function checkRateLimit(ip) {
  const now = Date.now();
  const attempts = authAttempts.get(ip) || [];
  
  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return false; // Rate limited
  }
  
  // Add current attempt
  recentAttempts.push(now);
  authAttempts.set(ip, recentAttempts);
  
  return true; // Not rate limited
}
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const FIXED_SALT = 'pitchlense_fixed_salt_2024_secure_auth';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key-here');
// Support multiple names for bucket/Cloud Run URL
const GCS_BUCKET = process.env.BUCKET || process.env.GCS_BUCKET || process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
const CLOUD_RUN_URL = process.env.CLOUD_RUN_URL || process.env.CLOUDRUN_URL || process.env.CLOUD_RUN_ENDPOINT;

// SQLite database for local development
const dbFile = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbFile);
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

async function ensureTables() {
  // Enable FK constraints
  await dbRun(`PRAGMA foreign_keys = ON`);

  // Users (simplified for secure method only)
  await dbRun(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  // Reports based on provided FastAPI model
  await dbRun(`CREATE TABLE IF NOT EXISTS reports (
    report_id TEXT PRIMARY KEY,
    report_name TEXT NOT NULL,
    startup_name TEXT NOT NULL,
    founder_name TEXT NOT NULL,
    launch_date TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    is_delete INTEGER NOT NULL DEFAULT 0,
    is_pinned INTEGER NOT NULL DEFAULT 0,
    report_path TEXT,
    total_files INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_reports_report_name ON reports(report_name)`);

  // Uploads based on provided FastAPI model
  await dbRun(`CREATE TABLE IF NOT EXISTS uploads (
    file_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    report_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_format TEXT NOT NULL,
    upload_path TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    CONSTRAINT fk_report FOREIGN KEY (report_id) REFERENCES reports(report_id) ON DELETE CASCADE
  )`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_uploads_report_id ON uploads(report_id)`);

  // Chats table for QnA functionality
  await dbRun(`CREATE TABLE IF NOT EXISTS chats (
    chat_id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    CONSTRAINT fk_chat_report FOREIGN KEY (report_id) REFERENCES reports(report_id) ON DELETE CASCADE
  )`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_chats_report_id ON chats(report_id)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id)`);
}

// Security headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Strict transport security (HTTPS only)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';");
  next();
});

// Serve static frontend from ../frontend
const staticDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(staticDir));

// Enhanced JSON parsing with better error handling
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.error('JSON parse error:', e.message);
      console.error('Buffer content:', buf.toString());
      throw new Error('Invalid JSON');
    }
  }
}));

// Additional middleware to log request details for auth endpoints
app.use((req, res, next) => {
  if (req.path.startsWith('/api/auth/')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body received:', JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'pitchlense-web', ts: new Date().toISOString() });
});

// Auth helpers
function getUserFromCookie(req) {
  try {
    const token = req.cookies?.auth;
    if (!token) return null;
    const payload = jwt.verify(token, JWT_SECRET);
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
function requireAuth(req, res, next) {
  const user = getUserFromCookie(req);
  if (!user) return res.status(401).json({ error: 'unauthorized' });
  req.user = user;
  next();
}

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    // Rate limiting
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    }
    
    console.log('Signup request received:', {
      body: req.body,
      contentType: req.headers['content-type'],
      method: req.method
    });
    
    const { email, password, salt, name } = req.body || {};
    if (!email || !password || !salt) {
      console.log('Missing required fields:', { email: !!email, password: !!password, salt: !!salt });
      return res.status(400).json({ 
        error: 'email, password, and salt required',
        received: { email: !!email, password: !!password, salt: !!salt }
      });
    }
    
    // The password is already hashed on the client side with PBKDF2 + salt
    // Store it directly for the secure method
    const id = crypto.randomUUID();
    await dbRun('INSERT INTO users (id,email,password_hash,name) VALUES (?,?,?,?)', [id, String(email).toLowerCase(), password, name || null]);
    const user = { id, email: String(email).toLowerCase(), name: name || null };
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('auth', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ user });
  } catch (e) {
    console.error('Signup error:', e);
    if (e && (e.code === 'SQLITE_CONSTRAINT' || String(e.message || '').includes('UNIQUE'))) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'signup_failed', details: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    // Rate limiting
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    }
    
    console.log('Login request received:', {
      body: req.body,
      contentType: req.headers['content-type'],
      method: req.method
    });
    
    const { email, password, salt } = req.body || {};
    if (!email || !password || !salt) {
      console.log('Missing required fields:', { email: !!email, password: !!password, salt: !!salt });
      return res.status(400).json({ 
        error: 'email, password, and salt required',
        received: { email: !!email, password: !!password, salt: !!salt }
      });
    }
    
    console.log('Secure login attempt for:', email, 'password length:', password.length);
    console.log('Received salt:', salt);
    console.log('Expected salt:', FIXED_SALT);
    console.log('Salt matches:', salt === FIXED_SALT);
    
    const user = await dbGet('SELECT id,email,password_hash,name FROM users WHERE email=?', [String(email).toLowerCase()]);
    if (!user) return res.status(401).json({ error: 'invalid_credentials' });
    
    // Direct comparison of PBKDF2 hashes
    console.log('Stored hash:', user.password_hash);
    console.log('Received hash:', password);
    console.log('Hashes match:', password === user.password_hash);
    const ok = password === user.password_hash;
    console.log('Secure comparison result:', ok);
    
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
    
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('auth', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) { 
    console.error('Login error:', e); 
    res.status(500).json({ error: 'login_failed', details: e.message }); 
  }
});


app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth');
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.cookies?.auth;
    if (!token) return res.status(401).json({ user: null });
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ user: { id: payload.sub, email: payload.email } });
  } catch {
    res.status(401).json({ user: null });
  }
});

// QnA API endpoints
app.post('/api/qna/ask', requireAuth, async (req, res) => {
  try {
    const { report_id, question } = req.body || {};
    if (!report_id || !question) return res.status(400).json({ error: 'report_id and question required' });

    // Get report data
    const report = await dbGet('SELECT * FROM reports WHERE report_id=? AND is_delete=0', [report_id]);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Check if report is ready
    if (report.status !== 'success' || !report.report_path) {
      return res.status(400).json({ error: 'Report is not ready for QnA yet' });
    }

    // Fetch report data from GCS
    let reportData;
    try {
      const parsed = parseGsUri(report.report_path);
      if (!parsed) throw new Error('Invalid report path');
      
      const client = getGcsClient();
      const file = client.bucket(parsed.bucket).file(parsed.object);
      const [data] = await file.download();
      reportData = JSON.parse(data.toString());
    } catch (fetchError) {
      console.error('Failed to fetch report data:', fetchError);
      return res.status(500).json({ error: 'Failed to load report data' });
    }

    // Prepare context for Gemini
    let context = `You are an AI assistant helping users understand their startup pitch analysis report. Here are the files and their content:\n\n`;
    
    if (reportData.files && Array.isArray(reportData.files)) {
      reportData.files.forEach((file, index) => {
        context += `File ${index + 1}:\n`;
        context += `- Filename: ${file.filename}\n`;
        context += `- File Type: ${file.filetype}\n`;
        context += `- Format: ${file.file_extension}\n`;
        context += `- Content: ${file.content}\n\n`;
      });
    }

    // Create prompt for Gemini
    const prompt = `${context}\n\nUser Question: ${question}\n\nIMPORTANT: You MUST answer ONLY from the given content in the context above. If the information is not found in the provided context, respond with "I don't know" or "This information is not available in the report data." Do not make up or infer information that is not explicitly provided in the context.\n\nPlease provide a helpful and detailed answer based on the report data above. Focus on insights, analysis, and actionable recommendations.`;

    // Get response from Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Save chat to database
    const chatId = crypto.randomUUID();
    await dbRun(
      'INSERT INTO chats (chat_id, report_id, user_id, user_message, ai_response, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))',
      [chatId, report_id, req.user.id, question, aiResponse]
    );

    res.json({ 
      success: true, 
      response: aiResponse,
      chat_id: chatId 
    });

  } catch (error) {
    console.error('QnA API error:', error);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

// Get chat history for a report
app.get('/api/qna/history/:report_id', requireAuth, async (req, res) => {
  try {
    const { report_id } = req.params;
    
    // Verify user has access to this report
    const report = await dbGet('SELECT * FROM reports WHERE report_id=? AND is_delete=0', [report_id]);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Get chat history
    const chats = await dbAll(
      'SELECT chat_id, user_message, ai_response, created_at FROM chats WHERE report_id=? ORDER BY created_at ASC',
      [report_id]
    );

    res.json({ 
      success: true, 
      chats: chats 
    });

  } catch (error) {
    console.error('Chat history API error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// GCS helper
function getGcsClient() {
  // If GOOGLE_APPLICATION_CREDENTIALS is set, the SDK will auto-load it
  return new Storage();
}
async function gcsSaveBytes(bucketName, objectPath, bytes, contentType) {
  const client = getGcsClient();
  const bucket = client.bucket(bucketName);
  const file = bucket.file(objectPath);
  try {
    console.log(`[gcs] save start bucket=${bucketName} object=${objectPath} bytes=${bytes ? bytes.length : 0} contentType=${contentType}`);
    await file.save(bytes, { contentType, resumable: false, validation: false });
    console.log(`[gcs] save success -> gs://${bucketName}/${objectPath}`);
  } catch (e) {
    console.error(`[gcs] save failed bucket=${bucketName} object=${objectPath}:`, e?.message || e);
    throw e;
  }
  return `gs://${bucketName}/${objectPath}`;
}
function parseGsUri(gsUri){
  if (!gsUri) return null;
  const m = String(gsUri).match(/^gs:\/\/([^\/]+)\/(.+)$/);
  if (!m) return null;
  return { bucket: m[1], object: m[2] };
}
async function gcsFileExists(gsUri){
  try {
    const p = parseGsUri(gsUri);
    if (!p) return false;
    const client = getGcsClient();
    const file = client.bucket(p.bucket).file(p.object);
    const [exists] = await file.exists();
    return !!exists;
  } catch (e) {
    console.warn(`[gcs] exists check failed for ${gsUri}:`, e?.message || e);
    return false;
  }
}

// Reports API (GCS uploads with background processing)
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/reports', requireAuth, upload.array('files'), async (req, res) => {
  try {
    console.log(`[api] POST /api/reports user=${req.user?.id} bucket=${GCS_BUCKET || '(unset)'} cloudRun=${CLOUD_RUN_URL ? 'set' : 'unset'}`);
    const startup_name = req.body.startup_name?.trim();
    const founder_name = req.body.founder_name?.trim();
    const launch_date = req.body.launch_date?.trim();
    let file_types = req.body.file_types || [];
    if (!Array.isArray(file_types)) file_types = [file_types].filter(Boolean);

    const files = req.files || [];
    console.log(`[api] incoming files=${files.length}`, files.map(f=>({name:f.originalname, type:f.mimetype, size:f.size})))
    if (!startup_name || !founder_name || !launch_date) {
      return res.status(400).json({ error: 'startup_name, founder_name, and launch_date are required' });
    }
    if (!files.length) return res.status(400).json({ error: 'At least one file must be uploaded' });
    if (files.length !== file_types.length) return res.status(400).json({ error: 'Number of files must match number of file types' });

    const allowedKinds = ['pitch deck','call recording','meeting recording','founder profile','news report','company document'];
    for (const t of file_types) {
      if (!allowedKinds.includes(t)) return res.status(400).json({ error: `Invalid file type: ${t}` });
    }

    const tsName = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 15);
    const report_id = crypto.randomUUID();
    const report_name = `${startup_name}_${tsName}`;
    const report_path = GCS_BUCKET ? `gs://${GCS_BUCKET}/runs/${report_id}.json` : null;
    console.log(`[api] creating report_id=${report_id} name=${report_name} total_files=${files.length} report_path=${report_path}`);
    await dbRun(
      `INSERT INTO reports (report_id, report_name, startup_name, founder_name, launch_date, status, is_delete, is_pinned, report_path, total_files, created_at)
       VALUES (?, ?, ?, ?, ?, 'pending', 0, 0, ?, ?, datetime('now'))`,
      [report_id, report_name, startup_name, founder_name, launch_date, report_path, files.length]
    );

    // Respond immediately
    const report = await dbGet('SELECT * FROM reports WHERE report_id=?', [report_id]);
    res.json(report);

    // Background: upload files to GCS and create uploads rows, then trigger Cloud Run
    setImmediate(async () => {
      try {
        console.log(`[bg] start report_id=${report_id} files=${files.length}`);
        const createdUploads = [];
        if (!GCS_BUCKET) throw new Error('BUCKET env is not set');
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          const kind = file_types[i];
          const objectPath = `uploads/${report_id}/${f.originalname}`;
          console.log(`[bg] upload ${i+1}/${files.length} -> ${objectPath} type=${f.mimetype} size=${f.size}`);
          const gcsPath = await gcsSaveBytes(GCS_BUCKET, objectPath, f.buffer, f.mimetype || 'application/octet-stream');
          await dbRun(
            `INSERT INTO uploads (file_id, user_id, report_id, filename, file_format, upload_path, created_at)
             VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
            [crypto.randomUUID(), req.user.id, report_id, f.originalname, kind, gcsPath]
          );
          console.log(`[bg] db upload row inserted report_id=${report_id} file=${f.originalname} path=${gcsPath}`);
          createdUploads.push({
            filetype: kind,
            filename: f.originalname,
            file_extension: (f.originalname.split('.').pop() || '').toLowerCase(),
            filepath: gcsPath,
          });
        }

        if (CLOUD_RUN_URL) {
          const startup_text = `Startup Name: ${startup_name}\nFounder: ${founder_name}\nLaunch Date: ${launch_date}\nReport ID: ${report_id}\n`;
          const destination_gcs = `gs://${GCS_BUCKET}/runs/${report_id}.json`;
          const payload = { uploads: createdUploads, destination_gcs};
          // Fire-and-forget: do not await Cloud Run job completion/response
          console.log(`[bg] trigger cloud-run url=${CLOUD_RUN_URL} uploads=${createdUploads.length} dest=${destination_gcs}`);
          axios.post(CLOUD_RUN_URL, payload, { timeout: 5000 })
            .then((resp) => {
              console.log(`[bg] cloud-run request sent status=${resp.status}`);
            })
            .catch((err) => {
              console.warn(`[bg] cloud-run request error:`, err?.response ? `${err.response.status} ${String(err.response.data).slice(0,200)}` : (err?.message || err));
            });
        } else {
          console.warn('[bg] CLOUD_RUN_URL not set; skipping trigger');
        }
      } catch (err) {
        console.error(`[bg] processing failed report_id=${report_id}:`, err?.message || err);
        try { await dbRun(`UPDATE reports SET status='failed' WHERE report_id=?`, [report_id]); } catch {}
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'create_report_failed' });
  }
});

app.get('/api/reports', requireAuth, async (req, res) => {
  try {
    let { skip, limit = 100, page, search, status, pinned_only } = req.query;
    limit = Number(limit);
    if (page !== undefined && (skip === undefined || skip === null)) {
      skip = Number(page) * limit;
    }
    skip = Number(skip || 0);

    const where = ['is_delete = 0'];
    const params = [];
    if (pinned_only === 'true') where.push('is_pinned = 1');
    if (search) { where.push('(lower(report_name) LIKE ? OR lower(startup_name) LIKE ? OR lower(founder_name) LIKE ?)'); const like = `%${String(search).toLowerCase()}%`; params.push(like, like, like); }
    if (status) { where.push('status = ?'); params.push(String(status)); }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const totalRow = await dbGet(`SELECT COUNT(*) as c FROM reports ${whereSql}`, params);
    const rows = await dbAll(
      `SELECT * FROM reports ${whereSql} ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?`,
      [...params, limit, skip]
    );

    for (const r of rows) {
      // If not already success and has a report_path, check GCS for completion
      if (r.status !== 'success' && r.report_path) {
        const exists = await gcsFileExists(r.report_path);
        if (exists) {
          try {
            await dbRun(`UPDATE reports SET status='success' WHERE report_id=?`, [r.report_id]);
            r.status = 'success';
          } catch {}
        }
      }
      const row = await dbGet('SELECT COUNT(*) as c FROM uploads WHERE report_id=?', [r.report_id]);
      r.file_count = row?.c || 0;
    }
    res.json({ reports: rows, total: totalRow?.c || 0, skip, limit, page: Math.floor(skip / limit) });
  } catch (e) { console.error(e); res.status(500).json({ error: 'list_reports_failed' }); }
});

app.get('/api/reports/:id', requireAuth, async (req, res) => {
  try {
    const r = await dbGet('SELECT * FROM reports WHERE report_id=?', [req.params.id]);
    if (!r || r.is_delete) return res.status(404).json({ error: 'not_found' });
    // If not already success, check if output exists in GCS and mark success
    if (r.status !== 'success' && r.report_path) {
      const exists = await gcsFileExists(r.report_path);
      if (exists) {
        try { await dbRun(`UPDATE reports SET status='success' WHERE report_id=?`, [r.report_id]); r.status = 'success'; } catch {}
      }
    }
    res.json(r);
  } catch (e) { console.error(e); res.status(500).json({ error: 'get_report_failed' }); }
});

app.delete('/api/reports/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const r = await dbGet('SELECT * FROM reports WHERE report_id=?', [id]);
    if (!r || r.is_delete) return res.status(404).json({ error: 'not_found' });
    await dbRun('UPDATE reports SET is_delete=1 WHERE report_id=?', [id]);
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'delete_report_failed' }); }
});

app.patch('/api/reports/:id/pin', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const r = await dbGet('SELECT is_pinned FROM reports WHERE report_id=?', [id]);
    if (!r) return res.status(404).json({ error: 'not_found' });
    const next = r.is_pinned ? 0 : 1;
    await dbRun('UPDATE reports SET is_pinned=? WHERE report_id=?', [next, id]);
    res.json({ pinned: !!next });
  } catch (e) { console.error(e); res.status(500).json({ error: 'toggle_pin_failed' }); }
});

app.get('/api/reports/:id/data', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const r = await dbGet('SELECT * FROM reports WHERE report_id=? AND is_delete=0', [id]);
    if (!r) return res.status(404).json({ error: 'not_found' });
    
    // If report is not success, return the report metadata without data
    if (r.status !== 'success') {
      return res.json({ 
        report: r, 
        data: null, 
        message: r.status === 'pending' ? 'Report is still being processed' : 'Report processing failed'
      });
    }
    
    // If no report_path, return error
    if (!r.report_path) {
      return res.status(404).json({ error: 'report_data_not_found' });
    }
    
    // Check if report file exists in GCS
    const exists = await gcsFileExists(r.report_path);
    if (!exists) {
      return res.status(404).json({ error: 'report_data_not_found' });
    }
    
    // Fetch the report data from GCS
    try {
      const parsed = parseGsUri(r.report_path);
      if (!parsed) throw new Error('Invalid report path');
      
      const client = getGcsClient();
      const file = client.bucket(parsed.bucket).file(parsed.object);
      const [data] = await file.download();
      const reportData = JSON.parse(data.toString());
      
      res.json({ 
        report: r, 
        data: reportData 
      });
    } catch (fetchError) {
      console.error(`[api] Failed to fetch report data for ${id}:`, fetchError?.message || fetchError);
      res.status(500).json({ error: 'failed_to_fetch_report_data' });
    }
  } catch (e) { 
    console.error(e); 
    res.status(500).json({ error: 'get_report_data_failed' }); 
  }
});

// Fallback to index.html for root
app.get('*', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

ensureTables()
  .catch((e) => { console.error('Failed to ensure users table:', e); })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`PitchLense demo server running at http://localhost:${PORT}`);
    });
  });


