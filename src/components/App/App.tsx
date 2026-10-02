import SearchBar from "../SearchBar/SearchBar";
import { Toaster } from 'react-hot-toast';
import { fetchMovies } from "../../services/movieService";
import toast from "react-hot-toast";
import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import css from './App.module.css'
import { useQuery } from "@tanstack/react-query";

type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;




function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState<string>("")

   function handleSelect(newMovie: Movie) {
    setSelectedMovie (newMovie)
    console.log(selectedMovie );
    
    
   }
  
  function handleClose() {
    setSelectedMovie(null)
  }
  function removeMovies() {
    setMovies([])
  }

  async function paginationFetch() {
    try {
      const data = await fetchMovies(query, page)
      setMovies(data.results)
      return data

    } catch (error) {
      console.log(error);
      
    }
  }

  async function handleSubmit(query: string) {
    setIsLoader(true)
    setIsError(false)
    removeMovies()

    try {
      const data = await fetchMovies(query, page)
      if (data.results.length === 0) {
        toast.error("No movies found for your request.");
        setTotalPages(0)

        return;
      }
      setQuery(query);
      setMovies(data.results);
      setTotalPages(data.total_pages)
      console.log(data);
      
    } catch (error) {
      console.log(error);
      
      
      setIsError(true);
      
    } finally {
      setIsLoader(false);

    }
  }

  const { data, isPending, error } = useQuery({
    queryKey: [`page ${page}`],
    queryFn: paginationFetch
})

  return (<>
    <SearchBar onSubmit={handleSubmit} />
    <Toaster position="top-center" reverseOrder={true} />
    {Boolean(totalPages)  && <ReactPaginate pageCount={totalPages}
pageRangeDisplayed={5}
marginPagesDisplayed={1}
onPageChange={({ selected }) => setPage(selected + 1)}
forcePage={page - 1}
containerClassName={css.pagination}
activeClassName={css.active}
nextLabel="→"
previousLabel="←"
/>}
    {movies.length > 0 && <MovieGrid movies={movies} onSelect={handleSelect} />}
    {isLoader && <Loader />}
    {isError && <ErrorMessage />}
    {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleClose}/>}
  </>)

}

export default App;