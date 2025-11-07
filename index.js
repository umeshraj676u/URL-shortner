const express = require('express');
const path = require('path');
const { connectToMongoDB } = require("./routes/connect");
const urlRouter = require("./routes/url");
const URL = require('./models/url');
const saticRoute = require('./routes/staticRouter');
 
const app = express();
const PORT = 8001;

app.use(express.json());

connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRouter);
app.use("/", saticRoute);

app.get('/url/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate({
    shortId
  },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    });
  if (!entry) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  res.redirect(entry.redirectUrl);
});

app.get('/:test', async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
  });
});

app.listen(PORT, () => console.log(`Server is Started at PORT ${PORT}`));