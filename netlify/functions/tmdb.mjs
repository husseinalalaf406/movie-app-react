export default async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // 1. Read TMDB API key securely from backend environment variable
  const apiKey = process.env.TMDB_API_KEY || process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "TMDB_API_KEY is not configured in backend environment variables.",
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  const url = new URL(req.url);
  const rawPath = url.searchParams.get("path");
  const params = new URLSearchParams();
  let tmdbPath = "";

  if (rawPath) {
    // If the path contains its own query string (e.g. ?path=/discover/movie?with_genres=28&page=1)
    if (rawPath.includes("?")) {
      const [pathname, queryStr] = rawPath.split("?", 2);
      tmdbPath = pathname;
      const innerParams = new URLSearchParams(queryStr);
      for (const [key, val] of innerParams.entries()) {
        params.set(key, val);
      }
    } else {
      tmdbPath = rawPath;
    }

    // Also forward any additional search params passed on the request (except "path")
    for (const [key, val] of url.searchParams.entries()) {
      if (key !== "path") {
        params.set(key, val);
      }
    }
  } else {
    // Direct path routing fallback (e.g. /api/tmdb/* or /.netlify/functions/tmdb/*)
    tmdbPath = url.pathname
      .replace(/^\/api\/tmdb/, "")
      .replace(/^\/\.netlify\/functions\/tmdb/, "");
    for (const [key, val] of url.searchParams.entries()) {
      params.set(key, val);
    }
  }

  // Ensure clean leading slash
  if (!tmdbPath.startsWith("/")) {
    tmdbPath = `/${tmdbPath}`;
  }

  // Inject server-side TMDB API key
  params.set("api_key", apiKey);

  const tmdbUrl = `https://api.themoviedb.org/3${tmdbPath}?${params.toString()}`;

  try {
    const res = await fetch(tmdbUrl);
    const body = await res.text();

    return new Response(body, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Failed to communicate with TMDB API",
        message: err.message,
      }),
      {
        status: 502,
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};

export const config = {
  path: ["/api/tmdb/*", "/.netlify/functions/tmdb"],
};
