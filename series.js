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

        seasonData.sort((a, b) => a.season - b.season);

        seasonData.forEach(({ season, episodes }) => {
            const episodeList = document.createElement('ul');
            episodeList.id = `season${season}`;
            episodeList.style.display = 'none';

            episodes.forEach(episode => {
                const episodeItem = document.createElement('li');
                const episodeLink = document.createElement('a');
                episodeLink.href = '#';
                episodeLink.textContent = `Episode ${episode.Episode} - ${episode.Title}`;
                episodeLink.setAttribute('data-plot', episode.Plot || 'N/A');
                episodeLink.classList.add('episode-link');
                
                episodeLink.addEventListener('mouseover', showTooltip);
                episodeLink.addEventListener('mouseout', hideTooltip);

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

    function showTooltip(event) {
        const episodeLink = event.target;
        const plot = episodeLink.getAttribute('data-plot');
        
        if (plot) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = plot;
            document.body.appendChild(tooltip);

            const rect = episodeLink.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
            episodeLink._tooltip = tooltip;
        }
    }

    function hideTooltip(event) {
        const tooltip = event.target._tooltip;
        if (tooltip) {
            tooltip.remove();
        }
    }
