    const apiKey = 'dea61e35';

    // Fetch movie details from OMDb API
    function fetchMovieDetails(imdbID) {
        const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Response === "True") {
                    document.getElementById('movie-title').textContent = data.Title || 'N/A';
                    document.getElementById('movie-rating').textContent = `IMDb Rating: ${data.imdbRating || 'N/A'}`;
                    document.getElementById('movie-plot').textContent = `Plot: ${data.Plot || 'N/A'}`;
                    document.getElementById('release-date').textContent = `Release Date: ${data.Released || 'N/A'}`;
                } else {
                    console.error('Error fetching movie details:', data.Error);
                }
            })
            .catch(error => console.error('Network error:', error));
    }

    function showMovie(videoUrl) {
        const videoPlayer = document.getElementById('video-player');
        document.getElementById('default-message').style.display = 'none';
        videoPlayer.src = videoUrl;
        videoPlayer.style.display = 'block';
    }
