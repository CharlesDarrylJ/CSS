const apiKey = 'dea61e35';

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
                fetchSeasonsAndEpisodes(imdbID, data.totalSeasons);
            } else {
                console.error('Error fetching movie details:', data.Error);
            }
        })
        .catch(error => console.error('Network error:', error));
}

async function fetchSeasonsAndEpisodes(imdbID, totalSeasons) {
    const container = document.getElementById('seasons-container');
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.className = 'loading-spinner';
    loader.textContent = 'Loading...';
    container.appendChild(loader);

    const seasonData = [];

    for (let season = 1; season <= totalSeasons; season++) {
        const url = `https://www.omdbapi.com/?i=${imdbID}&Season=${season}&apikey=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                seasonData.push({ season, episodes: data.Episodes });
            } else {
                console.error(`Error fetching Season ${season}:`, data.Error);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

    // Remove loader once all seasons are loaded
    container.removeChild(loader);

    // Sort the season data by season number
    seasonData.sort((a, b) => a.season - b.season);

    // Render sorted seasons and episodes
    seasonData.forEach(({ season, episodes }) => {
        const episodeList = document.createElement('ul');
        episodeList.id = `season${season}`;
        episodeList.style.display = 'none';

        episodes.forEach(episode => {
            const episodeItem = document.createElement('li');
            const episodeLink = document.createElement('a');
            episodeLink.href = '#';
            episodeLink.textContent = `Episode ${episode.Episode} - ${episode.Title}`;
            episodeLink.onclick = () => {
                showVideo(
                    `https://vidsrc.to/embed/tv/${imdbID}/${season}/${episode.Episode}`,
                    `Episode ${episode.Episode} - ${episode.Title}`
                );
                return false;
            };
            episodeItem.appendChild(episodeLink);
            episodeList.appendChild(episodeItem);
        });

        const seasonButton = document.createElement('button');
        seasonButton.textContent = `Season ${season}`;
        seasonButton.className = 'season-button';
        seasonButton.onclick = () => toggleSeason(`season${season}`);

        container.appendChild(seasonButton);
        container.appendChild(episodeList);
    });
}

function toggleSeason(seasonId) {
    const season = document.getElementById(seasonId);
    season.style.display = season.style.display === 'none' ? 'block' : 'none';
}

function showVideo(videoUrl, episodeName) {
    document.getElementById('video-player').src = videoUrl;
    document.getElementById('default-message').style.display = 'none';
    document.getElementById('video-player').style.display = 'block';
    document.getElementById('episode-title').style.display = 'block';
    document.getElementById('current-episode').textContent = episodeName;
}
