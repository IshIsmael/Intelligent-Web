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

socket.on('message', arg => {
  const currentTime = new Date().toLocaleDateString('en-uk', {
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
