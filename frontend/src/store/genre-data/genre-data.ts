import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, DEFAULT_GENRE } from '../../const';
import { GenreState } from '../../types/state';

const initialState: GenreState = {
  activeGenre: DEFAULT_GENRE,
  filmsByGenre: [],
  isLoading: false,
};

export const genreData = createSlice({
  name: NameSpace.Genre,
  initialState,
  reducers: {
    setActiveGenre: (state, action) => {
      state.activeGenre = action.payload;
    },
    setFilmsByGenre: (state, action) => {
      const data = action.payload.data;
      const currentGenre = action.payload.genre;
      if (currentGenre !== DEFAULT_GENRE) {
        state.filmsByGenre = [...data].filter((film) =>
          film.genre === currentGenre[0].toUpperCase() + currentGenre.slice(1));

        return;
      }

      state.filmsByGenre = data;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setActiveGenre, setFilmsByGenre, setLoading } = genreData.actions;
