const https = require('https');

module.exports = function (app) {
  const handler = (req, res) => {
    const apiKey = process.env.TMDB_API_KEY || process.env.REACT_APP_TMDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "TMDB_API_KEY is not configured in backend environment variables.",
        results: [],
        cast: [],
        videos: { results: [] },
      });
    }

    let tmdbPath = req.query.path;
    const params = new URLSearchParams();

    if (tmdbPath) {
      if (tmdbPath.includes('?')) {
        const [cleanPath, queryStr] = tmdbPath.split('?', 2);
        tmdbPath = cleanPath;
        const innerParams = new URLSearchParams(queryStr);
        for (const [k, v] of innerParams.entries()) {
          params.set(k, v);
        }
      }
      for (const [k, v] of Object.entries(req.query)) {
        if (k !== 'path') {
          params.set(k, v);
        }
      }
    } else {
      tmdbPath = req.path
        .replace(/^\/api\/tmdb/, '')
        .replace(/^\/\.netlify\/functions\/tmdb/, '');
      for (const [k, v] of Object.entries(req.query)) {
        params.set(k, v);
      }
    }

    if (!tmdbPath.startsWith('/')) {
      tmdbPath = '/' + tmdbPath;
    }

    params.set('api_key', apiKey);

    const tmdbUrl = `https://api.themoviedb.org/3${tmdbPath}?${params.toString()}`;

    https
      .get(tmdbUrl, (upstreamRes) => {
        res.writeHead(upstreamRes.statusCode || 200, {
          'content-type':
            upstreamRes.headers['content-type'] || 'application/json',
          'access-control-allow-origin': '*',
        });
        upstreamRes.pipe(res);
      })
      .on('error', (err) => {
        res.status(502).json({
          error: 'Failed to communicate with TMDB API',
          message: err.message,
        });
      });
  };

  app.get('/.netlify/functions/tmdb', handler);
  app.get('/api/tmdb/*', handler);
};
