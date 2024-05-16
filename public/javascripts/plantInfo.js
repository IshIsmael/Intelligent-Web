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

messagesDB.onupgradeneeded = event => {
  const db = event.target.result;

  const objectStore = db.createObjectStore('messages', { keyPath: 'id' });
};

form.addEventListener('submit', e => {
  e.preventDefault();
  e.stopImmediatePropagation();

  const messageObj = {
    message: input.value,
    date: new Date(),
    userNickname,
  };

  if (input.value === '') return;

  if (navigator.onLine) {
    insertMongoMessage(messageObj);
    input.value = '';
  } else {
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
      insertHTMLMessage(messageObj);
    };
  }
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

const insertMongoMessage = async function (messageObj) {
  try {
    const url = '/newMessage';
    const options = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: plantInformation._id,
        ...messageObj,
      }),
    };

    socket.emit('message', messageObj);
    await fetch(url, options);
  } catch (err) {
    console.log(err);
  }
};

const syncMessages = function () {
  socket.emit('joinRoom', plantInformation._id);

  const objectStore = messagesDB.result
    .transaction('messages', 'readwrite')
    .objectStore('messages');

  const request = objectStore.getAll();

  request.onsuccess = () => {
    request.result.forEach(obj => {
      obj.messages.forEach(messageObj => {
        insertMongoMessage(messageObj);
      });

      objectStore.delete(obj.id);
    });
    location.reload();
  };
};

socket.on('message', arg => {
  insertHTMLMessage(arg);
});

window.addEventListener('online', syncMessages);

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
