//////////// Imports
const form = document.querySelector('.comments-form');
const input = document.querySelector('.commentsInput');
const messageBox = document.querySelector('.messageBox');
const editButton = document.getElementById('editButton');
const switcher = document.querySelector('.chat-switch');
const image = document.querySelector('.image');
const comments = document.querySelector('.comments');

//////////// Map Code
const coordinates = [
  plantInformation.location.coordinates[1],
  plantInformation.location.coordinates[0],
];

const map = L.map('map').setView(coordinates, 13);

// Adding Tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

// Marker
const marker = L.marker(coordinates).addTo(map);

//////////// Comments Code
const socket = io('http://localhost:3000/', {
  path: '/plant-info/*',
});

let userNickname;

socket.emit('joinRoom', plantInformation._id);

messageBox.scrollTo(0, messageBox.scrollHeight);

const messagesDB = window.indexedDB.open('messages');

messagesDB.onerror = event => {
  console.log(event.target.errorCode);
};

// create message indexedDB
messagesDB.onupgradeneeded = event => {
  const db = event.target.result;

  const objectStore = db.createObjectStore('messages', { keyPath: 'id' });
};

// submit a message
form.addEventListener('submit', e => {
  e.preventDefault();
  e.stopImmediatePropagation();

  const messageObj = {
    message: input.value,
    date: new Date(),
    userNickname,
  };

  if (input.value === '') return;

  const objectStore = messagesDB.result
    .transaction('messages', 'readwrite')
    .objectStore('messages');

  const request = objectStore.get(plantInformation._id);

  request.onsuccess = event => {
    const obj = event.target.result;

    if (obj) {
      obj.messages.push(messageObj);
      objectStore.put(obj);
    } else {
      objectStore.add({ id: plantInformation._id, messages: [messageObj] });
    }

    input.value = '';
    socket.emit('message', messageObj);
    insertHTMLMessage(messageObj);

    syncMessagesLater();
  };
});

// sync messages saved in indexedDB once connected to the internet
async function syncMessagesLater() {
  const registration = await navigator.serviceWorker.ready;
  try {
    await registration.sync.register('sync-messages');
  } catch {
    console.log('Background Sync could not be registered!');
  }
}

// post message onto the plant-info page
const insertHTMLMessage = function (messageObj) {
  const { message, userNickname, date } = messageObj;

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

// send message across socket.io
socket.on('message', arg => {
  if (
    !(
      messageBox.lastElementChild.firstElementChild.innerText ===
      `${arg.userNickname}: ${arg.message}`
    )
  ) {
    insertHTMLMessage(arg);
  }
});

//////////// Edit Button
if (editButton) {
  editButton.addEventListener('click', () => {
    window.location.href = `/edit-plant-sighting/${plantInformation._id}`;
  });
}

//////////// Switch between chat and Image
switcher.addEventListener('click', () => {
  image.classList.toggle('hidden');
  comments.classList.toggle('hidden');
});
