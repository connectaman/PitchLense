const path = require('path');
// Load environment variables from backend/.env and project/.env (if present)
// Only load .env files in development mode, not in production
try {
  const dotenv = require('dotenv');
  const backendEnv = path.join(__dirname, '.env');
  const rootEnv = path.join(__dirname, '..', '.env');
  try { dotenv.config({ path: backendEnv }); } catch {}
  try { dotenv.config({ path: rootEnv }); } catch {}
} catch {}
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const { promisify } = require('util');
const fs = require('fs');
const fsp = fs.promises;
const multer = require('multer');
const crypto = require('crypto');
const { Storage } = require('@google-cloud/storage');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
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

// MySQL database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'Pitchlense@2025',
  database: process.env.DB_NAME || 'pitchlense',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  // Cloud SQL connection settings
  socketPath: process.env.INSTANCE_UNIX_SOCKET || null,
  // Connection pool settings (MySQL2 compatible)
  connectionLimit: 10,
  queueLimit: 0,
  // Connection timeout settings
  connectTimeout: 60000,
  // Additional options for better reliability
  charset: 'utf8mb4',
  timezone: 'Z'
};

// Create MySQL connection pool
let db;
let dbRun, dbGet, dbAll;

// Helper function to get database name from environment
function getDbName() {
  return process.env.DB_NAME || 'pitchlense';
}

// Helper function to format table names with database prefix
function tableName(table) {
  return `${getDbName()}.${table}`;
}

async function initializeDatabase() {
  try {
    // Remove socketPath if not set
    if (!dbConfig.socketPath) {
      delete dbConfig.socketPath;
    }
    
    console.log('Connecting to MySQL database...', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      ssl: !!dbConfig.ssl,
      socketPath: !!dbConfig.socketPath
    });
    
    db = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await db.getConnection();
    console.log('✅ Successfully connected to MySQL database');
    connection.release();
    
    // Create wrapper functions for compatibility
    dbRun = async (query, params = []) => {
      const [result] = await db.execute(query, params);
      return result;
    };
    
    dbGet = async (query, params = []) => {
      const [rows] = await db.execute(query, params);
      return rows[0] || null;
    };
    
    dbAll = async (query, params = []) => {
      const [rows] = await db.execute(query, params);
      return rows;
    };
    
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:', error);
    throw error;
  }
}

async function checkTables() {
  try {
    console.log('Checking if database tables exist...');
    
    const tables = ['users', 'reports', 'uploads', 'chats'];
    const existingTables = [];
    const missingTables = [];
    
    for (const table of tables) {
      try {
        await dbAll(`DESCRIBE ${tableName(table)}`);
        existingTables.push(table);
        console.log(`✅ Table ${tableName(table)} exists`);
      } catch (e) {
        missingTables.push(table);
        console.log(`❌ Table ${tableName(table)} does not exist`);
      }
    }
    
    if (missingTables.length > 0) {
      console.log(`\n⚠️  Missing tables: ${missingTables.join(', ')}`);
      console.log('💡 Please run the SQL setup script to create the missing tables.');
      console.log('📄 See backend/setup-database.sql for the complete setup script.');
    } else {
      console.log('\n✅ All required tables exist and are accessible');
    }
    
    return { existingTables, missingTables };
    
  } catch (error) {
    console.error('❌ Error checking database tables:', error);
    throw error;
  }
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
  // Content Security Policy - Allow YouTube embeds
  const csp = 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://unpkg.com https://d3js.org; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https:; " +
    "frame-src 'self' https://www.youtube.com https://youtube.com https://*.youtube.com https://*.ytimg.com https://storage.googleapis.com; " +
    "media-src 'self' https://www.youtube.com https://youtube.com; " +
    "object-src 'none'; " +
    "base-uri 'self';";
  
  res.setHeader('Content-Security-Policy', csp);
  console.log('CSP Header set:', csp);
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

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'pitchlense-api', ts: new Date().toISOString() });
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
    await dbRun(`INSERT INTO ${tableName('users')} (id,email,password_hash,name) VALUES (?,?,?,?)`, [id, String(email).toLowerCase(), password, name || null]);
    const user = { id, email: String(email).toLowerCase(), name: name || null };
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('auth', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ user });
  } catch (e) {
    console.error('Signup error:', e);
    // Check for MySQL duplicate entry error (code 1062) or unique constraint violations
    if (e && (e.code === 'ER_DUP_ENTRY' || e.code === 1062 || String(e.message || '').includes('Duplicate entry') || String(e.message || '').includes('UNIQUE'))) {
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
    
    const user = await dbGet(`SELECT id,email,password_hash,name FROM ${tableName('users')} WHERE email=?`, [String(email).toLowerCase()]);
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
    const report = await dbGet(`SELECT * FROM ${tableName('reports')} WHERE report_id=? AND user_id=? AND is_delete=0`, [report_id, req.user.id]);
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
    const prompt = `${context}\n\nUser Question: ${question}\n\nIMPORTANT INSTRUCTIONS:\n1. You MUST answer ONLY from the relevant content in the context above. You are NOT required to use information from all files - only use information that is directly relevant to answering the user's question.\n2. If the information is not found in the provided context, respond with "I don't know" or "This information is not available in the report data."\n3. Do not make up or infer information that is not explicitly provided in the context.\n4. At the end of your response, you MUST list all the specific files/sources you used to answer the question. Format this as "Sources used: [list the specific filenames and file types you referenced]"\n5. If you didn't use any files to answer the question, state "Sources used: None - information not available in the provided data."\n\nPlease provide a helpful and detailed answer based on the relevant report data above. Focus on insights, analysis, and actionable recommendations.`;

    // Get response from Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Save chat to database
    const chatId = crypto.randomUUID();
    await dbRun(
      `INSERT INTO ${tableName('chats')} (chat_id, report_id, user_id, user_message, ai_response, created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
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
    const report = await dbGet(`SELECT * FROM ${tableName('reports')} WHERE report_id=? AND user_id=? AND is_delete=0`, [report_id, req.user.id]);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Get chat history
    const chats = await dbAll(
      `SELECT chat_id, user_message, ai_response, created_at FROM ${tableName('chats')} WHERE report_id=? AND user_id=? ORDER BY created_at ASC`,
      [report_id, req.user.id]
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

// General Pitch Analysis API (for content script)
app.post('/api/analyze', async (req, res) => {
  try {
    const { text, url, title } = req.body || {};
    
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: 'Text content is required and must be at least 10 characters' });
    }

    console.log(`[api] Pitch analysis request: url=${url} title=${title} contentLength=${text.length}`);

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
      throw new Error('GEMINI_API_KEY is not set. Please configure your Gemini API key.');
    }

    // Initialize Gemini AI model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Create a specialized prompt for general pitch analysis
    const prompt = `
You are an expert business analyst specializing in evaluating pitches, proposals, and business content. Analyze the following content and provide a comprehensive assessment focusing on:

1. Overall effectiveness as a business pitch or proposal
2. Clarity and structure
3. Persuasiveness and value proposition
4. Professional communication quality
5. Specific recommendations for improvement

Content:
${text}

Please provide your analysis in the following JSON format:
{
  "overallScore": <number from 1-10>,
  "clarity": "<rating from Poor/Fair/Good/Excellent>",
  "persuasiveness": "<rating from Poor/Fair/Good/Excellent>", 
  "structure": "<rating from Poor/Fair/Good/Excellent>",
  "feedback": "<detailed feedback about the content's strengths and weaknesses>",
  "recommendations": ["<specific recommendation 1>", "<specific recommendation 2>", "<specific recommendation 3>"],
  "keyStrengths": ["<strength 1>", "<strength 2>"],
  "areasForImprovement": ["<area 1>", "<area 2>"]
}

Focus on:
- How well the content communicates the value proposition
- Whether the call-to-action is clear and compelling
- The professional tone and structure
- Specific, actionable suggestions for improvement
- Recognition of effective elements that should be maintained

Respond ONLY with the JSON object, no additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let analysisText = response.text();

    // Clean up the response to ensure it's valid JSON
    analysisText = analysisText.trim();
    if (analysisText.startsWith('```json')) {
      analysisText = analysisText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    }
    if (analysisText.startsWith('```')) {
      analysisText = analysisText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', analysisText);
      // Fallback analysis if JSON parsing fails
      analysis = {
        overallScore: 5,
        clarity: "Fair",
        persuasiveness: "Fair", 
        structure: "Fair",
        feedback: "The content was analyzed but the response format was not as expected. Please review for clarity, professional tone, and clear value proposition.",
        recommendations: [
          "Ensure the content has a clear structure",
          "Include a compelling value proposition early",
          "End with a clear call-to-action"
        ],
        keyStrengths: ["Content was provided for analysis"],
        areasForImprovement: ["Review overall structure and clarity"]
      };
    }

    // Validate and set defaults for required fields
    analysis.overallScore = Math.max(1, Math.min(10, analysis.overallScore || 5));
    analysis.clarity = analysis.clarity || "Fair";
    analysis.persuasiveness = analysis.persuasiveness || "Fair";
    analysis.structure = analysis.structure || "Fair";
    analysis.feedback = analysis.feedback || "Content analysis completed.";
    analysis.recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];
    analysis.keyStrengths = Array.isArray(analysis.keyStrengths) ? analysis.keyStrengths : [];
    analysis.areasForImprovement = Array.isArray(analysis.areasForImprovement) ? analysis.areasForImprovement : [];

    // Add metadata
    analysis.url = url;
    analysis.title = title;
    analysis.analyzedAt = new Date().toISOString();
    analysis.contentLength = text.length;

    console.log(`[api] Pitch analysis completed: score=${analysis.overallScore} url=${url}`);

    res.json({
      success: true,
      ...analysis
    });

  } catch (error) {
    console.error('Pitch analysis API error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze content',
      details: error.message 
    });
  }
});

