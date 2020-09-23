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

myLibrary.forEach(book => {
    const readBooks = document.querySelector(book.read ? '#readbooks' : '#unreadbooks');
    const newBookItem = document.createElement('li');
    newBookItem.innerText = book.info();
    readBooks.appendChild(newBookItem);
});

// Event logic
newBookButton = document.querySelector("#new-book");
newBookButton.addEventListener('click', newBookButtonHandler);

function newBookButtonHandler(e) {
    newBookForm = document.querySelector("#add-new-book");
    console.log(newBookForm.style.display);
    if (newBookForm.style.display == "none" || newBookForm.style.display == "") {
        newBookForm.style.display = "block";
    }
    else {
        newBookForm.style.display = "none";
    }
}