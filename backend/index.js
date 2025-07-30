require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT;

// --- CORS Configuration ---
const allowedOrigins = [
  'https://talktolocal.com',      
  'https://www.talktolocal.com',  
  'http://localhost:3000'         
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
// --- End of CORS Configuration ---


app.use(express.json({ limit: '50mb' }));

// --- CRITICAL MIDDLEWARE FOR HTTPS REDIRECTION AND CACHING ---
// This middleware runs for every request BEFORE your routes.
app.use((req, res, next) => {
  // 1. HTTPS Redirection (Keep this)
  // The 'x-forwarded-proto' header is set by proxies like Heroku or Cloudflare
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }

  // 2. Cache-Control Headers (ADD THESE LINES HERE)
  // These headers prevent browsers and intermediary caches from storing responses.
  // This is essential for dynamic data that changes frequently.
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');     // HTTP/1.0 backwards compatibility
  res.set('Expires', '0');           // HTTP/1.0 backwards compatibility

  next(); // Proceed to the next middleware or route handler
});
// --- END CRITICAL MIDDLEWARE ---


// This route handling is fine, no changes needed here.
// Use .default for ES Modules imported with CommonJS require, or just require if it's pure CommonJS
app.use('/api/auth', require('./routes/auth').default || require('./routes/auth'));
app.use('/api/blogs', require('./routes/blogs').default || require('./routes/blogs'));
app.use('/api/images', require('./routes/images').default || require('./routes/images'));

app.get('/', (req, res) => {
  res.send('Backend is working properly');
});

app.listen(port, () => {
  console.log(`📡 Blog backend running on port ${port}.`);
});