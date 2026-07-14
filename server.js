const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(express.json());

// Universal Proxy — هر آدرسی رو فوروارد میکنه
app.use('/proxy', createProxyMiddleware({
  target: 'http://placeholder',
  changeOrigin: true,
  router: (req) => {
    const url = req.query.url || req.headers['x-proxy-url'];
    if (url) {
      try {
        const parsed = new URL(url);
        return parsed.origin;
      } catch(e) {}
    }
    return 'https://httpbin.org';
  },
  pathRewrite: (path, req) => {
    const url = req.query.url || req.headers['x-proxy-url'];
    if (url) {
      try {
        const parsed = new URL(url);
        return parsed.pathname + parsed.search;
      } catch(e) {}
    }
    return path;
  },
  on: {
    proxyRes: (proxyRes, req) => {
      proxyRes.headers['access-control-allow-origin'] = '*';
      proxyRes.headers['access-control-allow-headers'] = '*';
      proxyRes.headers['access-control-allow-methods'] = '*';
    }
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    usage: 'GET /proxy?url=https://any-site.com/path',
    timestamp: new Date().toISOString() 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Universal Proxy running on port ${PORT}`);
});
