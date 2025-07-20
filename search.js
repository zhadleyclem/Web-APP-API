/**
 * Search and movie display functionality
 */

// Main search function
async function searchMovies() {
    const searchInput = document.getElementById('searchInput');
    const limitInput = document.getElementById('limitInput');
    const resultsDiv = document.getElementById('searchResults');
    const movieDetailDiv = document.getElementById('movieDetail');
    
    const query = searchInput.value.trim();
    const limit = Math.min(parseInt(limitInput.value) || APP_SETTINGS.DEFAULT_LIMIT, APP_SETTINGS.MAX_LIMIT);
    
    // Clear previous results
    movieDetailDiv.innerHTML = '';
    resultsDiv.innerHTML = '<div class="loading">Searching movies...</div>';
    
    try {
        let url;
        if (query) {
            // Search by query - supports partial matching
            url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SEARCH_MOVIE}?api_key=${API_CONFIG.API_KEY}&query=${encodeURIComponent(query)}&page=1`;
        } else {
            // Get popular movies when no search term
            url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.POPULAR_MOVIES}?api_key=${API_CONFIG.API_KEY}&page=1`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            // Limit results as requested
            const limitedResults = data.results.slice(0, limit);
            displayMovieResults(limitedResults, query || 'popular movies');
        } else {
            resultsDiv.innerHTML = '<div class="error">No movies found. Please try a different search term.</div>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<div class="error">Error searching movies. Please check your internet connection and try again.</div>';
        console.error('Search error:', error);
    }
}

// Display movie results in table format
function displayMovieResults(movies, searchTerm) {
    const resultsDiv = document.getElementById('searchResults');
    
    if (movies.length === 0) {
        resultsDiv.innerHTML = '<div class="error">No movies found for your search.</div>';
        return;
    }
    
    let html = `<h2>Search Results for "${searchTerm}" (${movies.length} movies)</h2>`;
    html += `
        <table class="results-table">
            <thead>
                <tr>
                    <th>Poster</th>
                    <th>Title</th>
                    <th>Release Date</th>
                    <th>Rating</th>
                    <th>Overview</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    movies.forEach(movie => {
        const posterUrl = movie.poster_path 
            ? `${API_CONFIG.IMAGE_BASE_URL}${movie.poster_path}` 
            : API_CONFIG.PLACEHOLDER_IMAGE;
        
        const overview = movie.overview 
            ? (movie.overview.length > APP_SETTINGS.OVERVIEW_TRUNCATE_LENGTH 
                ? movie.overview.substring(0, APP_SETTINGS.OVERVIEW_TRUNCATE_LENGTH) + '...' 
                : movie.overview)
            : 'No overview available';
        
        const releaseDate = movie.release_date || 'Unknown';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        
        html += `
            <tr>
                <td><img src="${posterUrl}" alt="${movie.title}" class="movie-poster" onerror="this.src='${API_CONFIG.PLACEHOLDER_IMAGE}'"></td>
                <td><span class="movie-title" onclick="showMovieDetail(${movie.id})">${movie.title}</span></td>
                <td>${releaseDate}</td>
                <td>⭐ ${rating}/10</td>
                <td>${overview}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    resultsDiv.innerHTML = html;
}

// Show detailed view of a single movie
async function showMovieDetail(movieId) {
    const movieDetailDiv = document.getElementById('movieDetail');
    movieDetailDiv.innerHTML = '<div class="loading">Loading movie details...</div>';
    
    try {
        // Get detailed movie information including cast and crew
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.MOVIE_DETAILS}${movieId}?api_key=${API_CONFIG.API_KEY}&append_to_response=credits`);
        const movie = await response.json();
        
        if (movie.success === false) {
            throw new Error(movie.status_message || 'Movie not found');
        }
        
        const posterUrl = movie.poster_path 
            ? `${API_CONFIG.IMAGE_BASE_URL}${movie.poster_path}` 
            : API_CONFIG.PLACEHOLDER_IMAGE_LARGE;
        
        // Extract additional information
        const genres = movie.genres && movie.genres.length > 0 
            ? movie.genres.map(g => g.name).join(', ') 
            : 'Unknown';
        
        const runtime = movie.runtime 
            ? `${movie.runtime} minutes` 
            : 'Unknown';
        
        const director = movie.credits && movie.credits.crew 
            ? movie.credits.crew.find(person => person.job === 'Director')?.name || 'Unknown'
            : 'Unknown';
        
        const budget = movie.budget && movie.budget > 0 
            ? '$' + movie.budget.toLocaleString() 
            : 'Unknown';
        
        const revenue = movie.revenue && movie.revenue > 0 
            ? '$' + movie.revenue.toLocaleString() 
            : 'Unknown';
        
        const releaseDate = movie.release_date || 'Unknown';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const voteCount = movie.vote_count ? movie.vote_count.toLocaleString() : '0';
        
        const html = `
            <h2>Movie Details</h2>
            <div class="movie-detail">
                <div>
                    <img src="${posterUrl}" alt="${movie.title}" class="movie-poster-large" onerror="this.src='${API_CONFIG.PLACEHOLDER_IMAGE_LARGE}'">
                </div>
                <div class="movie-info">
                    <h2>${movie.title}</h2>
                    <p><strong>Release Date:</strong> ${releaseDate}</p>
                    <p><strong>Rating:</strong> ⭐ ${rating}/10 (${voteCount} votes)</p>
                    <p><strong>Runtime:</strong> ${runtime}</p>
                    <p><strong>Genres:</strong> ${genres}</p>
                    <p><strong>Director:</strong> ${director}</p>
                    <p><strong>Budget:</strong> ${budget}</p>
                    <p><strong>Revenue:</strong> ${revenue}</p>
                    <p><strong>Overview:</strong></p>
                    <p>${movie.overview || 'No overview available.'}</p>
                </div>
            </div>
        `;
        
        movieDetailDiv.innerHTML = html;
        movieDetailDiv.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        movieDetailDiv.innerHTML = '<div class="error">Error loading movie details. Please try again.</div>';
        console.error('Movie detail error:', error);
    }
}

// Set up search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    
    // Allow Enter key to trigger search
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchMovies();
            }
        });
    }
});
