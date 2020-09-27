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
}

const myLibrary = [];
let readView = false; // false to show unread books, true to show read

/* helper functions */

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function updateBooks(book, bookInd) {
    const bookList = document.getElementById('book-list');
    const newBookItem = document.createElement('li');
    newBookItem.innerText = book.info();

    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', deleteBookBtnHandler);
    deleteButton.innerText = 'x';
    deleteButton.setAttribute('data-ind', bookInd);
    newBookItem.appendChild(deleteButton);

    const readButton = document.createElement('button');
    readButton.addEventListener('click', readBookButtonHandler);
    readButton.innerText = 'read';
    readButton.setAttribute('data-ind', bookInd);
    newBookItem.appendChild(readButton);

    bookList.appendChild(newBookItem);
}

function refreshLibrary(read) {
    // remove all items from the list
    // todo: this can probably be more efficient
    bookList = document.getElementById('book-list');
    while(bookList.firstChild) {
        bookList.removeChild(bookList.lastChild);
    }
    
    // now add all of the books back
    for (let bookInd = 0; bookInd < myLibrary.length; ++bookInd) {
        if (myLibrary[bookInd].read === read) {
            updateBooks(myLibrary[bookInd], bookInd);
        }
    }
}

// load the initial library data
refreshLibrary(readView);

/* set up event logic */

newBookButton = document.querySelector("#new-book");
newBookButton.addEventListener('click', newBookButtonHandler);

readBooksButton = document.querySelector("#read-books-btn");
readBooksButton.addEventListener('click', readBooksButtonHandler);

unreadBooksButton = document.querySelector("#unread-books-btn");
unreadBooksButton.addEventListener('click', unreadBooksButtonHandler);

newBookForm = document.querySelector("#new-book-form");
newBookForm.addEventListener('submit', newBookSubmitHandler);

/* event handlers */

function newBookSubmitHandler(e) {
    newBook = new Book(e.target.elements.title.value,
                       e.target.elements.author.value,
                       Number(e.target.elements.pages.value),
                       Number(e.target.elements.rating.value),
                       e.target.elements.read.value === 'true' ? true : false);
    addBookToLibrary(newBook);
    refreshLibrary(readView);

    e.preventDefault();
}

function newBookButtonHandler(e) {
    newBookForm = document.querySelector("#add-new-book");
    if (newBookForm.style.display === "none" || newBookForm.style.display === "") {
        newBookForm.style.display = "block";
    }
    else {
        newBookForm.style.display = "none";
    }
}

function readBooksButtonHandler(e) {
    refreshLibrary(true);
    readView = true;
}

function unreadBooksButtonHandler(e) {
    refreshLibrary(false);
    readView = false;
}

function deleteBookBtnHandler(e) {
    console.log(e);
    console.log(e.target.getAttribute('data-ind'));
    bookInd = e.target.getAttribute('data-ind');
    myLibrary.splice(Number(bookInd),1);
    refreshLibrary(readView);
}

function readBookButtonHandler(e) {
   bookInd = Number(e.target.getAttribute('data-ind'));
   myLibrary[bookInd].read = !myLibrary[bookInd].read;
   refreshLibrary(readView);
}