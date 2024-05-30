const API_KEY = 'B3Z3TBnB5ZOCQWplR9kXVXYZJK0W7QKY4xUjMgP1';
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const currentImageContainer = document.getElementById('current-image-container');
const searchHistory = document.getElementById('search-history');

document.addEventListener('DOMContentLoaded', () => {
    getCurrentImageOfTheDay();
    addSearchToHistory();
});
form.addEventListener('submit', getImageOfTheDay);

function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    fetchImage(currentDate);
}

function getImageOfTheDay(event) {
    event.preventDefault();
    const selectedDate = input.value;
    fetchImage(selectedDate);
    saveSearch(selectedDate);
    addSearchToHistory();
}

function fetchImage(date) {
    fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.media_type === "image") {
                currentImageContainer.innerHTML = `
                    <h3>${data.title}</h3>
                    <img src="${data.url}" alt="${data.title}">
                    <p>${data.explanation}</p>
                `;
            } else {
                currentImageContainer.innerHTML = `<p>Media type is not an image.</p>`;
            }
        })
        .catch(error => {
            currentImageContainer.innerHTML = `<p>Failed to fetch image. Error: ${error.message}</p>`;
        });
}

function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

function addSearchToHistory() {
    searchHistory.innerHTML = '';
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.forEach(date => {
        const li = document.createElement('li');
        li.textContent = date;
        li.addEventListener('click', () => fetchImage(date));
        searchHistory.appendChild(li);
    });
}
