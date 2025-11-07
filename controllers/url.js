const URL = require('../models/url');
//const { nanoid } = require("nanoid");



async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body || !body.url) {
    return res.status(400).json({ error: 'url is required' });
  }

  const { nanoid } = await import('nanoid');
  const shortId = nanoid(8);

  await URL.create({
    shortId,
    redirectUrl: body.url,
    visitHistory: [],
  });
  // Check if request is from form (urlencoded) or API (json)
  const isFormRequest = req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded');

  if (isFormRequest) {
    // Form submission - render page with short URL
    const host = req.get('host');
    const shortUrl = `${req.protocol}://${host}/url/${shortId}`;
    return res.render('home', { shortUrl });
  } else {
    // API request - return JSON
    return res.json({ id: shortId });
  }
}




async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  if (!result) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
}