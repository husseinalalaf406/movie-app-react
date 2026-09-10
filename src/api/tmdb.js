/**
 * Utility for constructing and calling the Netlify serverless TMDB proxy.
 * Routes all TMDB requests through /.netlify/functions/tmdb?path=...
 * completely isolating the TMDB API key on the backend.
 */

export const NETLIFY_TMDB_ENDPOINT = "/.netlify/functions/tmdb";

/**
 * Builds the URL pointing to the Netlify serverless function.
 * 
 * Example inputs:
 *   getTmdbUrl("/movie/popular")
 *   -> "/.netlify/functions/tmdb?path=/movie/popular"
 *
 *   getTmdbUrl("/discover/movie?with_genres=28&page=1")
 *   -> "/.netlify/functions/tmdb?with_genres=28&page=1&path=/discover/movie"
 */
export function getTmdbUrl(pathOrEndpoint, params = {}) {
  if (!pathOrEndpoint) return "";

  // If already prefixed with /.netlify/functions/tmdb, return as is
  if (pathOrEndpoint.startsWith(NETLIFY_TMDB_ENDPOINT)) {
    return pathOrEndpoint;
  }

  // Strip legacy /api/tmdb prefix if present
  let cleanPath = pathOrEndpoint.replace(/^\/api\/tmdb/, "");

  // Split pathname and any inline query params
  const [pathname, queryString] = cleanPath.split("?");
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  const searchParams = new URLSearchParams(queryString || "");
  searchParams.set("path", normalizedPath);

  // Append any extra params passed in params object
  if (params && typeof params === "object") {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, val);
      }
    });
  }

  return `${NETLIFY_TMDB_ENDPOINT}?${searchParams.toString()}`;
}

export default getTmdbUrl;
