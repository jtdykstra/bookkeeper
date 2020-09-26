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

function addBookToLibrary(book) {
    myLibrary.push(book);
}

// adding a few books for testing purposes...
addBookToLibrary(new Book("Catcher in the Rye", "Some Guy", 200, 0.8, true));
addBookToLibrary(new Book("50 Shades of Grey", "Some Woman", 250, 0.0, false));
addBookToLibrary(new Book("Cannery Row", "John Steinbeck", 220, 0.9, true));

console.table(myLibrary);

function updateBooks(book) {
    const selector = ((book.read) ? '#readbooks' : '#unreadbooks');
    const readBooks = document.querySelector(selector);
    const newBookItem = document.createElement('li');
    newBookItem.innerText = book.info();
    readBooks.appendChild(newBookItem);
}

function refreshLibrary() {
    myLibrary.forEach(book => {
        updateBooks(book);
    });
}

refreshLibrary();

// Event logic
newBookButton = document.querySelector("#new-book");
newBookButton.addEventListener('click', newBookButtonHandler);

newBookForm = document.querySelector("#new-book-form");
newBookForm.addEventListener('submit', newBookSubmitHandler);

function newBookSubmitHandler(e) {
    console.log("WOO");
    console.log(e);
    console.log(e.target.elements.title.value);
    console.log(e.target.elements.author.value);
    console.log(e.target.elements.pages.value);
    console.log(e.target.elements.rating.value);
    console.log(e.target.elements.read.value);

    newBook = new Book(e.target.elements.title.value,
                       e.target.elements.author.value,
                       Number(e.target.elements.pages.value),
                       Number(e.target.elements.rating.value),
                       e.target.elements.read.value === 'true' ? true : false);
    addBookToLibrary(newBook);
    updateBooks(newBook);

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