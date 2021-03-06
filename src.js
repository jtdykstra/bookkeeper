/* data */
class Book {
    constructor(title, author, pages, rating, read) {
        this.title = title;
        this.author = author;
        this.rating = rating;
        this.read = read;
        this.pages = pages;
    }
    
    info() {
        return `${this.title} by ${this.author}, ${this.pages} pages,` + 
               `${this.read ? " read" : " not read"}, rating ${this.rating}`;
    }

    updateContent(field, value)
    {
        switch(field)
        {
            case 'title':
                this.title = value;
                break;
            case 'author':
                this.author = value;
                break;
            case 'rating':
                this.rating = Number(value);
                break;
            case 'read':
                this.read = bool(value);
                break;
            case 'pages':
                this.pages = Number(value);
                break;
            default:
                break;
        }
    }
}

let myLibrary = [];
let readView = false; // false to show unread books, true to show read
let bookUser = null;
let libraryFilter = 'raw';
let loggedIn = false;

/* firebase specific logic */
let database = firebase.database();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        bookUser = user;
        loggedIn = true;
        updateSignedInStatus(true);
        populateUserLibrary();
    } else {
        updateSignedInStatus(false);
        showTopBar(false);
        loggedIn = false;
        bookUser = null;
        loginForm = document.getElementById('Login');
        loginForm.style.display = 'block';
    }
    console.log("auth state change" + bookUser);
 });
 
function populateUserLibrary() {
    database.ref('/users/' + bookUser.uid).once('value').then(function(snapshot) {
        let tempLibrary = (snapshot.val() && snapshot.val().library) || [];
        myLibrary = tempLibrary.map((obj) => 
             new Book(obj.title, obj.author, obj.pages, obj.rating, obj.read)
        );
        refreshLibrary();
        closeViews();
        showTopBar(true);
    });
}

/* helper functions */

function showTopBar(show) {
   topBarItems = document.querySelectorAll('.topbar');
   [...topBarItems].forEach((item) => {
       item.style.display = show ? 'block' : 'none';
   })
}

function updateSignedInStatus(status) {
    //signedInStatus = document.getElementById('sign-in-status');
    //signedInStatus.innerText = status ? 'signed in' : 'signed out';
}

