import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Proxy for CRM API
  const CRM_DOMAIN = 'https://crm.throbtech.com';
  const CRM_API_URL = `${CRM_DOMAIN}/api`;

  app.use("/api/proxy", express.raw({ type: '*/*', limit: '50mb' }));
  app.all("/api/proxy/*", async (req, res) => {
    try {
      let endpoint = req.params[0] || '';
      if (!endpoint && req.path.startsWith('/api/proxy/')) {
        endpoint = req.path.substring('/api/proxy/'.length);
      }
      
      const CRM_DOMAIN = 'https://crm.throbtech.com';
      const CRM_API_URL = `${CRM_DOMAIN}/api`;

      // Remove leading slash if any
      endpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
      
      // Laravel broadcasting auth is typically at the root domain, not under /api
      let url = `${CRM_API_URL}/${endpoint}`;
      if (endpoint === 'broadcasting/auth' || endpoint.startsWith('broadcasting/auth/')) {
        url = `${CRM_DOMAIN}/broadcasting/auth`;
      }
      
      const filteredHeaders: Record<string, string> = {
        'Accept': 'application/json', // Force JSON response
      };
      const skipHeaders = ['host', 'connection', 'content-length'];
      
      Object.keys(req.headers).forEach(key => {
        if (!skipHeaders.includes(key.toLowerCase())) {
          const value = req.headers[key];
          if (value !== undefined) {
            filteredHeaders[key] = Array.isArray(value) ? value.join(', ') : String(value);
          }
        }
      });

      console.log(`[PROXY] ${req.method} ${url}`);

      // Special logging for broadcasting auth
      if (endpoint.includes('broadcasting/auth')) {
        console.log('[BROADCAST REQUEST] auth endpoint hit');
        console.log('[BROADCAST REQUEST] Auth Header:', req.headers['authorization'] ? 'Present' : 'MISSING');
        try {
          const bodyStr = Buffer.from(req.body).toString('utf8');
          console.log('[BROADCAST REQUEST] Payload:', bodyStr);
        } catch (e) {}
      }

      const response = await axios({
        method: req.method,
        url: url,
        data: (['GET', 'HEAD'].includes(req.method.toUpperCase()) || !req.body || req.body.length === 0) ? undefined : req.body,
        headers: {
          ...filteredHeaders,
          'Host': 'crm.throbtech.com',
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
