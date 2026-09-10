export default async (req) => {
  const url = new URL(req.url);
  const tmdbPath = url.pathname.replace(/^\/api\/tmdb/, "");

  const params = new URLSearchParams(url.searchParams);
  params.set("api_key", process.env.REACT_APP_TMDB_API_KEY);

  const tmdbUrl = `https://api.themoviedb.org/3${tmdbPath}?${params.toString()}`;

  const res = await fetch(tmdbUrl);
  const body = await res.text();

  return new Response(body, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
};

export const config = {
  path: "/api/tmdb/*",
};
