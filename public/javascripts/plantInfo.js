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

socket.emit('joinRoom', plantInformation._id);

messageBox.scrollTo(0, messageBox.scrollHeight);

const newMessage = async function (messageObj) {
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

    await fetch(url, options);
  } catch (err) {
    console.log(err);
  }
};

socket.on('message', arg => {
  const messageTime = new Date();

  const currentTime = messageTime.toLocaleDateString('en-uk', {
    minute: 'numeric',
    hour: 'numeric',
  });

  const messageHTML = `<div class='message'> <div> ${arg} </div> 
  <div> ${currentTime} </div> </div> `;

  messageBox.insertAdjacentHTML('beforeend', messageHTML);
  messageBox.scrollTo(0, messageBox.scrollHeight);
});

form.addEventListener('submit', e => {
  e.preventDefault();

  if (input.value != '') {
    newMessage({
      message: input.value,
      date: new Date(),
      userNickname: 'Luca',
    });
    socket.emit('message', input.value);
    input.value = '';
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
