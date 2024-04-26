//This reacts to any part that involves enter_nickname.ejs and opens it successfully
const handleSuccess = (event) => {
    console.log("Opened..")// USED FOR TESTING
    checkIfEmpty() //This checks if there is a nickname

    //The Listeners:
    // submit_userName is for the nickname login page
    // fillUserNickname is for the create post page
    document.getElementById("submit_userNickname").addEventListener("click", addNickname)
    document.getElementById("fillUserNickname").addEventListener("click",fillUserNicknameBox)
}

//This is what is needed to initialise the indexedDB objects in the database
const handleUpgrade = (ev) => {
    const db = ev.target.result
    let store = db.createObjectStore('users', {keyPath: "id",autoIncrement : false}) //Creates the object key
    console.log("Upgraded object store...") // USED FOR TESTING
}

//Does as the name implies, it adds a nickname to the data
function addNickname() {
    const db = userIndexedDB.result
    let nickname = document.getElementById("nickname_textbox").value //The data from textbox
    const action = db.transaction('users', 'readwrite') //states what action is going to happen to what objects
    const store = action.objectStore('users')
    if (nickname !== "") {
        let query = store.add({id:1,nickname: nickname}) //adds the nickname to the database with id of 1
        query.onsuccess = function (event) {
            checkIfEmpty() //Checks if the database is empty, if not then it will let the page content be available to the user
            query.onerror = function (event) {
                console.log(event.target.errorCode) //Produces an error if one occurs
            }
        }
    }
}

    //Its a function that retrieves the nickname of the user and returns it if it is defined
function getNickname(){
    return new Promise((resolve,reject) => {
        let id = 1 //location of where the object containing the nickname is stored
        const db = userIndexedDB.result
        const action = db.transaction('users', 'readonly')
        const store = action.objectStore('users')
        let value = store.get(id) //This is the object of where it is stored
        value.onsuccess = function (event) {
            var result = event.target.result
            if (typeof result !== 'undefined') {
                resolve(result['nickname'])
            } else {
                console.log("No Key found")
                reject(undefined)
            }
        }
        value.onerror = function (event) {
            console.log("Error")
            reject(undefined)
        }
    })
}

    //This is the function used to show or hide content based on whether there is a user nickname
function checkIfEmpty() {
    getNickname().then((value) => {
        document.getElementById('EnterNickname').style.display = "none";
        document.getElementById('checkNickname').style.display = "block";
        console.log(value)
    }).catch((undefined) =>{
        console.log(undefined)
    })
}
    //This function fills in the user nickname on the create page
function fillUserNicknameBox(){
    getNickname().then((nickname) =>{
        document.getElementById('userNickname').value = nickname
    }).catch((err) =>{
        console.log("Cannot fill - Please a new one")
        document.getElementById('userNickname').value = "Enter A New Nickname"
    })
}
const handleError=() => {
    console.error(`Database Error:`)
}
const userIndexedDB = window.indexedDB.open('userdatabase')
userIndexedDB.addEventListener("upgradeneeded", handleUpgrade)
userIndexedDB.addEventListener("success", handleSuccess)
userIndexedDB.addEventListener("error", handleError)