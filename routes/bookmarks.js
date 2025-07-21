const express = require('express');
const { db } = require('../utils/db');
const { scrapeMetadata, generateSummary } = require('../utils/scraper');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all bookmarks for user
router.get('/', authMiddleware, (req, res) => {
  const { tag } = req.query;
  let query = 'SELECT * FROM bookmarks WHERE user_id = ?';
  let params = [req.user.userId];

  if (tag) {
    query += ' AND tags LIKE ?';
    params.push(`%${tag}%`);
  }

  query += ' ORDER BY position DESC, created_at DESC';

  db.all(query, params, (err, bookmarks) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(bookmarks);
  });
});

// Create bookmark
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { url, tags } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Scrape metadata
    const { title, favicon } = await scrapeMetadata(url);
    
    // Generate summary
    const summary = await generateSummary(url);

    db.run(
      'INSERT INTO bookmarks (user_id, url, title, favicon, summary, tags) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.userId, url, title, favicon, summary, tags || ''],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Server error' });
        }

        const bookmark = {
          id: this.lastID,
          user_id: req.user.userId,
          url,
          title,
          favicon,
          summary,
          tags: tags || '',
          position: 0,
          created_at: new Date().toISOString()
        };

        res.json(bookmark);
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete bookmark
router.delete('/:id', authMiddleware, (req, res) => {
  db.run(
    'DELETE FROM bookmarks WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ message: 'Bookmark deleted' });
    }
  );
});

// Update bookmark position (for drag-drop)
router.patch('/:id/position', authMiddleware, (req, res) => {
  const { position } = req.body;
  
  db.run(
    'UPDATE bookmarks SET position = ? WHERE id = ? AND user_id = ?',
    [position, req.params.id, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ message: 'Position updated' });
    }
  );
});

module.exports = router;