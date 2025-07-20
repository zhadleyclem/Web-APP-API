/**
 * Statistics functionality for the Movie Collection App
 */

// Load and display statistics
async function loadStatistics() {
    const statsDiv = document.getElementById('statsContent');
    statsDiv.innerHTML = '<div class="loading">Loading statistics...</div>';
    
    try {
        // Make multiple API calls to gather comprehensive statistics
        const apiCalls = [
            fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.POPULAR_MOVIES}?api_key=${API_CONFIG.API_KEY}`),
            fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.TOP_RATED_MOVIES}?api_key=${API_CONFIG.API_KEY}`),
            fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPCOMING_MOVIES}?api_key=${API_CONFIG.API_KEY}`),
            fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GENRES}?api_key=${API_CONFIG.API_KEY}`)
        ];
        
        const [popularResponse, topRatedResponse, upcomingResponse, genresResponse] = await Promise.all(apiCalls);
        
        // Check if all responses are successful
        if (!popularResponse.ok || !topRatedResponse.ok || !upcomingResponse.ok || !genresResponse.ok) {
            throw new Error('Failed to fetch statistics data');
        }
        
        const [popular, topRated, upcoming, genres] = await Promise.all([
            popularResponse.json(),
            topRatedResponse.json(),
            upcomingResponse.json(),
            genresResponse.json()
        ]);
        
        // Calculate various statistics
        const stats = calculateStatistics(popular, topRated, upcoming, genres);
        
        // Display the statistics
        displayStatistics(stats);
        
    } catch (error) {
        statsDiv.innerHTML = '<div class="error">Error loading statistics. Please check your internet connection and try again.</div>';
        console.error('Statistics error:', error);
    }
}

// Calculate statistics from API data
function calculateStatistics(popular, topRated, upcoming, genres) {
    const stats = {};
    
    // 1. Average Rating of Popular Movies
    if (popular.results && popular.results.length > 0) {
        const totalRating = popular.results.reduce((sum, movie) => sum + (movie.vote_average || 0), 0);
        stats.avgPopularRating = (totalRating / popular.results.length).toFixed(1);
    } else {
        stats.avgPopularRating = 'N/A';
    }
    
    // 2. Average Rating of Top Rated Movies
    if (topRated.results && topRated.results.length > 0) {
        const totalRating = topRated.results.reduce((sum, movie) => sum + (movie.vote_average || 0), 0);
        stats.avgTopRatedRating = (totalRating / topRated.results.length).toFixed(1);
    } else {
        stats.avgTopRatedRating = 'N/A';
    }
    
    // 3. Total Upcoming Movies
    stats.totalUpcoming = upcoming.total_results ? upcoming.total_results.toLocaleString() : 'N/A';
    
    // 4. Total Movie Genres Available
    stats.totalGenres = genres.genres ? genres.genres.length : 'N/A';
    
    // 5. Most Popular Release Year (from current popular movies)
    stats.mostPopularYear = getMostPopularYear(popular.results || []);
    
    return stats;
}

// Display statistics in a grid layout
function displayStatistics(stats) {
    const statsDiv = document.getElementById('statsContent');
    
    const html = `
        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-number">${stats.avgPopularRating}</span>
                <div class="stat-label">Average Rating of Popular Movies</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">${stats.avgTopRatedRating}</span>
                <div class="stat-label">Average Rating of Top Rated Movies</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">${stats.totalUpcoming}</span>
                <div class="stat-label">Total Upcoming Movies</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">${stats.totalGenres}</span>
                <div class="stat-label">Total Movie Genres Available</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">${stats.mostPopularYear}</span>
                <div class="stat-label">Most Popular Release Year (from current trending)</div>
            </div>
        </div>
    `;
    
    statsDiv.innerHTML = html;
}

// Helper function to find the most popular release year
function getMostPopularYear(movies) {
    if (!movies || movies.length === 0) {
        return 'N/A';
    }
    
    const yearCounts = {};
    
    // Count movies by release year
    movies.forEach(movie => {
        if (movie.release_date) {
            const year = movie.release_date.split('-')[0];
            if (year && year.length === 4) { // Validate year format
                yearCounts[year] = (yearCounts[year] || 0) + 1;
            }
        }
    });
    
    // Find the year with the most movies
    if (Object.keys(yearCounts).length === 0) {
        return 'N/A';
    }
    
    const mostPopularYear = Object.keys(yearCounts).reduce((a, b) => 
        yearCounts[a] > yearCounts[b] ? a : b
    );
    
    return mostPopularYear;
}

// Additional utility function to get genre statistics (if needed for future expansion)
function getGenreStatistics(movies, genres) {
    if (!movies || !genres) return {};
    
    const genreMap = {};
    genres.forEach(genre => {
        genreMap[genre.id] = genre.name;
    });
