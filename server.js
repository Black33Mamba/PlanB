const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// هاست‌های مجاز — هر کدوم یه مسیر داره
const targets = {
  'telegram': 'https://api.telegram.org',
  'openai': 'https://api.openai.com',
  'anthropic': 'https://api.anthropic.com',
  'github': 'https://api.github.com',
  'coingecko': 'https://api.coingecko.com',
  'google': 'https://www.googleapis.com',
  'huggingface': 'https://huggingface.co',
  'openrouter': 'https://openrouter.ai',
  'groq': 'https://api.groq.com',
  'together': 'https://api.together.xyz',
  'fireworks': 'https://api.fireworks.ai',
  'deepseek': 'https://api.deepseek.com',
  'mistral': 'https://api.mistral.ai',
  'replicate': 'https://api.replicate.com',
  'wolfram': 'https://api.wolframalpha.com',
  'duckduckgo': 'https://api.duckduckgo.com',
  'bing': 'https://www.bing.com',
  'google-search': 'https://www.googleapis.com/customsearch',
  'newsapi': 'https://newsapi.org',
  'openweathermap': 'https://api.openweathermap.org',
  'ipinfo': 'https://ipinfo.io',
  'ipify': 'https://api.ipify.org',
  'httpbin': 'https://httpbin.org',
  'reddit': 'https://www.reddit.com',
  'twitter': 'https://api.twitter.com',
  'youtube': 'https://www.googleapis.com/youtube',
  'gitlab': 'https://gitlab.com/api/v4',
  'stackoverflow': 'https://api.stackexchange.com',
  'wikipedia': 'https://en.wikipedia.org/api/rest_v1',
  'pypi': 'https://pypi.org',
  'npm': 'https://registry.npmjs.org',
  'dockerhub': 'https://hub.docker.com',
  'cloudflare': 'https://api.cloudflare.com'
};

// هر درخواست به /<service>/... فوروارد میشه به اون service
Object.entries(targets).forEach(([name, target]) => {
  app.use(`/${name}`, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^/${name}`]: '' },
    on: {
      proxyRes: (proxyRes) => {
        proxyRes.headers['access-control-allow-origin'] = '*';
      }
    }
  }));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    services: Object.keys(targets),
    timestamp: new Date().toISOString() 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PlanB Proxy running on port ${PORT}`);
  console.log(`Services: ${Object.keys(targets).join(', ')}`);
});
