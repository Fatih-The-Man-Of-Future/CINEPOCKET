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


let popularSwiper;

// DOM POPULAR SECTION
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
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                    dynamicBullets: true,
                },
                breakpoints: {
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
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
                // ⬇️ PANGGIL FUNGSI createTrendingCard
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
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPopularMovies();
    fetchTrendingMovies();
    addScrollBtn();
});