// Email Analysis API
app.post('/api/analyze-email', async (req, res) => {
  try {
    const { content, emailId, url, source } = req.body || {};
    
    if (!content || content.trim().length < 10) {
      return res.status(400).json({ error: 'Email content is required and must be at least 10 characters' });
    }

    console.log(`[api] Email analysis request: emailId=${emailId} source=${source} contentLength=${content.length}`);

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
      throw new Error('GEMINI_API_KEY is not set. Please configure your Gemini API key.');
    }

    // Initialize Gemini AI model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Create a specialized prompt for email proposal analysis
    const prompt = `
You are an expert business analyst specializing in evaluating email proposals and pitches. Analyze the following email content and provide a comprehensive assessment focusing on:

1. Overall effectiveness as a business proposal
2. Clarity and structure
3. Persuasiveness and value proposition
4. Professional communication quality
5. Specific recommendations for improvement

Email Content:
${content}

Please provide your analysis in the following JSON format:
{
  "overallScore": <number from 1-10>,
  "clarity": "<rating from Poor/Fair/Good/Excellent>",
  "persuasiveness": "<rating from Poor/Fair/Good/Excellent>", 
  "structure": "<rating from Poor/Fair/Good/Excellent>",
  "feedback": "<detailed feedback about the email's strengths and weaknesses>",
  "recommendations": ["<specific recommendation 1>", "<specific recommendation 2>", "<specific recommendation 3>"],
  "keyStrengths": ["<strength 1>", "<strength 2>"],
  "areasForImprovement": ["<area 1>", "<area 2>"]
}

Focus on:
- How well the email communicates the value proposition
- Whether the call-to-action is clear and compelling
- The professional tone and structure
- Specific, actionable suggestions for improvement
- Recognition of effective elements that should be maintained

Respond ONLY with the JSON object, no additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let analysisText = response.text();

    // Clean up the response to ensure it's valid JSON
    analysisText = analysisText.trim();
    if (analysisText.startsWith('```json')) {
      analysisText = analysisText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    }
    if (analysisText.startsWith('```')) {
      analysisText = analysisText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', analysisText);
      // Fallback analysis if JSON parsing fails
      analysis = {
        overallScore: 5,
        clarity: "Fair",
        persuasiveness: "Fair", 
        structure: "Fair",
        feedback: "The email content was analyzed but the response format was not as expected. Please review the email for clarity, professional tone, and clear value proposition.",
        recommendations: [
          "Ensure the email has a clear subject line",
          "Include a compelling value proposition early in the email",
          "End with a clear call-to-action"
        ],
        keyStrengths: ["Email content was provided for analysis"],
        areasForImprovement: ["Review overall structure and clarity"]
      };
    }

    // Validate and set defaults for required fields
    analysis.overallScore = Math.max(1, Math.min(10, analysis.overallScore || 5));
    analysis.clarity = analysis.clarity || "Fair";
    analysis.persuasiveness = analysis.persuasiveness || "Fair";
    analysis.structure = analysis.structure || "Fair";
    analysis.feedback = analysis.feedback || "Email analysis completed.";
    analysis.recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];
    analysis.keyStrengths = Array.isArray(analysis.keyStrengths) ? analysis.keyStrengths : [];
    analysis.areasForImprovement = Array.isArray(analysis.areasForImprovement) ? analysis.areasForImprovement : [];

    // Add metadata
    analysis.emailId = emailId;
    analysis.source = source || 'gmail';
    analysis.analyzedAt = new Date().toISOString();
    analysis.contentLength = content.length;

    console.log(`[api] Email analysis completed: score=${analysis.overallScore} emailId=${emailId}`);

    res.json({
      success: true,
      ...analysis
    });

  } catch (error) {
    console.error('Email analysis API error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze email',
      details: error.message 
    });
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

    const report_id = crypto.randomUUID();
    const report_name = startup_name;
    const report_path = GCS_BUCKET ? `gs://${GCS_BUCKET}/runs/${report_id}.json` : null;
    console.log(`[api] creating report_id=${report_id} name=${report_name} total_files=${files.length} report_path=${report_path}`);
    await dbRun(
      `INSERT INTO ${tableName('reports')} (report_id, user_id, report_name, startup_name, founder_name, launch_date, status, is_delete, is_pinned, report_path, total_files, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, 0, ?, ?, NOW())`,
      [report_id, req.user.id, report_name, startup_name, founder_name, launch_date, report_path, files.length]
    );

    // Respond immediately
    const report = await dbGet(`SELECT * FROM ${tableName('reports')} WHERE report_id=?`, [report_id]);
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
            `INSERT INTO ${tableName('uploads')} (file_id, user_id, report_id, filename, file_format, upload_path, created_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
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
          const payload = { 
            company_name: startup_name,
            uploads: createdUploads, 
            destination_gcs
          };
          // Fire-and-forget: do not await Cloud Run job completion/response
          console.log(`[bg] trigger cloud-run url=${CLOUD_RUN_URL} company=${startup_name} uploads=${createdUploads.length} dest=${destination_gcs}`);
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
        try { await dbRun(`UPDATE ${tableName('reports')} SET status='failed' WHERE report_id=?`, [report_id]); } catch {}
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'create_report_failed' });
  }
});

app.get('/api/reports', requireAuth, async (req, res) => {
  try {
    // Validate user authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    let { skip, limit = 100, page, search, status, pinned_only } = req.query;
    limit = parseInt(limit, 10);
    if (page !== undefined && (skip === undefined || skip === null)) {
      skip = parseInt(page, 10) * limit;
    }
    skip = parseInt(skip || 0, 10);

    const where = ['is_delete = 0', 'user_id = ?'];
    const params = [String(req.user.id)]; // Ensure user_id is string
    if (pinned_only === 'true') where.push('is_pinned = 1');
    if (search) { 
      where.push('(lower(report_name) LIKE ? OR lower(startup_name) LIKE ? OR lower(founder_name) LIKE ?)'); 
      const like = `%${String(search).toLowerCase()}%`; 
      params.push(like, like, like); 
    }
    if (status) { 
      where.push('status = ?'); 
      params.push(String(status)); 
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const totalRow = await dbGet(`SELECT COUNT(*) as c FROM ${tableName('reports')} ${whereSql}`, params);
    
    // Ensure all parameters are properly typed for MySQL
    const limitInt = parseInt(limit, 10);
    const skipInt = parseInt(skip, 10);
    
    // Validate parameters
    if (isNaN(limitInt) || limitInt < 0) {
      throw new Error(`Invalid limit parameter: ${limit}`);
    }
    if (isNaN(skipInt) || skipInt < 0) {
      throw new Error(`Invalid skip parameter: ${skip}`);
    }
    
    // Create a clean copy of params to avoid any reference issues
    const queryParams = [...params, limitInt, skipInt];
    
    // Count expected parameters
    const expectedParamCount = where.filter(w => w.includes('?')).length + 2; // +2 for LIMIT and OFFSET
    
    console.log('Reports query debug:', { 
      whereSql,
      where,
      params,
      limit, 
      skip, 
      limitInt,
      skipInt,
      queryParams, 
      paramTypes: queryParams.map(p => typeof p),
      paramCount: queryParams.length,
      expectedCount: expectedParamCount
    });
    
    // Validate parameter count
    if (queryParams.length !== expectedParamCount) {
      throw new Error(`Parameter count mismatch: expected ${expectedParamCount}, got ${queryParams.length}`);
    }
    
    let rows;
    try {
      // Try alternative parameter binding approach
      const sql = `SELECT * FROM ${tableName('reports')} ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      
      // Convert all parameters to strings first, then back to appropriate types
      const safeParams = queryParams.map((param, index) => {
        if (index === queryParams.length - 2) return parseInt(param, 10); // limit
        if (index === queryParams.length - 1) return parseInt(param, 10); // offset
        return String(param); // all other params as strings
      });
      
      console.log('Safe params:', safeParams, 'Types:', safeParams.map(p => typeof p));
      
      rows = await dbAll(sql, safeParams);
    } catch (error) {
      console.error('Error in reports query:', {
        error: error.message,
        sql: `SELECT * FROM ${tableName('reports')} ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        params: queryParams,
        paramTypes: queryParams.map(p => typeof p)
      });
      
      // Try fallback approach without prepared statements
      try {
        console.log('Trying fallback query without prepared statements...');
        const fallbackSql = `SELECT * FROM ${tableName('reports')} ${whereSql} ORDER BY created_at DESC LIMIT ${limitInt} OFFSET ${skipInt}`;
        console.log('Fallback SQL:', fallbackSql);
        rows = await dbAll(fallbackSql, params);
        console.log('Fallback query succeeded');
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError.message);
        throw error; // Throw original error
      }
    }

    for (const r of rows) {
      // If not already success and has a report_path, check GCS for completion
      if (r.status !== 'success' && r.report_path) {
        const exists = await gcsFileExists(r.report_path);
        if (exists) {
          try {
            await dbRun(`UPDATE ${tableName('reports')} SET status='success' WHERE report_id=?`, [r.report_id]);
            r.status = 'success';
          } catch {}
        }
      }
      const row = await dbGet(`SELECT COUNT(*) as c FROM ${tableName('uploads')} WHERE report_id=?`, [r.report_id]);
      r.file_count = row?.c || 0;
    }
    res.json({ reports: rows, total: totalRow?.c || 0, skip, limit, page: Math.floor(skip / limit) });
  } catch (e) { console.error(e); res.status(500).json({ error: 'list_reports_failed' }); }
});

app.get('/api/reports/:id', requireAuth, async (req, res) => {
  try {
    const r = await dbGet(`SELECT * FROM ${tableName('reports')} WHERE report_id=? AND user_id=?`, [req.params.id, req.user.id]);
    if (!r || r.is_delete) return res.status(404).json({ error: 'not_found' });
    // If not already success, check if output exists in GCS and mark success
    if (r.status !== 'success' && r.report_path) {
      const exists = await gcsFileExists(r.report_path);
      if (exists) {
        try { await dbRun(`UPDATE ${tableName('reports')} SET status='success' WHERE report_id=?`, [r.report_id]); r.status = 'success'; } catch {}
      }
    }
    res.json(r);
  } catch (e) { console.error(e); res.status(500).json({ error: 'get_report_failed' }); }
});

app.delete('/api/reports/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const r = await dbGet(`SELECT * FROM ${tableName('reports')} WHERE report_id=? AND user_id=?`, [id, req.user.id]);
    if (!r || r.is_delete) return res.status(404).json({ error: 'not_found' });
    await dbRun(`UPDATE ${tableName('reports')} SET is_delete=1 WHERE report_id=? AND user_id=?`, [id, req.user.id]);
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'delete_report_failed' }); }
});

app.patch('/api/reports/:id/pin', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const r = await dbGet(`SELECT is_pinned FROM ${tableName('reports')} WHERE report_id=? AND user_id=?`, [id, req.user.id]);
    if (!r) return res.status(404).json({ error: 'not_found' });
    const next = r.is_pinned ? 0 : 1;
    await dbRun(`UPDATE ${tableName('reports')} SET is_pinned=? WHERE report_id=? AND user_id=?`, [next, id, req.user.id]);
    res.json({ pinned: !!next });
  } catch (e) { console.error(e); res.status(500).json({ error: 'toggle_pin_failed' }); }
});

app.get('/api/reports/:id/data', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const r = await dbGet(`SELECT * FROM ${tableName('reports')} WHERE report_id=? AND user_id=? AND is_delete=0`, [id, req.user.id]);
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

// Get uploaded files for a report with public URLs
app.get('/api/reports/:id/uploads', requireAuth, async (req, res) => {
  try {
    const reportId = req.params.id;
    
    // Verify user owns this report
    const report = await dbGet(`SELECT report_id FROM ${tableName('reports')} WHERE report_id=? AND user_id=? AND is_delete=0`, [reportId, req.user.id]);
    if (!report) {
      return res.status(404).json({ error: 'report_not_found' });
    }

    // Get all uploads for this report
    const uploads = await dbAll(
      `SELECT filename, upload_path, file_format FROM ${tableName('uploads')} WHERE report_id=? ORDER BY created_at ASC`,
      [reportId]
    );

    // Instead of generating signed URLs, return proxy URLs
    const filesWithUrls = uploads.map((upload, index) => {
      return {
        filename: upload.filename,
        filepath: upload.upload_path,
        file_format: upload.file_format,
        // Use our proxy endpoint instead of signed URL
        public_url: `/api/reports/${reportId}/uploads/${index}/download`
      };
    });

    res.json({ files: filesWithUrls });
  } catch (error) {
    console.error(`[api] Failed to get uploads for report ${req.params.id}:`, error?.message || error);
    res.status(500).json({ error: 'failed_to_get_uploads' });
  }
});

// Proxy endpoint to download a specific file from GCS
app.get('/api/reports/:reportId/uploads/:uploadIndex/download', requireAuth, async (req, res) => {
  try {
    const { reportId, uploadIndex } = req.params;
    
    // Verify user owns this report
    const report = await dbGet(`SELECT report_id FROM ${tableName('reports')} WHERE report_id=? AND user_id=? AND is_delete=0`, [reportId, req.user.id]);
    if (!report) {
      return res.status(404).json({ error: 'report_not_found' });
    }

    // Get the specific upload
    const uploads = await dbAll(
      `SELECT filename, upload_path, file_format FROM ${tableName('uploads')} WHERE report_id=? ORDER BY created_at ASC`,
      [reportId]
    );

    const index = parseInt(uploadIndex, 10);
    if (isNaN(index) || index < 0 || index >= uploads.length) {
      return res.status(404).json({ error: 'file_not_found' });
    }

    const upload = uploads[index];
    const parsed = parseGsUri(upload.upload_path);
    if (!parsed) {
      return res.status(400).json({ error: 'invalid_file_path' });
    }

    // Stream file from GCS
    const client = getGcsClient();
    const file = client.bucket(parsed.bucket).file(parsed.object);
    
    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ error: 'file_not_found_in_storage' });
    }

    // Get file metadata for content type
    const [metadata] = await file.getMetadata();
    
    // Set appropriate headers
    res.setHeader('Content-Type', metadata.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(upload.filename)}"`);
    
    // Stream the file
    file.createReadStream()
      .on('error', (error) => {
        console.error(`[api] Error streaming file ${upload.filename}:`, error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'failed_to_stream_file' });
        }
      })
      .pipe(res);
      
  } catch (error) {
    console.error(`[api] Failed to download file:`, error?.message || error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'download_failed' });
    }
  }
});

