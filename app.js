const apiKey = '7e35a21e';

// ---------------------------
// Functionality for Home Page
// ---------------------------

// Get DOM elements
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');
const released2024Div = document.getElementById('released-2024-movies');
const topHollywoodDiv = document.getElementById('top-hollywood-movies');
let timeout = null;

// Add event listener for search input
searchInput?.addEventListener('input', () => {
    // Clear previous timeout to avoid multiple API calls
    clearTimeout(timeout);
    // Set a timeout to fetch search results after user stops typing
    timeout = setTimeout(() => {
        searchMovies(searchInput.value);
    }, 500);
});

// Function to search movies based on the query
function searchMovies(query) {
    // If the query is too short, clear results
    if (query.length < 3) {
        resultsDiv.innerHTML = '';
        return;
    }

    // Fetch search results from OMDB API
    fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                displayResults(data.Search);
            } else {
                resultsDiv.innerHTML = `<p>No results found</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            resultsDiv.innerHTML = `<p>Error fetching results</p>`;
        });
}

// Function to display search results in the DOM
function displayResults(movies) {
    resultsDiv.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'col-md-3 movie-card';

        movieCard.innerHTML = `
            <div class="card h-100">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" class="card-img-top movie-poster" alt="${movie.Title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${movie.Title}</h5>
                    <p class="card-text">Year: ${movie.Year}</p>
                    <div class="mt-auto">
                        <button class="btn btn-primary mb-2" onclick="addToFavorites('${movie.imdbID}')">Add to Favorites</button>
                        <a href="movie.html?id=${movie.imdbID}" class="btn btn-secondary">More Info</a>
                    </div>
                </div>
            </div>
        `;

        resultsDiv.appendChild(movieCard);
    });
}

// Function to add a movie to favorites
function addToFavorites(movieId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(movieId)) {
        favorites.push(movieId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Movie added to favorites!');
    } else {
        alert('Movie is already in favorites.');
    }
}

// ---------------------------
// Functionality for Movie Details Page
// ---------------------------

// Get the movie ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const movieDetailsDiv = document.getElementById('movie-details');

// Fetch and display movie details if movie ID is present
if (movieId && movieDetailsDiv) {
    fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(movie => {
            displayMovieDetails(movie);
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
            movieDetailsDiv.innerHTML = `<p>Error fetching movie details</p>`;
        });
}

// Function to display movie details on the movie details page
function displayMovieDetails(movie) {
    movieDetailsDiv.innerHTML = `
        <div class="card mb-4 card-body">
            <center>
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" class="card-img-top movie-details-poster" alt="${movie.Title}">
            </center>
            <div class="card-body">
                <h2 class="card-title">${movie.Title}</h2>
                <p class="card-text"><strong>Plot:</strong> ${movie.Plot}</p>
                <p class="card-text"><strong>Director:</strong> ${movie.Director}</p>
                <p class="card-text"><strong>Genre:</strong> ${movie.Genre}</p>
                <p class="card-text"><strong>Released:</strong> ${movie.Released}</p>
                <button class="btn btn-primary mb-2" onclick="addToFavorites('${movie.imdbID}')">Add to Favorites</button>
                <a href="index.html" class="btn btn-secondary">Back to Home</a>
            </div>
        </div>
    `;
}

// ---------------------------
// Functionality for My Favourite Movies Page
// ---------------------------

// Get the favorites container
const favoritesDiv = document.getElementById('favorites');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Load and display favorite movies on page load
if (favoritesDiv) {
    window.onload = function() {
        loadFavorites();
    };
}

// Function to load and display favorite movies
function loadFavorites() {
    favoritesDiv.innerHTML = '';

    if (favorites.length === 0) {
        favoritesDiv.innerHTML = '<p>No favorite movies found.</p>';
        return;
    }

    favorites.forEach(movieId => {
        fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(movie => {
                displayFavoriteMovie(movie);
            })
            .catch(error => {
                console.error('Error fetching favorite movie:', error);
            });
    });
}

// Function to display a favorite movie in the favorites section
function displayFavoriteMovie(movie) {
    const movieCard = document.createElement('div');
    movieCard.className = 'col-md-3 movie-card';

    movieCard.innerHTML = `
        <div class="card h-100">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" class="card-img-top movie-poster" alt="${movie.Title}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${movie.Title}</h5>
                <p class="card-text">Year: ${movie.Year}</p>
                <div class="mt-auto">
                    <button class="btn btn-danger" onclick="confirmRemoveFromFavorites('${movie.imdbID}')">Remove from Favorites</button>
                </div>
            </div>
        </div>
    `;

    favoritesDiv.appendChild(movieCard);
}

// Function to confirm removal of a movie from favorites
function confirmRemoveFromFavorites(movieId) {
    if (confirm('Are you sure you want to remove this movie from favorites?')) {
        removeFromFavorites(movieId);
    }
}

// Function to remove a movie from favorites
function removeFromFavorites(movieId) {
    favorites = favorites.filter(id => id !== movieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
}

// ---------------------------
// Fetch and Display Initial Movie Sections
// ---------------------------

// Function to fetch and display movies released in 2024
function fetchReleased2024Movies() {
    const searchTerms = ['action', 'comedy', 'drama', 'thriller', 'sci-fi'];
    const promises = searchTerms.map(term => 
        fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(term)}&y=2024&type=movie&apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => data.Response === 'True' ? data.Search : [])
            .catch(error => {
                console.error(`Error fetching movies for term "${term}":`, error);
                return [];
            })
    );

    Promise.all(promises)
        .then(results => {
            const movies = [...new Set(results.flat().map(movie => movie.imdbID))]
                .map(id => results.flat().find(movie => movie.imdbID === id));

            displayInitialMovies(movies, released2024Div);
        });
}

// Function to fetch and display top Hollywood movies
function fetchTopHollywoodMovies() {
    const topMovies = ['The Godfather', 'The Dark Knight', 'Inception', 'Pulp Fiction', 'Fight Club', 'Forrest Gump', 'The Matrix', 'Interstellar', 'Gladiator', 'The Avengers'];

    const promises = topMovies.map(title => 
        fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(movie => movie.Response === 'True' ? movie : null)
            .catch(error => {
                console.error(`Error fetching movie "${title}":`, error);
                return null;
            })
    );

    Promise.all(promises)
        .then(results => {
            const movies = results.filter(movie => movie !== null);
            displayInitialMovies(movies, topHollywoodDiv);
        });
}

// Function to display initial movies in specified container
function displayInitialMovies(movies, container) {
    container.innerHTML = '';

    if (movies.length === 0) {
        container.innerHTML = '<p>No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'col-md-3 movie-card';

        movieCard.innerHTML = `
            <div class="card h-100">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" class="card-img-top movie-poster" alt="${movie.Title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${movie.Title}</h5>
                    <p class="card-text">Year: ${movie.Year}</p>
                    <div class="mt-auto">
                        <button class="btn btn-primary mb-2" onclick="addToFavorites('${movie.imdbID}')">Add to Favorites</button>
                        <a href="movie.html?id=${movie.imdbID}" class="btn btn-secondary">More Info</a>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(movieCard);
    });
}

// Fetch movies for initial sections
fetchReleased2024Movies();
fetchTopHollywoodMovies();
