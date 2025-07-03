const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// API Endpoints
app.get('/api/test', (req, res) => {
  res.json(['heroes', 'villains', 'dimensions', 'media', 'crossovers', 'merchandise']);
});

// API Endpoints
app.get('/api/tables', (req, res) => {
  res.json(['heroes', 'villains', 'dimensions', 'media', 'crossovers', 'merchandise']);
});

app.get('/api/:table/data', (req, res) => {
    const table = req.params.table;
    res.json(['table']);
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*'); // or '*'
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Start server
app.listen(PORT, () => {
  console.log(`🌐 Spider-Server swinging on http://localhost:${PORT}`);
});