// Share report via email
app.post('/api/reports/share-email', requireAuth, async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    
    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    
    // Get email configuration
    const emailConfig = getEmailConfig();
    if (!emailConfig) {
      return res.status(500).json({ error: 'Email service not configured' });
    }
    
    // Create nodemailer transporter (note: it's createTransport, not createTransporter)
    const transporter = nodemailer.createTransport({
      host: emailConfig.imap.host.replace('imap.', 'smtp.'), // Convert IMAP to SMTP host
      port: 465,
      secure: true,
      auth: {
        user: emailConfig.imap.user,
        pass: emailConfig.imap.password
      }
    });
    
    // Send email
    const info = await transporter.sendMail({
      from: `"PitchLense" <${emailConfig.imap.user}>`,
      to: to,
      subject: subject,
      html: html
    });
    
    console.log('[api] Email sent successfully:', info.messageId);
    res.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Email sent successfully' 
    });
    
  } catch (error) {
    console.error('[api] Failed to send email:', error);
    res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message 
    });
  }
});

// Download extension as zip
app.get('/api/extension/download-zip', requireAuth, async (req, res) => {
  try {
    const extensionDir = path.join(__dirname, '..', 'extension');
    
    // Check if extension directory exists
    if (!fs.existsSync(extensionDir)) {
      return res.status(404).json({ error: 'Extension directory not found' });
    }

    // Set headers for zip download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="PitchLense-Extension.zip"');

    // Create a simple zip using tar-like approach or just return the files
    // Since we don't have archiver, let's use a different approach
    const { exec } = require('child_process');
    const execAsync = promisify(exec);

    try {
      // Try to create zip using system zip command (works on most systems)
      const zipPath = path.join(__dirname, '..', 'temp_extension.zip');
      
      // Remove existing zip if it exists
      try {
        fs.unlinkSync(zipPath);
      } catch (e) {
        // Ignore if file doesn't exist
      }

      // Create zip using system command (handles both Unix and Windows)
      const isWindows = process.platform === 'win32';
      const zipCommand = isWindows 
        ? `powershell -Command "Compress-Archive -Path 'extension\\*' -DestinationPath 'temp_extension.zip' -Force"`
        : `zip -r temp_extension.zip extension/ -x "*.DS_Store" "*/node_modules/*"`;
      
      await execAsync(`cd "${path.join(__dirname, '..')}" && ${zipCommand}`);
      
      // Send the zip file
      const zipBuffer = fs.readFileSync(zipPath);
      res.send(zipBuffer);
      
      // Clean up temp file
      try {
        fs.unlinkSync(zipPath);
      } catch (e) {
        // Ignore cleanup errors
      }

    } catch (zipError) {
      console.log('System zip not available, falling back to manual approach:', zipError.message);
      
      // Fallback: Return JSON with file contents that can be zipped on frontend
      const files = [];
      
      function readDirectory(dir, relativePath = '') {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const relativeItemPath = path.join(relativePath, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            readDirectory(fullPath, relativeItemPath);
          } else {
            const fileContent = fs.readFileSync(fullPath);
            files.push({
              name: relativeItemPath.replace(/\\/g, '/'), // Normalize path separators
              content: fileContent.toString('base64')
            });
          }
        }
      }
      
      readDirectory(extensionDir);
      
      // Set proper headers for JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="extension-files.json"');
      res.json({ 
        files,
        message: 'Extension files exported. Use frontend zip creation.',
        filename: 'PitchLense-Extension.zip'
      });
    }

  } catch (error) {
    console.error('[api] Failed to create extension zip:', error?.message || error);
    res.status(500).json({ error: 'failed_to_create_zip' });
  }
});

