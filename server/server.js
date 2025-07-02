const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3001;

const FALLBACK_IMAGES = [
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/49ec1464-d899-400a-b608-c48c76b500d2/dfoxgpr-8b556792-f920-477a-b859-60e14a28dab1.jpg/v1/fill/w_1280,h_1280,q_75,strp/miles_morales___spider_man_across_the_spider_verse_by_patrickbrown_dfoxgpr-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzQ5ZWMxNDY0LWQ4OTktNDAwYS1iNjA4LWM0OGM3NmI1MDBkMlwvZGZveGdwci04YjU1Njc5Mi1mOTIwLTQ3N2EtYjg1OS02MGUxNGEyOGRhYjEuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.I5S6zOtVEuFeANdsf0ciXpZG-ueE1ITVbtQCazZvBPA',
    'https://upload.wikimedia.org/wikipedia/en/0/0f/Tom_Holland_as_Spider-Man.jpg',
    'https://boundingintocomics.com/cdn-cgi/image/width=788,height=444,fit=crop,quality=80,format=auto,onerror=redirect,metadata=none/wp-content/uploads/iew.png'
];

// Database setup
const db = new sqlite3.Database('/Users/arushmanem/Desktop/AM_Databases/SpiderVerse.db', (err) => {
  if (err) console.error(err.message);
  console.log('🕷️ Connected to Spider-Verse database!');
});

// Middleware
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Helper functions
function validateImageUrl(url, fallback) {
  if (!url) return fallback;
  try {
    new URL(url);
    return url;
  } catch {
    return fallback;
  }
}

function processTableRow(row, table, fallback) {
  let imageUrl = row.image_url;
  
  if (table === 'crossovers') {
    imageUrl = row.image_url || row.hero_image_url || row.villain_image_url || row.media_image_url;
  }
  
  return {
    ...row,
    image_url: validateImageUrl(imageUrl, fallback)
  };
}

// API Endpoints
app.get('/api/tables', (req, res) => {
  res.json(['heroes', 'villains', 'dimensions', 'media', 'crossovers', 'merchandise']);
});

app.get('/api/:table/data', (req, res) => {
    const { search } = req.query;
    const table = req.params.table;
    let query = `SELECT *, rowid as id FROM ${table}`;
    
    if (table === 'crossovers') {
      query = `
        SELECT 
          c.*, 
          c.rowid as id, 
          h.image_url as hero_image_url,
          v.image_url as villain_image_url,
          m.image_url as media_image_url
        FROM crossovers c
        LEFT JOIN heroes h ON c.hero_id = h.hero_id
        LEFT JOIN villains v ON c.villain_id = v.villain_id
        LEFT JOIN media m ON c.media_id = m.media_id
      `;
    }
    
    if (search && table !== 'crossovers') {
      switch(table) {
        case 'heroes':
          query += ` WHERE alias LIKE '%${search}%' OR real_name LIKE '%${search}%'`;
          break;
        case 'villains':
          query += ` WHERE name LIKE '%${search}%' OR alias LIKE '%${search}%'`;
          break;
        case 'dimensions':
          query += ` WHERE name LIKE '%${search}%'`;
          break;
        case 'media':
          query += ` WHERE title LIKE '%${search}%'`;
          break;
      }
    }
  
    db.all(query, (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
  
      const processedRows = rows.map(row => processTableRow(row, table, FALLBACK_IMAGES[0]));
      res.json(processedRows);
    });
});

app.get('/api/:table/:id', (req, res) => {
    const { table, id } = req.params;
    let query = `SELECT *, rowid as id FROM ${table} WHERE rowid = ?`;
    
    if (table === 'crossovers') {
      query = `
        SELECT 
          c.*, 
          c.rowid as id, 
          h.image_url as hero_image_url,
          v.image_url as villain_image_url,
          m.image_url as media_image_url
        FROM crossovers c
        LEFT JOIN heroes h ON c.hero_id = h.hero_id
        LEFT JOIN villains v ON c.villain_id = v.villain_id
        LEFT JOIN media m ON c.media_id = m.media_id
        WHERE c.rowid = ?
      `;
    }
  
    db.get(query, [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Not found' });
      
      res.json(processTableRow(row, table, FALLBACK_IMAGES[0]));
    });
});

// Merchandise Endpoints
app.get('/api/merchandise', (req, res) => {
  const { dimension } = req.query;
  let query = `
    SELECT m.*, d.name as dimension_name, d.visual_style 
    FROM merchandise m
    JOIN dimensions d ON m.dimension_id = d.dimension_id
  `;
  
  const params = [];
  if (dimension) {
    query += ' WHERE m.dimension_id = ?';
    params.push(dimension);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    const processedRows = rows.map(row => ({
      ...row,
      image_url: validateImageUrl(row.image_url, FALLBACK_IMAGES[0])
    }));
    
    res.json(processedRows);
  });
});

app.get('/api/merchandise/:id', (req, res) => {
  const query = `
    SELECT m.*, d.name as dimension_name, d.visual_style 
    FROM merchandise m
    JOIN dimensions d ON m.dimension_id = d.dimension_id
    WHERE m.item_id = ?
  `;
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Merchandise not found' });
    
    res.json({
      ...row,
      image_url: validateImageUrl(row.image_url, FALLBACK_IMAGES[0])
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Spider-Server swinging on http://localhost:${PORT}`);
});