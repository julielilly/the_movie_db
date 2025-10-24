import { AUTH_KEY } from './config.js'

const navLinks = document.querySelectorAll('nav li a');
const wait = document.querySelector('#wait');
const movieList = document.querySelector('#movie-list');
const template = document.querySelector('#movie-template');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        navLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active')
        
        getMovies(link.dataset.cat);
    });
});

const getMovies = async (category) => {
    wait.classList.remove('hidden'); //add placeholder
    wait.querySelector('p').textContent = "Please wait..";
    document.querySelector('#movie-list').innerHTML = ""; //remove old movies

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: AUTH_KEY
        }
    };

    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`, options);
        const data = await response.json();
        renderMovies(data.results)

    } catch(err) {
        console.error(err);
        wait.querySelector('p').textContent = "Failed to load movies.";

    }
}

const renderMovies = (movies) => {
    const imgBase = "https://image.tmdb.org/t/p/w500";
    const fragment = document.createDocumentFragment();

    movies.forEach(movie => {
        const clone = template.content.cloneNode(true);

        clone.querySelector('h2').textContent = movie.title;
        clone.querySelector('.description').textContent = movie.overview;
        clone.querySelector('.original_title').textContent = movie.original_title;
        clone.querySelector('.release-date').textContent = movie.release_date;
        
        const image = clone.querySelector('img');
        image.src = imgBase + movie.poster_path;
        image.alt = `Poster for ${movie.title}`;
        
        fragment.append(clone);
    });
   
    movieList.append(fragment)
    wait.classList.add('hidden'); //remove placeholder
}

getMovies("now_playing");