// ===== EMAIL ENDPOINTS =====
// Email libraries are imported at the top of the file

// Store attachments in memory temporarily (keyed by uid-filename)
const emailAttachments = new Map();

// IMAP connection management - prevent multiple simultaneous connections
let activeImapConnection = null;
let lastImapFetch = 0;
const IMAP_COOLDOWN = 2000; // 2 seconds between fetches

// Centralized email configuration for hackathon demo
// All emails are sent/received through contact@amanulla.in
function getEmailConfig() {
  return {
    imap: {
      user: process.env.EMAIL_USERNAME || 'contact@amanulla.in',
      password: process.env.EMAIL_PASSWORD,
      host: process.env.IMAP_HOST || 'imap.hostinger.com',
      port: parseInt(process.env.IMAP_PORT) || 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    },
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME || 'contact@amanulla.in',
        pass: process.env.EMAIL_PASSWORD
      }
    }
  };
}

// Fetch emails from IMAP server
app.get('/api/emails', requireAuth, async (req, res) => {
  let imap;
  let timeoutId;
  
  try {
    const limit = parseInt(req.query.limit) || 50;
    
    // Check if email password is configured in environment
    if (!process.env.EMAIL_PASSWORD) {
      return res.status(400).json({ error: 'Email server not configured. Please set EMAIL_PASSWORD in .env file.' });
    }
    
    // Prevent simultaneous IMAP connections
    const now = Date.now();
    if (activeImapConnection) {
      console.log('[api] IMAP connection already active, rejecting request');
      return res.status(429).json({ error: 'Email fetch in progress, please wait' });
    }
    
    // Enforce cooldown between requests
    if (now - lastImapFetch < IMAP_COOLDOWN) {
      const waitTime = Math.ceil((IMAP_COOLDOWN - (now - lastImapFetch)) / 1000);
      console.log(`[api] IMAP cooldown active, wait ${waitTime}s`);
      return res.status(429).json({ error: `Please wait ${waitTime} seconds before refreshing` });
    }
    
    activeImapConnection = true;
    lastImapFetch = now;
    
    const config = getEmailConfig();
    
    // Add connection timeout
    config.imap.connTimeout = 30000; // 30 seconds
    config.imap.authTimeout = 30000; // 30 seconds
    config.imap.keepalive = false; // Disable keepalive to prevent hanging
    
    imap = new Imap(config.imap);
    const emails = [];
    
    console.log('[api] Starting IMAP connection...');
    
    // Set overall timeout for the entire operation
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        console.log('[api] IMAP operation timeout - forcing disconnect');
        if (imap) {
          try { imap.end(); } catch (e) {}
        }
        activeImapConnection = null;
        reject(new Error('Email fetch timeout - please try again'));
      }, 45000); // 45 seconds total timeout
    });
    
    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          console.error('Error opening inbox:', err);
          imap.end();
          return res.status(500).json({ error: 'Failed to open inbox' });
        }
        
        const totalMessages = box.messages.total;
        if (totalMessages === 0) {
          imap.end();
          return res.json([]);
        }
        
        const start = Math.max(1, totalMessages - limit + 1);
        const fetchRange = `${start}:${totalMessages}`;
        
        const fetch = imap.seq.fetch(fetchRange, {
          bodies: '',
          struct: true
        });
        
        let processedCount = 0;
        const totalToFetch = totalMessages - start + 1;
        console.log(`[api] Fetching ${totalToFetch} emails from ${start} to ${totalMessages}`);
        
        fetch.on('message', (msg, seqno) => {
          let emailData = { id: seqno, attachments: [], buffers: [] };
          
          msg.on('body', (stream, info) => {
            let buffer = '';
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
            
            stream.once('end', () => {
              emailData.buffers.push(buffer);
            });
          });
          
          msg.once('attributes', (attrs) => {
            emailData.uid = attrs.uid;
            emailData.flags = attrs.flags;
            emailData.isRead = attrs.flags.includes('\\Seen');
            
            // Extract attachments info
            if (attrs.struct) {
              const attachments = [];
              const extractAttachments = (struct) => {
                if (Array.isArray(struct)) {
                  struct.forEach(extractAttachments);
                } else if (struct.disposition && struct.disposition.type === 'attachment') {
                  attachments.push({
                    filename: struct.disposition.params.filename || 'attachment',
                    type: struct.type,
                    size: struct.size
                  });
                } else if (struct.subtype === 'MIXED' && struct.params) {
                  if (struct[0]) extractAttachments(struct[0]);
                }
              };
              extractAttachments(attrs.struct);
              emailData.attachments = attachments;
            }
          });
          
          msg.once('end', async () => {
            // Parse the complete email using mailparser
            try {
              const fullBuffer = emailData.buffers.join('');
              const parsed = await simpleParser(fullBuffer);
              
              emailData.from = parsed.from?.text || '';
              emailData.to = parsed.to?.text || '';
              emailData.subject = parsed.subject || '';
              emailData.date = parsed.date || new Date();
              emailData.body = parsed.html || parsed.textAsHtml || parsed.text || '';
              emailData.textBody = parsed.text || '';
              
              // Get attachments from parsed email with content
              if (parsed.attachments && parsed.attachments.length > 0) {
                emailData.attachments = parsed.attachments.map((att, idx) => {
                  const filename = att.filename || `attachment_${idx}`;
                  const attachmentKey = `${emailData.uid}-${filename}`;
                  
                  // Store attachment content in memory
                  emailAttachments.set(attachmentKey, {
                    content: att.content,
                    contentType: att.contentType,
                    filename: filename
                  });
                  
                  return {
                    filename: filename,
                    type: att.contentType,
                    size: att.size,
                    downloadUrl: `/api/emails/attachment/${emailData.uid}/${encodeURIComponent(filename)}`
                  };
                });
              }
            } catch (parseError) {
              console.error('Error parsing email:', parseError);
              // Fallback to basic parsing
              if (emailData.buffers.length > 0) {
                const header = Imap.parseHeader(emailData.buffers[0]);
                emailData.from = header.from ? header.from[0] : '';
                emailData.to = header.to ? header.to[0] : '';
                emailData.subject = header.subject ? header.subject[0] : '';
                emailData.date = header.date ? header.date[0] : '';
                emailData.body = emailData.buffers.join('');
              }
            }
            
            emails.push(emailData);
            processedCount++;
            console.log(`[api] Processed email ${processedCount}/${totalToFetch} - ${emailData.subject || 'No subject'}`);
          });
        });
        
        fetch.once('error', (err) => {
          console.error('Fetch error:', err);
          activeImapConnection = null;
          if (timeoutId) clearTimeout(timeoutId);
          imap.end();
          if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to fetch emails' });
          }
        });
        
        fetch.once('end', () => {
          console.log(`[api] Fetch complete, waiting for email parsing...`);
          
          // Wait a moment for async parsing to complete
          setTimeout(() => {
            console.log(`[api] Parsing complete. Total emails processed: ${emails.length}`);
            
            // Format and send response immediately, then close connection
            if (!res.headersSent) {
              try {
                const formattedEmails = emails.map(email => {
                  let preview = '';
                  if (email.textBody) {
                    preview = email.textBody.substring(0, 200).replace(/\s+/g, ' ').trim();
                  } else if (email.body) {
                    preview = email.body.replace(/<[^>]*>/g, '').substring(0, 200).replace(/\s+/g, ' ').trim();
                  }
                  
                  return {
                    id: email.id,
                    uid: email.uid,
                    from: email.from,
                    to: email.to,
                    subject: email.subject,
                    preview: preview,
                    body: email.body,
                    textBody: email.textBody,
                    date: email.date,
                    attachments: (email.attachments || []).map(a => ({
                      filename: a.filename || a,
                      type: a.type,
                      size: a.size,
                      downloadUrl: a.downloadUrl || `/api/emails/attachment/${email.uid}/${encodeURIComponent(a.filename || a)}`
                    })),
                    isRead: email.isRead
                  };
                });
                
                console.log(`[api] Sending response with ${formattedEmails.length} emails`);
                res.json(formattedEmails.reverse());
                console.log(`[api] Response sent successfully`);
                
                // Clear timeout and connection flag
                if (timeoutId) clearTimeout(timeoutId);
                activeImapConnection = null;
              } catch (err) {
                console.error('[api] Error formatting/sending response:', err);
              }
            }
            
            // Close IMAP connection
            imap.end();
          }, 1000); // 1 second delay to ensure parsing completes
        });
      });
    });
    
    imap.once('error', (err) => {
      console.error('IMAP connection error:', err);
      activeImapConnection = null;
      if (timeoutId) clearTimeout(timeoutId);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to connect to email server', details: err.message });
      }
    });
    
    imap.once('end', () => {
      // Just cleanup - response already sent in fetch.once('end')
      console.log(`[api] IMAP connection fully closed`);
      if (timeoutId) clearTimeout(timeoutId);
      activeImapConnection = null;
    });
    
    // Race between timeout and actual connection
    Promise.race([
      new Promise((resolve) => {
        imap.once('end', resolve);
        imap.connect();
      }),
      timeoutPromise
    ]).catch((err) => {
      console.error('Email fetch timeout or error:', err);
      activeImapConnection = null;
      if (imap) {
        try { imap.end(); } catch (e) {}
      }
      if (!res.headersSent) {
        res.status(504).json({ error: 'Email server timeout - please try again' });
      }
    });
    
  } catch (error) {
    console.error('Error fetching emails:', error);
    activeImapConnection = null;
    if (timeoutId) clearTimeout(timeoutId);
    if (imap) {
      try { imap.end(); } catch (e) {}
    }
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to fetch emails', details: error.message });
    }
  }
});

