/**
 * Navigation functionality for the Movie Collection App
 */

// Show different pages and handle navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Add active class to corresponding nav link
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Load page-specific content
    loadPageContent(pageId);
}

// Load content specific to each page
function loadPageContent(pageId) {
    switch(pageId) {
        case 'statistics':
            loadStatistics();
            break;
        case 'home':
            // Load popular movies if no search has been performed
            if (!document.getElementById('searchResults').innerHTML) {
                searchMovies();
            }
            break;
        case 'about':
            // About page is static, no additional loading needed
            break;
        default:
            console.log('Unknown page:', pageId);
    }
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Get page ID from onclick attribute or data attribute
            const onclick = this.getAttribute('onclick');
            if (onclick) {
                const pageId = onclick.match(/showPage\('(\w+)'\)/)[1];
                showPage(pageId);
            }
        });
    });
    
    // Initialize with home page
    loadPageContent('home');
});
