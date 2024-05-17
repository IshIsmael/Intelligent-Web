//This reacts to any part that involves enter_nickname.ejs and opens it successfully
document
  .getElementById('submit_userNickname')
  .addEventListener('click', addNickname);

if (window.location.href.includes('create')) {
  document
    .getElementById('fillUserNickname')
    .addEventListener('click', fillUserNicknameBox);
}

//Checks if a nickname has already been entered
// if not then asks user to create nickname
const handleSuccess = event => {
  checkIfEmpty(); //This checks if there is a nickname
  //The code below checks whether the current page is the plant-info page and then compares the current nickname to
  // the content creator's nickname
  if (window.location.href.includes('plant-info')) {
    const contentCreator = document.getElementById('CreatorNickname').getAttribute('value')
    compareUserToNickname(contentCreator)
  }
};

//This is what is needed to initialise the indexedDB objects in the database
const handleUpgrade = ev => {
  const db = ev.target.result;
  let store = db.createObjectStore('users', {
    keyPath: 'id',
    autoIncrement: false,
  }); //Creates the object key
  console.log('Upgraded object store...'); // USED FOR TESTING
};

//Does as the name implies, it adds a nickname to the data
function addNickname(e) {
  e.preventDefault();

  const db = userIndexedDB.result;
  let nickname = document.getElementById('nickname_textbox').value; //The data from textbox
  const action = db.transaction('users', 'readwrite'); //states what action is going to happen to what objects
  const store = action.objectStore('users');
  if (nickname !== '') {
    let query = store.add({ id: 1, nickname: nickname }); //adds the nickname to the database with id of 1
    query.onsuccess = function (event) {
      checkIfEmpty(); //Checks if the database is empty, if not then it will let the page content be available to the user
      query.onerror = function (event) {
        console.log(event.target.errorCode); //Produces an error if one occurs
      };
    };
  }
}

//Its a function that retrieves the nickname of the user and returns it if it is defined
function getNickname() {
  return new Promise((resolve, reject) => {
    let id = 1; //location of where the object containing the nickname is stored
    const db = userIndexedDB.result;
    const action = db.transaction('users', 'readonly');
    const store = action.objectStore('users');
    let value = store.get(id); //This is the object of where it is stored
    value.onsuccess = function (event) {
      var result = event.target.result;
      if (typeof result !== 'undefined') {
        resolve(result['nickname']);
      } else {
        console.log('No Key found');
        reject(undefined);
      }
    };
    value.onerror = function (event) {
      console.log('Error');
      reject(undefined);
    };
  });
}
//The function below is used to hide and show the edit button on the plant-info page depending on whether the user's
//Nickname matches the plant's userNickname that created the post
function compareUserToNickname(PNickname) {
  try {
    let id = 1; //location of where the object containing the nickname is stored
    const db = userIndexedDB.result;
    const action = db.transaction('users', 'readonly');
    const store = action.objectStore('users');
    let value = store.get(id); //This is the object of where it is stored
    value.onsuccess = function (event) {
      var result = event.target.result.nickname
      if (result === PNickname) {
        document.getElementById('editButton').classList.remove('hidden') //reveals the edit button
      }
    }
    value.onerror = function (event) {
      console.log("ERROR")
    };
  }catch(e){
    console.log("ERROR:" + e)
  }
}

//This is the function used to show or hide content based on whether there is a user nickname
function checkIfEmpty() {
  getNickname()
    .then(value => {
      document.getElementById('EnterNickname').classList.add('hidden');
      document.querySelector('.checkNickname').classList.remove('hidden');
      // console.log(value);
      userNickname = value;
    })
    .catch(undefined => {
      document.getElementById('EnterNickname').classList.remove('hidden');
      document.querySelector('.checkNickname').classList.add('hidden');

      // console.log(undefined);
    });
}
//This function fills in the user nickname on the create page
function fillUserNicknameBox() {
  getNickname()
    .then(nickname => {
      document.getElementById('userNickname').value = nickname;
    })
    .catch(err => {
      console.log('Cannot fill - Please a new one');
      document.getElementById('userNickname').value = 'Enter A New Nickname';
    });
}
//This handles the errors
const handleError = () => {
  console.error(`Database Error:`);
};

//These are event listeners that activate when certain events occur
const userIndexedDB = window.indexedDB.open('userdatabase');
userIndexedDB.addEventListener('upgradeneeded', handleUpgrade);
userIndexedDB.addEventListener('success', handleSuccess);
userIndexedDB.addEventListener('error', handleError);
