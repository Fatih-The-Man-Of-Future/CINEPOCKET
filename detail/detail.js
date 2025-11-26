const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500'; 
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjFiZGNjYzc4NDY2NDY2NzQ1NTAwZDljY2Q2OTMzNyIsIm5iZiI6MTc2NDA3NjU4Ny41NzUsInN1YiI6IjY5MjVhYzJiMTUyYzRjYzlmNDMwYzdjZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zO76gT2bVa8yjQepdp-kRpRu6gBJg9x_Qa2_AhFsi8k'
    }
};

function getMovieIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// DOM DETAIL
function renderMovieDetail(movie, cast) {
    const detailCard = document.getElementById('detail-card');
    const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';
    const castNames = cast.slice(0, 3).map(member => member.name).join(', ') || '-';
    const genres = movie.genres.slice(0, 3).map(g => g.name).join(', ') || '-';
    
    detailCard.innerHTML = `
        <div class="detail-poster">
            <img src="${POSTER_BASE_URL}${movie.poster_path}" alt="${movie.title} Poster">
            <button class="back-btn" onclick="window.history.back()">
                <span class="material-symbols-outlined">chevron_left</span>
            </button>
        </div>
        <div class="detail-content">
            <h2 class="detail-title">${movie.title}</h2>
            <hr>
            <p><strong>Genre:</strong> ${genres}</p>
            <p><strong>Durasi:</strong> ${movie.runtime} Menit</p>
            <p><strong>Tanggal Rilis:</strong> ${releaseDate}</p>
            <p><strong>Pemeran:</strong> ${castNames}</p>
            <h3 class="sinopsis-title">Sinopsis:</h3>
            <p class="sinopsis-text">${movie.overview || 'Sinopsis tidak tersedia.'}</p>
            <button class="buy-ticket-btn">Beli Tiket</button>
        </div>
    `;
    document.title = movie.title + " | CinePocket";
}


async function fetchAndRenderDetails() {
    const movieId = getMovieIdFromUrl();
    if (!movieId) {
        document.getElementById('movie-detail-container').innerHTML = '<p>Film ID tidak ditemukan.</p>';
        return;
    }

    try {
        const detailResponse = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?language=id-ID`, options);
        const detailData = await detailResponse.json();
        const creditResponse = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?language=id-ID`, options);
        const creditData = await creditResponse.json();
        
        renderMovieDetail(detailData, creditData.cast || []);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        document.getElementById('detail-card').innerHTML = '<p>Gagal memuat detail film. Coba periksa koneksi atau ID film.</p>';
    }
}


document.addEventListener('DOMContentLoaded', fetchAndRenderDetails);