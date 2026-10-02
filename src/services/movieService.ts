import axios from "axios";
const KEY_TOKEN = import.meta.env.VITE_TMDB_TOKEN; // ✅
import type { Movie } from "../types/movie";

interface MoviesResponse {
    page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string, page: number): Promise<MoviesResponse> {
    const res = await axios.get<MoviesResponse>('https://api.themoviedb.org/3/search/movie', {
        headers: {
      Authorization: `Bearer ${KEY_TOKEN}`,
        },
        params: {
            query: query,
            page: page
        },
    })
    
    return res.data;

    
}


