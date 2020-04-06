import React from 'react'
import './App.css'
import { dropRight } from 'lodash';
import BookShelf from './BookShelf'
import * as BooksAPI from './BooksAPI'
import { Route, Switch } from 'react-router-dom'
import SearchBooks from './SearchBooks' 

class BooksApp extends React.Component {
  state = {
    books: []    //hold all books
  }

  //load initial BookShelves..if failed? if too many books
  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        this.setState({books: books });
    }).catch((reason) => {
      if(reason === -999) {
        console.error("Had previously handled error");
      }
      else {
        console.error(`Trouble with api getAll(): ${reason}`);
      }
     });
  }
  
  onShelfChange = (book, bookshelf) =>  {
    book.shelf = bookshelf;
    BooksAPI.update(book, bookshelf).then(
      bs=> {
        //update via API and refresh the UI via setState()
        let books = [...this.state.books];
        //if book is added (not just moved from different shelf on main page), we need add the book to collection
        // but if the book is already on "Read"shelf and then from search,  I Move to "WantRead"...
        // We only change the book's shelf...so the book (all the rest like id, title ect ) did not change... it did not refresh the page 
        // This is due to the fact you are changing the books in tate directly via  let books = this.state.books instead of spread  to create new array!
        const idx = books.findIndex(x=>x.id===book.id);
        if (idx>=0){ 
          books[idx] = book;
          // setState does not working properly when you go back to main page... shallow comparison??
          // let's try to remove it firs and add back to trigger refresh
          //books.splice(idx,1);
         // books.push(book);
        }
        else{ 
          books.push(book);
        }
        //setState is asynch.....print in callback function will reveal the changes
         this.setState({books:books});
      }
    )
 } 

  render() {
    const bookshelves = dropRight(window.$bookShelfList );
    const allbooks = this.state.books;

    return (
      <div className="app">
        <Switch>
          <Route exact path='/search' render={({ history }) => (
            <SearchBooks  
              onShelfChange={this.onShelfChange}  
              booksOnShelf = {this.state.books}
            >
            </SearchBooks> 
          )}/>  
        <Route exeact path='/' render={({ history }) => (
                <div className="list-books">
                  <div className="list-books-title">
                    <h1>MyReads</h1>
                  </div>
                  <div className="list-books-content">
                    <div>
                    { bookshelves.map( (bookshelf) =>(
                            <BookShelf
                                key={bookshelf.id}
                                shelfname = {bookshelf.name}
                                booksOnShelf={this.state.books.filter(book =>book.shelf === bookshelf.id )}
                                onShelfChange={this.onShelfChange}
                            >
                            </BookShelf>
                      )
                    )}
                  </div>
                </div>
              <div className="open-search">
                <button onClick={() => history.push("/search")}>Add a book</button>
              </div>
            </div>
            )}/>
        </Switch>
      </div>
    )
  }
}

export default BooksApp
