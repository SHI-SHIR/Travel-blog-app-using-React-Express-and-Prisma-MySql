require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Use your Prisma-backed route modules (make sure they're updated to Prisma)
app.use('/api/auth', require('./routes/auth').default || require('./routes/auth'));
app.use('/api/blogs', require('./routes/blogs').default || require('./routes/blogs'));
app.use('/api/images', require('./routes/images').default || require('./routes/images'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`📡 Blog backend running at http://localhost:${port}`);
});
