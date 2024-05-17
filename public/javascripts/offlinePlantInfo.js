const sightingIndexedDB = window.indexedDB.open('sightings');
const form = document.querySelector('.comments-form');
const input = document.querySelector('.commentsInput');
const messageBox = document.querySelector('.messageBox');
const switcher = document.querySelector('.chat-switch');
const image = document.querySelector('.image');
const comments = document.querySelector('.comments');

let dbentry;

window.addEventListener('online', () => {
  window.location.href = '/forum';
});

sightingIndexedDB.onsuccess = event => {
  const db = event.target.result;

  const objectStore = db
    .transaction('sightings', 'readwrite')
    .objectStore('sightings');

  const request = objectStore.getAll();

  request.onsuccess = () => {
    dbentry = request.result.filter(
      obj => obj.id === +window.location.href.split('/').pop()
    )[0];

    if (!dbentry.comments) {
      dbentry.comments = [];
    }

    displayInfo(dbentry);
  };
};

function displayInfo(information) {
  for (const [key, value] of Object.entries(information)) {
    const element = document.getElementById(`${key}`);

    if (element) {
      console.log(element);
      if (element.classList.contains('details-label')) {
        element.insertAdjacentText('afterend', value);
      } else {
        element.innerText = value;
      }
    }

    console.log(`${key}: ${value}`);
  }

  const coordinates = [information.latitude, information.longitude];

  const map = L.map('map').setView(coordinates, 13);

  // Adding Tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  // Marker
  L.marker(coordinates).addTo(map);

  information.comments.forEach(obj => insertHTMLMessage(obj));
}

form.addEventListener('submit', e => {
  e.preventDefault();
  e.stopImmediatePropagation();

  const messageObj = {
    message: input.value,
    date: new Date(),
    userNickname,
  };

  if (input.value === '') return;

  insertHTMLMessage(messageObj);
  dbentry.comments.push(messageObj);

  const db = sightingIndexedDB.result;

  const objectStore = db
    .transaction('sightings', 'readwrite')
    .objectStore('sightings');

  objectStore.put(dbentry);

  input.value = '';
});

const insertHTMLMessage = function (messageObj) {
  const { message, userNickname, date } = messageObj;

  console.log(messageObj);

  const currentTime = new Date(date).toLocaleDateString('en-uk', {
    minute: 'numeric',
    hour: 'numeric',
    second: 'numeric',
  });

  const messageHTML = `<div class='message'> <div> <strong> ${userNickname}: </strong> ${message} </div> 
    <div> ${currentTime} </div> </div> `;

  messageBox.insertAdjacentHTML('beforeend', messageHTML);
  messageBox.scrollTo(0, messageBox.scrollHeight);
};

switcher.addEventListener('click', () => {
  image.classList.toggle('hidden');
  comments.classList.toggle('hidden');
});
