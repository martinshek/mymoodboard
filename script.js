const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


// Unsplash API
const count = 18;
// Normally, don't store API Keys like this.
const apiKey = 'KAbgX7_B4dtYsUYiIQ8rcxpduU7K9L4kziWKpblmKFk';
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};


function showContent(page) {
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
  if (page === 'results') {
    resultsNav.classList.remove('hidden');
    favouritesNav.classList.add('hidden');
    footerNav.classList.remove('hidden');

  } else {
    resultsNav.classList.add('hidden');
    favouritesNav.classList.remove('hidden');
    footerNav.classList.add('hidden');
  }
  loader.classList.add('hidden');
}

function createDOMNodes(page) {
  const currentArray = page === 'results' ? resultsArray : Object.values(favourites);
  currentArray.forEach((result) => {
    // Card Container
    const card = document.createElement('div');
    card.classList.add('card');
    // link
    const link = document.createElement('a');
    link.href = result.links.html;
    link.target = '_blank';

    //Images
    const image = document.createElement('img');
    image.src = result.urls.regular;
    image.alt = 'Image';
    image.loading = 'lazy';
    image.classList.add('card-img-top');
    //Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    // Save Text
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if (page === 'results') {
      saveText.innerHTML = '<i class="fa-solid fa-bookmark fa-lg" title="Save To Moodboard"></i>';
      saveText.setAttribute('onclick', `saveFavourite('${result.urls.regular}')`);
    } else {
      saveText.innerHTML = '<i class="fa-solid fa-square-xmark fa-lg" title="Remove From Moodboard"></i>';
      saveText.setAttribute('onclick', `removeFavourite('${result.urls.regular}')`);
    }

    // Append
    cardBody.append(saveText);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  // Get Favourites from localStorage
  if (localStorage.getItem('unsplashFavourites')) {
    favourites = JSON.parse(localStorage.getItem('unsplashFavourites'));
  }
  imagesContainer.textContent = '';
  createDOMNodes(page);
  showContent(page);
}

//  Get 10 Images from Unsplash API
async function getUnplashPictures() {
  // Show loader
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM('results');
  } catch (error) {
    // Catch Error Here
  }
}

// Add result to Favourites
function saveFavourite(itemUrl) {
  // Loop through Reuslts Array to select Favourite
  resultsArray.forEach((item) => {
    if (item.urls.regular.includes(itemUrl) && !favourites[itemUrl]) {
      favourites[itemUrl] = item;
      // Show Save Confirmation for 2 Seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Set Favourites in localStorage
      localStorage.setItem('unsplashFavourites', JSON.stringify(favourites));
    }
  });
}

// Remove item from Favourites
function removeFavourite(itemUrl) {
  if (favourites[itemUrl]) {
    delete favourites[itemUrl];
    // Set Favourites in localStorage
    localStorage.setItem('unsplashFavourites', JSON.stringify(favourites));
    updateDOM('favourites');
  }
}


// On Load
getUnplashPictures();
