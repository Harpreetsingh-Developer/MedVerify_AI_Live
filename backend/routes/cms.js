const express = require('express');
const router = express.Router();

// Health library categories
router.get('/library/:category', (req, res) => {
  const { category } = req.params;
  res.json({ category, articles: [{ title: 'General Health Tips', slug: 'general-health-tips' }] });
});

// Blog by slug
router.get('/blog/:slug', (req, res) => {
  const { slug } = req.params;
  res.json({ slug, title: 'Sample Blog Post', content: 'CMS stub content', tags: ['health'] });
});

// Newsletter signup stub
router.post('/newsletter', (req, res) => {
  const { email } = req.body;
  res.json({ status: 'subscribed', email });
});

module.exports = router;