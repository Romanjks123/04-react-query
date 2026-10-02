import type { Movie } from "../../types/movie";
import css from "./MovieModal.module.css";
import { createPortal } from "react-dom";
import type { MouseEvent } from "react";
import { useEffect } from "react";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const modalRoot = document.getElementById("modal-root") as HTMLElement;

function MovieModal({
    movie: { backdrop_path, title, overview, release_date, vote_average },
    onClose,
}: MovieModalProps) {
    function handleBackdropClick(e: MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }
    useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };
const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", handleKeyDown);

  return () => {
      document.removeEventListener("keydown", handleKeyDown);
          document.body.style.overflow = prevOverflow;

  };
}, [onClose]);
  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
          alt={title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{title}</h2>
          <p>{overview}</p>
          <p>
            <strong>Release Date:</strong> {release_date}
          </p>
          <p>
            <strong>Rating:</strong> {vote_average}/10
          </p>
        </div>
      </div>
    </div>, modalRoot
  );
}

export default MovieModal;