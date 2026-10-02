import SearchBar from "../SearchBar/SearchBar";
import { Toaster } from 'react-hot-toast';
import { fetchMovies } from "../../services/movieService";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import css from './App.module.css'
import { useQuery, keepPreviousData } from "@tanstack/react-query";


type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;




function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState<string>("")

   function handleSelect(newMovie: Movie) {
    setSelectedMovie (newMovie)
    console.log(selectedMovie );
    
    
   }
  
  function handleClose() {
    setSelectedMovie(null)
  }
  

  function setFormQuery(query: string) {
    setQuery(query)
    setPage(1)
  }



  // async function handleSubmit(query: string) {
  //   setIsLoader(true)
  //   setIsError(false)
  //   removeMovies()

  //   try {
  //     const data = await fetchMovies(query, page)
  //     if (data.results.length === 0) {
  //       toast.error("No movies found for your request.");
  //       setTotalPages(0)

  //       return;
  //     }
  //     setQuery(query);
  //     setMovies(data.results);
  //     setTotalPages(data.total_pages)
  //     console.log(data);
      
  //   } catch (error) {
  //     console.log(error);
            
  //   } 
  // }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['page', {query}, {page}],
  queryFn: () => fetchMovies(query, page),
    enabled: query.length > 0,
  placeholderData: keepPreviousData,
  })
  useEffect(() => {
  if (data && data.results.length === 0) {
    toast.error("No movies found for your request.");
  }
}, [data]);

  return (<>
    <SearchBar onSubmit={setFormQuery} />
    <Toaster position="top-center" reverseOrder={true} />
    {data && data.total_pages > 1 && (<ReactPaginate pageCount={data.total_pages}
pageRangeDisplayed={5}
marginPagesDisplayed={1}
onPageChange={({ selected }) => setPage(selected + 1)}
forcePage={page - 1}
containerClassName={css.pagination}
activeClassName={css.active}
nextLabel="→"
previousLabel="←"
/>)}
    {data && data.results.length > 0 && (<MovieGrid movies={data.results} onSelect={handleSelect} />)}
    {isLoading && <Loader />}
    {isError && <ErrorMessage />}
    {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleClose}/>}
  </>)

}

export default App;