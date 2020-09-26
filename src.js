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

function addBookToLibrary(book) {
    myLibrary.push(book);
}

// adding a few books for testing purposes...
addBookToLibrary(new Book("Catcher in the Rye", "Some Guy", 200, 0.8, true));
addBookToLibrary(new Book("50 Shades of Grey", "Some Woman", 250, 0.0, false));
addBookToLibrary(new Book("Cannery Row", "John Steinbeck", 220, 0.9, true));

console.table(myLibrary);

function updateBooks(book, bookInd) {
    const bookList = document.getElementById('book-list');
    const newBookItem = document.createElement('li');
    newBookItem.innerText = book.info();

    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', deleteBookBtnHandler);
    deleteButton.innerText = 'x';
    deleteButton.style.color = 'red';
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

    /*myLibrary.filter(book => read ? book.read : !book.read)
             .forEach(book => {
                updateBooks(book);
             });
    */
}

refreshLibrary(readView);

// Event logic
newBookButton = document.querySelector("#new-book");
newBookButton.addEventListener('click', newBookButtonHandler);

readBooksButton = document.querySelector("#read-books-btn");
readBooksButton.addEventListener('click', readBooksButtonHandler);

unreadBooksButton = document.querySelector("#unread-books-btn");
unreadBooksButton.addEventListener('click', unreadBooksButtonHandler);

newBookForm = document.querySelector("#new-book-form");
newBookForm.addEventListener('submit', newBookSubmitHandler);

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