// Send email via SMTP
app.post('/api/emails/send', requireAuth, async (req, res) => {
  try {
    const { to, subject, body, replyTo, attachments } = req.body;
    const userEmail = req.user.email; // Get user's PitchLense account email
    
    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if email password is configured
    if (!process.env.EMAIL_PASSWORD) {
      return res.status(400).json({ error: 'Email server not configured. Please set EMAIL_PASSWORD in .env file.' });
    }
    
    const config = getEmailConfig();
    const transporter = nodemailer.createTransport(config.smtp);
    
    const mailOptions = {
      from: `"${userEmail} via PitchLense" <${config.smtp.auth.user}>`,
      to: to,
      subject: subject,
      text: `[Sent by: ${userEmail}]\n\n${body}`,
      html: `<p style="color: #666; font-size: 12px; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 12px;"><strong>Sent by:</strong> ${userEmail} via PitchLense</p>${body.replace(/\n/g, '<br>')}`
    };
    
    if (replyTo) {
      mailOptions.inReplyTo = replyTo;
      mailOptions.references = replyTo;
    }
    
    const info = await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Email sent successfully' 
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Update email settings (not used in hackathon version)
app.post('/api/emails/settings', requireAuth, async (req, res) => {
  try {
    // For hackathon demo, settings are read-only from .env
    res.json({ 
      success: true, 
      message: 'Email settings are managed in server configuration (read-only for demo)' 
    });
  } catch (error) {
    console.error('Error updating email settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get email settings
app.get('/api/emails/settings', requireAuth, async (req, res) => {
  try {
    // Return centralized email configuration status
    const emailAddress = process.env.EMAIL_USERNAME || 'contact@amanulla.in';
    const configured = !!process.env.EMAIL_PASSWORD;
    
    res.json({ 
      email_address: emailAddress,
      configured: configured,
      mode: 'centralized',
      message: 'Using shared email server (contact@amanulla.in) for all users'
    });
    
  } catch (error) {
    console.error('Error fetching email settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Analyze email with PitchLense AI
app.post('/api/emails/analyze', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { emailId, emailContent, attachments } = req.body;
    
    if (!emailContent) {
      return res.status(400).json({ error: 'Email content required' });
    }
    
    console.log(`[api] POST /api/emails/analyze user=${userId} emailId=${emailId}`);
    
    // Extract text content (strip HTML if present)
    const textContent = emailContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Use Gemini AI to extract startup information
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `Analyze the following email and extract startup/company information:

Email Content:
${textContent}

Extract the following information in JSON format:
{
  "startup_name": "company or startup name mentioned",
  "founder_name": "founder or CEO name mentioned",
  "launch_date": "founding date or launch date in YYYY-MM-DD format",
  "confidence": "high/medium/low based on how clear the information is"
}

If any field is not found or unclear, use "Not Found" for that field.
Return ONLY valid JSON, no markdown or explanation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from response
    let extractedData;
    try {
      // Remove markdown code blocks if present
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      extractedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        rawResponse: text 
      });
    }
    
    // Default to today's date if launch date not found or invalid
    if (!extractedData.launch_date || 
        extractedData.launch_date === 'Not Found' || 
        extractedData.launch_date === 'Unknown' ||
        extractedData.launch_date === 'N/A') {
      const today = new Date();
      extractedData.launch_date = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      console.log(`[api] No launch date found, using today's date: ${extractedData.launch_date}`);
    }
    
    // Default values for other fields if not found
    if (!extractedData.startup_name || extractedData.startup_name === 'Not Found') {
      extractedData.startup_name = 'Unknown Startup';
    }
    if (!extractedData.founder_name || extractedData.founder_name === 'Not Found') {
      extractedData.founder_name = 'Unknown Founder';
    }
    
    res.json({
      success: true,
      extracted: extractedData,
      hasAttachments: attachments && attachments.length > 0,
      message: 'Email analyzed successfully'
    });
    
  } catch (error) {
    console.error('Error analyzing email:', error);
    res.status(500).json({ error: 'Failed to analyze email', details: error.message });
  }
});

// Create report from email analysis
app.post('/api/emails/create-report', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startup_name, founder_name, launch_date, emailId, attachmentUrls } = req.body;
    
    if (!startup_name || !founder_name || !launch_date) {
      return res.status(400).json({ error: 'Startup name, founder name, and launch date are required' });
    }
    
    console.log(`[api] Creating report from email analysis: ${startup_name}`);
    console.log(`[api] Received attachmentUrls:`, attachmentUrls);
    
    const report_id = crypto.randomUUID();
    const report_name = `${startup_name} - Email`;
    const report_path = GCS_BUCKET ? `gs://${GCS_BUCKET}/runs/${report_id}.json` : null;
    
    // Create the report in database
    await dbRun(
      `INSERT INTO ${tableName('reports')} (report_id, user_id, report_name, startup_name, founder_name, launch_date, status, is_delete, is_pinned, report_path, total_files, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, 0, ?, ?, NOW())`,
      [report_id, userId, report_name, startup_name, founder_name, launch_date, report_path, attachmentUrls?.length || 0]
    );
    
    // Background processing: upload attachments and trigger Cloud Run
    // Capture variables in closure
    const _report_id = report_id;
    const _startup_name = startup_name;
    const _userId = userId;
    const _attachmentUrls = attachmentUrls;
    
    setImmediate(async () => {
      try {
        const createdUploads = [];
        
        console.log(`[bg] start email report processing: report_id=${_report_id} startup=${_startup_name} attachments=${_attachmentUrls?.length || 0}`);
        
        // Process attachments if available
        if (_attachmentUrls && _attachmentUrls.length > 0) {
          console.log(`[bg] processing ${_attachmentUrls.length} attachments, GCS_BUCKET=${!!GCS_BUCKET}`);
          
          if (!GCS_BUCKET) {
            console.warn(`[bg] GCS_BUCKET not set, cannot upload attachments`);
          } else {
            for (let i = 0; i < _attachmentUrls.length; i++) {
              const attUrl = _attachmentUrls[i];
              console.log(`[bg] processing attachment URL: ${attUrl}`);
              
              // Download attachment content from memory
              const parts = attUrl.split('/');
              const uid = parts[parts.length - 2];
              const filename = decodeURIComponent(parts[parts.length - 1]);
              const attachmentKey = `${uid}-${filename}`;
              
              console.log(`[bg] looking for attachment key: ${attachmentKey} (total in memory: ${emailAttachments.size})`);
              
              const attachment = emailAttachments.get(attachmentKey);
              if (attachment) {
                const objectPath = `uploads/${_report_id}/${attachment.filename}`;
                console.log(`[bg] uploading attachment ${i+1}/${_attachmentUrls.length} -> ${objectPath}`);
                
                const gcsPath = await gcsSaveBytes(
                  GCS_BUCKET, 
                  objectPath, 
                  attachment.content, 
                  attachment.contentType || 'application/octet-stream'
                );
                
              await dbRun(
                `INSERT INTO ${tableName('uploads')} (file_id, user_id, report_id, filename, file_format, upload_path, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                [crypto.randomUUID(), _userId, _report_id, attachment.filename, 'pitch deck', gcsPath]
              );
              
              console.log(`[bg] successfully uploaded attachment: ${attachment.filename} -> ${gcsPath}`);
              
              createdUploads.push({
                filetype: 'pitch deck',
                filename: attachment.filename,
                file_extension: (attachment.filename.split('.').pop() || '').toLowerCase(),
                filepath: gcsPath
              });
              } else {
                console.error(`[bg] attachment not found in memory: ${attachmentKey}`);
              }
            }
          }
        } else {
          console.log(`[bg] no attachments to process`);
        }
        
        // Trigger Cloud Run job (ALWAYS trigger if configured, even without attachments)
        if (CLOUD_RUN_URL) {
          if (!GCS_BUCKET) {
            console.warn(`[bg] GCS_BUCKET not set, skipping Cloud Run trigger`);
          } else {
            const destination_gcs = `gs://${GCS_BUCKET}/runs/${_report_id}.json`;
            const payload = { 
              company_name: _startup_name,
              uploads: createdUploads, 
              destination_gcs
            };
            
            console.log(`[bg] triggering cloud-run for email report: company=${_startup_name} uploads=${createdUploads.length} url=${CLOUD_RUN_URL}`);
            console.log(`[bg] cloud-run payload:`, JSON.stringify(payload, null, 2));
            
            axios.post(CLOUD_RUN_URL, payload, { 
              timeout: 10000,
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then((resp) => {
                console.log(`[bg] cloud-run request successful: status=${resp.status} report_id=${_report_id}`);
              })
              .catch((err) => {
                console.error(`[bg] cloud-run request error for report_id=${_report_id}:`, err?.response ? `${err.response.status} ${JSON.stringify(err.response.data)}` : (err?.message || err));
              });
          }
        } else {
          console.log(`[bg] Cloud Run not configured (CLOUD_RUN_URL not set)`);
        }
      } catch (err) {
        console.error(`[bg] email report processing failed for report_id=${_report_id}:`, err);
        try { await dbRun(`UPDATE ${tableName('reports')} SET status='failed' WHERE report_id=?`, [_report_id]); } catch {}
      }
    });
    
    const report = await dbGet(`SELECT * FROM ${tableName('reports')} WHERE report_id=?`, [report_id]);
    res.json({ success: true, report });
    
  } catch (error) {
    console.error('Error creating report from email:', error);
    res.status(500).json({ error: 'Failed to create report', details: error.message });
  }
});

// Download email attachment
app.get('/api/emails/attachment/:uid/:filename', requireAuth, async (req, res) => {
  try {
    const { uid, filename } = req.params;
    const attachmentKey = `${uid}-${decodeURIComponent(filename)}`;
    
    const attachment = emailAttachments.get(attachmentKey);
    
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }
    
    // Set headers for download
    res.setHeader('Content-Type', attachment.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.filename}"`);
    
    // Send the file content
    res.send(attachment.content);
    
  } catch (error) {
    console.error('Error downloading attachment:', error);
    res.status(500).json({ error: 'Failed to download attachment' });
  }
});

// Test email connection
app.post('/api/emails/test-connection', requireAuth, async (req, res) => {
  try {
    // Check if email password is configured
    if (!process.env.EMAIL_PASSWORD) {
      return res.status(400).json({ error: 'Email server not configured. Please set EMAIL_PASSWORD in .env file.' });
    }
    
    const config = getEmailConfig();
    
    // Test SMTP connection
    const transporter = nodemailer.createTransport(config.smtp);
    await transporter.verify();
    
    res.json({ success: true, message: 'Connection successful' });
    
  } catch (error) {
    console.error('Connection test failed:', error);
    res.status(500).json({ error: 'Connection failed', details: error.message });
  }
});

// Fallback to index.html for root
app.get('*', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    await checkTables();
    
    app.listen(PORT, () => {
      console.log(`🚀 PitchLense server running at http://localhost:${PORT}`);
      console.log(`📊 Connected to MySQL database: ${dbConfig.database}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  if (db) {
    await db.end();
    console.log('📊 Database connection closed');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  if (db) {
    await db.end();
    console.log('📊 Database connection closed');
  }
  process.exit(0);
});

startServer();


