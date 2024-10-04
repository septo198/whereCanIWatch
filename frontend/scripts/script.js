function loadImageWithFallback(imageElement, imageUrl) {
    imageElement.src = imageUrl;

    imageElement.onerror = function() {
        imageElement.src = 'images//imagenotfound.jpg'; 
    };
}

async function getStreamingInfo(filmName, countryCode) {
    const response = await fetch('/api/get-streaming-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ film_name: filmName, country_code: countryCode })
    });

    if (response.ok) {
        const data = await response.json();
        const parsedData = parseData(data);
        displayResults(parsedData);
    } else {
        console.error('Error fetching streaming information');
    }
}

function parseData(data){
    const parsedData = []

    if (data != null){
        data.forEach(movie =>{
            const movieData = {
                name: movie.name,
                locations: movie.locations.map(location => ({
                    display_name: location.display_name,
                    icon: location.icon,
                    url: location.url
                })),
                image: movie.picture
            };
            parsedData.push(movieData);
        });
    };
    return parsedData;   
}

function displayResults(parsedData) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';  

    parsedData.forEach(movie => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        const img = document.createElement('img');
        loadImageWithFallback(img, movie.image);
        img.alt = movie.name;

        const title = document.createElement('div');
        title.classList.add('card-title');
        title.textContent = movie.name;

        cardDiv.appendChild(img);
        cardDiv.appendChild(title);

        cardDiv.addEventListener('click', () => expandCard(movie));

        resultsDiv.appendChild(cardDiv);
    });
}

function expandCard(movie) {
    const expandedCardBackground = document.getElementById('expandedCardBackground');
    const expandedCard = document.getElementById('expandedCard');
    const expandedImage = document.getElementById('expandedImage');
    const expandedTitle = document.getElementById('expandedTitle');
    const expandedContent = document.getElementById('expandedContent');

    loadImageWithFallback(expandedImage, movie.image);
    expandedTitle.textContent = movie.name;
    expandedContent.innerHTML = '';  

    movie.locations.forEach(location => {
        const locationIcon = document.createElement('img');
        locationIcon.src = location.icon;
        locationIcon.style.height = '1em';
        locationIcon.style.verticalAlign = 'middle';

        const locationItem = document.createElement('a');
        locationItem.href = location.url;
        locationItem.textContent = `Watch on ${location.display_name}`;
        locationItem.target = '_blank';

        const container = document.createElement('span');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'flex-start';

        container.appendChild(locationIcon);
        container.appendChild(locationItem);

        expandedContent.appendChild(container);
    });

    expandedCardBackground.style.display = 'flex'; 
}



// Close the expanded card when clicking outside of it
document.getElementById('expandedCardBackground').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

// Close the expanded card when clicking outside of it
document.getElementById('expandedCard').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

document.getElementById('submit').addEventListener('click', () => {
    const filmName = document.getElementById('filmNameInput').value;
    const countryCode = document.getElementById('countrySelect').value;
    getStreamingInfo(filmName, countryCode);
});

document.addEventListener('DOMContentLoaded', () => {
const dropdown = document.getElementById('countrySelect');
const trigger = dropdown.querySelector('.dropdown-trigger');
const items = dropdown.querySelectorAll('.dropdown-item');
const selectedCountry = document.getElementById('selectedCountry');

// Toggle dropdown
trigger.addEventListener('click', () => {
    dropdown.classList.toggle('is-active');
});

// Handle dropdown item selection
items.forEach(item => {
    item.addEventListener('click', (e) => {
    e.preventDefault();
    const value = item.getAttribute('data-value');
    const text = item.textContent;

    // Update the displayed text
    selectedCountry.textContent = text;

    // Close the dropdown
    dropdown.classList.remove('is-active');
    });
});

// Close dropdown if clicked outside
document.addEventListener('click', function(event) {
    const isClickInside = dropdown.contains(event.target);
    if (!isClickInside) {
    dropdown.classList.remove('is-active');
    }
});
});

const text = "Where can I watch it?";
const speed = 60; 

function typeWriter(text, i) {
    if (i < text.length) {
        document.getElementById("typewriter").innerHTML += text.charAt(i);
        i++;
        setTimeout(function() {
            typeWriter(text, i);
        }, speed);
    } else {
        // Stop the caret blink after typing is complete
        document.getElementById("typewriter").style.borderRight = "none";
    }
}

window.onload = function() {
    typeWriter(text, 0);
};
