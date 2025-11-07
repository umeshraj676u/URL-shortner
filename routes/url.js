const express = require('express');

const { handleGenerateNewShortURL, handleGetAnalytics } = require("../controllers/url");

const router = express.Router();

// GET route to show available endpoints
router.get("/", (req, res) => {
  res.json({
    message: "URL Shortener API",
    endpoints: {
      "POST /url": "Create a new short URL",
      "GET /url/analytics/:shortId": "Get analytics for a short URL",
      "GET /url/:shortId": "Redirect to original URL"
    },
    example: {
      "POST /url": {
        "body": { "url": "https://example.com" },
        "response": { "id": "shortId123" }
      }
    }
  });
});

router.post("/", handleGenerateNewShortURL);

router.get('/analytics/:shortId', handleGetAnalytics)

module.exports = router;