function closeViews() {
    views = document.querySelectorAll('.view');
    [...views].forEach((v) => v.style.display = 'none');
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function updateBooks(book, bookInd) {
    const bookList = document.getElementById('book-list');
    const newBookItem = document.createElement('ul');
    newBookItem.setAttribute('data-ind', bookInd);
    newBookItem.classList.add('book-entry');
    
    const title = document.createElement('li');
    title.innerText = `${book.title}`;
    title.style.fontWeight = 'bold';
    title.style.gridArea = 'title';
    title.style.wordWrap = 'break-word';
    title.style.wordBreak = 'breakAll';
    title.setAttribute('contenteditable', true);
    title.setAttribute('data-type', 'title');
    title.addEventListener('focus', focusEventHandler);
    newBookItem.appendChild(title);

    const author = document.createElement('li');
    author.innerText = `${book.author}`;
    author.style.gridArea = 'author';
    author.setAttribute('contenteditable', true);
    author.setAttribute('data-type', 'author');
    author.addEventListener('focus', focusEventHandler);
    newBookItem.appendChild(author);
    
    const pages = document.createElement('li');
    pages.style.gridArea = 'pages';
    pages.innerHTML =  `<span contenteditable=true data-type="pages" onfocus="focusEventHandler()">\
                            ${book.pages}</span>` + ' pages';
    pages.setAttribute('data-type', 'pages');
    newBookItem.appendChild(pages);

    const rating = document.createElement('li');
    rating.innerHTML = `<span contenteditable=true data-type="rating" onfocus="focusEventHandler()">\
                            ${Number(book.rating)}</span>` + ' stars';
    rating.style.textAlign = 'right';
    rating.style.gridArea = 'rating';
    newBookItem.appendChild(rating);

    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', deleteBookBtnHandler);
    deleteButton.innerText = 'x';
    deleteButton.setAttribute('data-ind', bookInd);
    deleteButton.style.gridArea = 'delete';
    newBookItem.appendChild(deleteButton);

    const readButton = document.createElement('button');
    readButton.addEventListener('click', readBookButtonHandler);
    readButton.innerText = book.read ? 'read' : 'unread';
    readButton.setAttribute('data-ind', bookInd);
    readButton.style.gridArea = 'read';
    readButton.style.margin = '0 0 auto auto';
    newBookItem.appendChild(readButton);

    bookList.appendChild(newBookItem);
}

function filterLibrary()
{
    switch(libraryFilter) {
        case 'raw':
            return myLibrary;
        case 'read':
            return myLibrary.filter(book => book.read); 
        case 'unread':
            return myLibrary.filter(book => !book.read);
        case 'highest rated':
            return [...myLibrary].sort((a, b) => a.rating > b.rating ? -1 : 1);
        default:
            return myLibrary;
    }
}

function refreshLibrary() {
    // remove all items from the list
    // todo: this can probably be more efficient
    bookList = document.getElementById('book-list');
    while(bookList.firstChild) {
        bookList.removeChild(bookList.lastChild);
    }
    
    let modifiedLibrary = filterLibrary();

    // now add all of the books back
    for (let bookInd = 0; bookInd < modifiedLibrary.length; ++bookInd) {
        updateBooks(modifiedLibrary[bookInd], myLibrary.indexOf(modifiedLibrary[bookInd]));
    }
}

// load the initial library data
refreshLibrary();
showTopBar(false);

/* set up event logic */
newBookButton = document.querySelector("#new-book");
newBookButton.addEventListener('click', newBookButtonHandler);

signOutButton = document.getElementById('signout-btn');
signOutButton.addEventListener('click', signoutButtonHandler);

newBookForm = document.querySelector("#new-book-form");
newBookForm.addEventListener('submit', newBookSubmitHandler);

loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', loginFormSubmitHandler);

sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener('change', sortChangeHandler);

bookList = document.getElementById('book-list');
bookList.addEventListener('keypress', contentChangeHandler);
bookList.addEventListener('click', bookClickHandler);

window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

/* event handlers */

// is this need?
function bookClickHandler(e) {
    console.log("book click!");
}

// TODO: Remove me!
function focusEventHandler(e) {
    console.log('input event');
}

function contentChangeHandler(e) {
    console.log(e.key);
    console.log(Number(e.target.parentNode.getAttribute('data-ind')))
    let dataInd = Number(e.target.parentNode.getAttribute('data-ind'));
    let dataType = e.target.getAttribute('data-type');
    
    if (e.key === 'Enter') {
        console.log(dataType);
        console.log(e.target.innerText);
        myLibrary[dataInd].updateContent(dataType, e.target.innerText); 
        e.target.blur();
        e.preventDefault();
        if (bookUser) {
            console.log("submitting content!");
            database.ref('users/' + bookUser.uid).set({
                library: myLibrary
            });
        }
    }
}

function sortChangeHandler(e) {
    libraryFilter = e.target.value;
    refreshLibrary();
}

function signoutButtonHandler(e) {
    firebase.auth().signOut().then(function() {
        console.log("signed out");
      }).catch(function(error) {
        console.log("sign out failed!");
      });
    myLibrary = [];
    refreshLibrary();
}

function loginFormSubmitHandler(e) {
    console.log(e.submitter.value);
    let email = e.target.elements.email.value;
    let password = e.target.elements.password.value;

    if (e.submitter.value === 'login') {
        firebase.auth().signInWithEmailAndPassword(email, password)
        
        .then(() => {
            console.log("login success!");
            document.getElementById('Login').style.display = 'none';
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            
            loginStatus = document.getElementById('login-status');
            loginStatus.innerText = errorMessage;
            loginStatus.style.color = 'red';
            console.log(errorCode);
            console.log(errorMessage);
          });
    }
    else if (e.submitter.value === 'signup') {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            console.log("signup success!");
            document.getElementById('Login').style.display = 'none';
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            loginStatus = document.getElementById('login-status');
            loginStatus.innerText = errorMessage;
            loginStatus.style.color = 'red';
            console.log(errorCode);
            console.log(errorMessage);
          });
    }

    console.log(bookUser);

    e.preventDefault();
}

function newBookSubmitHandler(e) {
    newBook = new Book(e.target.elements.title.value,
                       e.target.elements.author.value,
                       Number(e.target.elements.pages.value),
                       Number(e.target.elements.rating.value),
                       e.target.elements.read.value === 'true' ? true : false);
    addBookToLibrary(newBook);
    refreshLibrary();
    
    if (bookUser)
    {
        database.ref('users/' + bookUser.uid).set({
            library: myLibrary
        });
    }
      
    e.preventDefault();
}

function newBookButtonHandler(e) {
    newBookForm = document.querySelector("#add-new-book");

    if (loggedIn === true && (newBookForm.style.display === "none" || newBookForm.style.display === "")) {
        closeViews();
        newBookForm.style.display = "block";
    }
    else {
        newBookForm.style.display = "none";
    }
}

function deleteBookBtnHandler(e) {
    console.log(e);
    console.log(e.target.getAttribute('data-ind'));
    bookInd = e.target.getAttribute('data-ind');
    myLibrary.splice(Number(bookInd),1);
    if (bookUser)
    {
        database.ref('users/' + bookUser.uid).set({
            library: myLibrary
        });
    }
    refreshLibrary();
}

function readBookButtonHandler(e) {
   bookInd = Number(e.target.getAttribute('data-ind'));
   myLibrary[bookInd].read = !myLibrary[bookInd].read;
   if (bookUser)
   {
        firebase.database().ref('users/' + bookUser.uid).set({
            library: myLibrary
        });
   }
   refreshLibrary();
}