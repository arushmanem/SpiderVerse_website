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
    res.json(["'"+table+"'"]);
});
