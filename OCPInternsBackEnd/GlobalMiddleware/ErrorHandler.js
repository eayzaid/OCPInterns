function errorHandler(err, _req, res, _next) {
  const clientUrl = process.env.WEB_APP_URL;
  if (err.message && err.statusCode) {
    if (err.statusCode === 401) {
      res.status(err.statusCode).end();
    } else res.status(err.statusCode).json({ error: err.message });
  } else res.status(500).json({ error: "Internal Server Error" });
}

module.exports = errorHandler;
