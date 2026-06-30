import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Proxy for CRM API (supports both /api/proxy/* and /api/* to avoid CORS)
  const CRM_DOMAIN = process.env.VITE_CRM_API_URL || 'https://crm.throbtech.com';
  const CRM_API_URL = `${CRM_DOMAIN}/api`;

  app.use(["/api/proxy", "/api"], (req, res, next) => {
    if (req.path === '/api/health' || req.path === '/health') {
      return next();
    }
    express.raw({ type: '*/*', limit: '50mb' })(req, res, next);
  });

  app.all(["/api/proxy/*", "/api/*"], async (req, res, next) => {
    if (req.path === '/api/health' || req.path === '/health') {
      return next();
    }

    try {
      // Extract the endpoint relative to /api/proxy/ or /api/
      let endpoint = '';
      if (req.path.startsWith('/api/proxy/')) {
        endpoint = req.path.substring('/api/proxy/'.length);
      } else if (req.path.startsWith('/api/')) {
        endpoint = req.path.substring('/api/'.length);
      }
      
      // Clean leading and trailing slashes from endpoint
      endpoint = endpoint.replace(/^\/+|\/+$/g, '');
      
      const TARGET_CRM_DOMAIN = CRM_DOMAIN.replace(/\/$/, '').replace(/\/api$/, '');

      // Smart routing:
      // If the endpoint is already prefixed with 'api/' or 'broadcasting/', we route directly.
      // Otherwise, we assume it's a standard CRM API endpoint and prepend 'api/'.
      let url = '';
      if (endpoint.startsWith('api/') || endpoint.startsWith('broadcasting/')) {
        url = `${TARGET_CRM_DOMAIN}/${endpoint}`;
      } else {
        url = `${TARGET_CRM_DOMAIN}/api/${endpoint}`;
      }
      
      const hasQuery = req.originalUrl.includes('?');
      const queryString = hasQuery ? req.originalUrl.substring(req.originalUrl.indexOf('?')) : '';
      url = url + queryString;
      
      const filteredHeaders: Record<string, string> = {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };
      const skipHeaders = ['host', 'connection', 'content-length', 'accept-encoding', 'accept', 'x-requested-with'];
      
      Object.keys(req.headers).forEach(key => {
        if (!skipHeaders.includes(key.toLowerCase())) {
          const value = req.headers[key];
          if (value !== undefined) {
            filteredHeaders[key] = Array.isArray(value) ? value.join(', ') : String(value);
          }
        }
      });

      const authHeader = req.headers['authorization'];
      if (authHeader) {
        const tokenValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
        if (tokenValue.toLowerCase().includes('mock_')) {
          console.warn(`[PROXY WARNING] Request to real CRM ${url} using a MOCK token! This will likely fail with 401.`);
        }
        console.log(`[PROXY] Authorization header present: ${tokenValue.substring(0, 20)}...`);
        filteredHeaders['Authorization'] = tokenValue;
      } else {
        console.warn(`[PROXY] No Authorization header found for ${url}`);
      }

      console.log(`[PROXY] Forwarding Request: ${req.method} ${url}`);
      console.log(`[PROXY] Filtered Headers: ${JSON.stringify(Object.keys(filteredHeaders))}`);

      const hostHeader = new URL(TARGET_CRM_DOMAIN).host;

      const response = await axios({
        method: req.method,
        url: url,
        data: (['GET', 'HEAD'].includes(req.method.toUpperCase()) || !req.body || req.body.length === 0) ? undefined : req.body,
        headers: {
          ...filteredHeaders,
          'Host': hostHeader,
          'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 WhatsAppCRM/1.0',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: () => true,
        timeout: 60000,
        responseType: 'arraybuffer',
      });

      // Special handling for response headers
      const responseHeaders: Record<string, string> = {};
      const skipResHeaders = ['content-encoding', 'transfer-encoding', 'access-control-allow-origin', 'set-cookie'];
      
      Object.keys(response.headers).forEach(key => {
        if (!skipResHeaders.includes(key.toLowerCase())) {
          const value = response.headers[key];
          if (value !== undefined) {
            responseHeaders[key] = Array.isArray(value) ? value.join(', ') : value as string;
          }
        }
      });

      if (response.status >= 400) {
        console.warn(`[PROXY] Remote server returned error ${response.status} for ${url}`);
        const bodyString = Buffer.from(response.data).toString('utf8');
        console.warn(`[PROXY] Error Body: ${bodyString}`);
        
        if (response.status === 403) {
          console.warn('[PROXY HELP] A 403 Forbidden on broadcasting/auth usually means:');
          console.warn('1. The user logic in routes/channels.php returned false.');
          console.warn('2. The Authorization header (Bearer token) was missing or invalid.');
          console.warn('3. Laravel CSRF protection blocked the request (ensure route is in api group).');
        }
      }

      res.status(response.status).set(responseHeaders).send(response.data);
    } catch (error: any) {
      console.error("[PROXY ERROR]", error.message);
      const statusCode = error.response?.status || 500;
      res.status(statusCode).json({ 
        error: "Proxy request failed", 
        message: error.message,
        details: error.code === 'ECONNRESET' ? 'The connection was reset by the remote server.' : undefined
      });
    }
  });

  // Body parsers for other routes
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
