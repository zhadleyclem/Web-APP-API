// TMDB API configuration
const API_CONFIG = {
    API_KEY: '...',  hidden for github
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
    PLACEHOLDER_IMAGE: 'https://via.placeholder.com/60x90/cccccc/666666?text=No+Image',
    PLACEHOLDER_IMAGE_LARGE: 'https://via.placeholder.com/300x450/cccccc/666666?text=No+Image'
};

// API endpoints
const API_ENDPOINTS = {
    SEARCH_MOVIE: '/search/movie',
    POPULAR_MOVIES: '/movie/popular',
    TOP_RATED_MOVIES: '/movie/top_rated',
    UPCOMING_MOVIES: '/movie/upcoming',
    MOVIE_DETAILS: '/movie/',
    GENRES: '/genre/movie/list'
};

// Default settings
const APP_SETTINGS = {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    OVERVIEW_TRUNCATE_LENGTH: 100
};
