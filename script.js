const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjFiZGNjYzc4NDY2NDY2NzQ1NTAwZDljY2Q2OTMzNyIsIm5iZiI6MTc2NDA3NjU4Ny41NzUsInN1YiI6IjY5MjVhYzJiMTUyYzRjYzlmNDMwYzdjZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zO76gT2bVa8yjQepdp-kRpRu6gBJg9x_Qa2_AhFsi8k'
    }
};

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280'; 
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500'; 

//mengatur tampilan
function setHomeSectionVisibility(showPopular, showTrending, showSearch) {
    const popularSection = document.querySelector('.container.swiper');
    const trendingSection = document.querySelector('.trending-container');
    const searchSection = document.querySelector('.search-container');
    
    if (popularSection) popularSection.style.display = showPopular ? 'block' : 'none';
    if (trendingSection) trendingSection.style.display = showTrending ? 'block' : 'none';
    if (searchSection) searchSection.style.display = showSearch ? 'block' : 'none';
}

// DOM FOR SEARCH SECTION
function createSearchCard(movie) {
    const imageUrl = movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : 'path/to/placeholder/image.png';
    const title = movie.title || movie.name;

    return `
        <div class="card search-card" onclick="location.href='detail.html?id=${movie.id}'"> 
            <div class="card-image">
                <img src="${imageUrl}" alt="${title} Poster" class="poster-image" />
            </div>
            <div class="card-content">
                <h4 class="card-title">${title}</h4>
            </div>
        </div>
    `;
}

// FETCH FOR SEARCH SECTION
async function searchMovie() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    const searchTitle = document.querySelector('.cons-search h1');
    const searchList = document.querySelector('.search-list');
    

    if (!query) {
        setHomeSectionVisibility(true, true, false);
        addScrollBtn();
        return;
    }
    
    // Tampilkan section Search dan lain
    setHomeSectionVisibility(false, false, true); 
    
    searchTitle.textContent = `Hasil Pencarian untuk: "${query}"`;
    searchList.innerHTML = '<p>Mencari film...</p>';

    const endpoint = `/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;

    try {
        const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, options);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            let htmlContent = '';
            data.results.forEach(movie => {
                htmlContent += createSearchCard(movie); 
            });
            
            searchList.innerHTML = htmlContent;
        } else {
            searchList.innerHTML = `<p >Film "${query}" tidak ditemukan.</p>`;
        }

    } catch (error) {
        console.error('Error fetching search results:', error);
        searchList.innerHTML = '<p >Gagal memuat film yang anda cari. Coba periksa koneksi.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.getElementById('search-input');
    
    searchButton.addEventListener('click', searchMovie);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMovie();
        }
    });
});

// DOM POPULAR SECTION
let popularSwiper;
function createPopularCard(movie) {
    const imageUrl = movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : 'path/to/placeholder/image.png';
    const title = movie.title || movie.name;

    return `
        <div class="card swiper-slide popular-card" >
            <div class="card-image">
                <img src="${imageUrl}" alt="${title} Image" class="backdrop-image" />
            </div>
            <div class="card-content">
                <h3 class="card-title">${title}</h3>
            </div>
        </div>
    `;
}


//  FETCH FOR POPULER SECTION
async function fetchPopularMovies() {
    const popularList = document.querySelector('.card-list.swiper-wrapper');
    const endpoint = '/movie/popular?language=en-US&page=1';
    
    try {
        const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, options);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            let htmlContent = '';
            data.results.slice(0, 10).forEach(movie => { 
                htmlContent += createPopularCard(movie); 
            });
            
            popularList.innerHTML = htmlContent;
            
            if (popularSwiper) {
                popularSwiper.destroy(true, true);
            }
            popularSwiper = new Swiper(".wrapper", {
                loop: false, 
                spaceBetween: 0,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
            });
        } else {
            popularList.innerHTML = '<div class="swiper-slide"><p>Tidak ada film populer yang ditemukan.</p></div>';
        }
        
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        popularList.innerHTML = '<div class="swiper-slide"><p>Gagal memuat film populer. Coba periksa koneksi atau API Key Anda.</p></div>';
    }
}
// DOM FOR TRENDING SECTION
function createTrendingCard(movie) {
    const imageUrl = movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : 'path/to/placeholder/image.png';
    const title = movie.title || movie.name;

    return `
        <div class="card trending-card" onclick="location.href='detail.html?id=${movie.id}'"> 
            <div class="card-image">
                <img src="${imageUrl}" alt="${title} Poster" class="poster-image" />
            </div>
            <div class="card-content">
                <h4 class="card-title">${title}</h4>
            </div>
        </div>
    `;

}

// FETCH FOR TRENDING SECTION
async function fetchTrendingMovies() {
    const trendingList = document.querySelector('.trending-list'); 
    
    const endpoint = '/trending/movie/day?language=en-US'; 
    
    try {
        const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, options);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const trendingMovies = data.results.slice(0, 20); 
            
            let htmlContent = '';
            trendingMovies.forEach(movie => {
                // PANGGIL FUNGSI createTrendingCard
                htmlContent += createTrendingCard(movie); 
            });
            
            trendingList.innerHTML = htmlContent;
        } else {
            trendingList.innerHTML = '<p>Tidak ada film trending yang ditemukan.</p>';
        }

    } catch (error) {
        console.error('Error fetching trending movies:', error);
        trendingList.innerHTML = '<p>Gagal memuat film trending. Coba periksa koneksi atau API Key Anda.</p>';
    }
}

function addScrollBtn() {
    const trendingContainer = document.querySelector('.trending-container');
    const trendingList = document.querySelector('.trending-list'); 
    const searchContainer = document.querySelector('.search-container');
    const searchList = document.querySelector('.search-list'); 

    //scroll trending
    if (!trendingContainer || !trendingList) return;

    const leftBtn = document.createElement('button');
    leftBtn.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';

    leftBtn.className = 'scroll-btn trending-scroll-btn scroll-left'; 
    leftBtn.onclick = () => trendingList.scrollBy({ left: -300, behavior: 'smooth' });

    const rightBtn = document.createElement('button');
    rightBtn.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
    rightBtn.className = 'scroll-btn trending-scroll-btn scroll-right'; 
    rightBtn.onclick = () => trendingList.scrollBy({ left: 300, behavior: 'smooth' });

    trendingContainer.appendChild(leftBtn);
    trendingContainer.appendChild(rightBtn);

    // scroll search
    if (searchContainer && searchList) {
        const searchLeftBtn = document.createElement('button');
        searchLeftBtn.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
        searchLeftBtn.className = 'scroll-btn search-scroll-btn scroll-left'; 
        searchLeftBtn.onclick = () => searchList.scrollBy({ left: -300, behavior: 'smooth' });

        const searchRightBtn = document.createElement('button');
        searchRightBtn.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
        searchRightBtn.className = 'scroll-btn search-scroll-btn scroll-right'; 
        searchRightBtn.onclick = () => searchList.scrollBy({ left: 300, behavior: 'smooth' });

        searchContainer.appendChild(searchLeftBtn);
        searchContainer.appendChild(searchRightBtn);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPopularMovies();
    fetchTrendingMovies();
    addScrollBtn();
});