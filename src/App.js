import React from 'react'
import './App.css'
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
    //update via API and refresh the UI via setState()
    let books = this.state.books;
    //let bookshelves = this.state.bookshelves;
    book.shelf = bookshelf;
  
    BooksAPI.update(book, bookshelf).then(
      bs=> {
        //if book is added (not just moved from different shelf on main page), we need add the book to collection
        // but if the book is already on "Read"shelf...but from search I Move to "WantRead"...
        // We only change the book's shelf..so the books (all the rest like id, title ect ) did not change... it did not refresh the page 
        // we need force GUI to refresh!  
        if (books.find(x=>x.id===book.id)){ 
          // books[book.id] = book;
          // books[book.id].shelf=bookshelf;
          // setState does not working properly when you go back to main page... shallow comparison??
          // let's try to remove it firs and add back to trigger 
          const idx = books.findIndex(x=>x.id===book.id);
          books.splice(idx,1);
          books.push(book);
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
    const bookshelves =  window.$bookShelfList 
    const allbooks = this.state.books;

    return (
      <div className="app">
        <Switch>
          <Route exact path='/search' render={({ history }) => (
            <SearchBooks  
              onShelfChange={this.onShelfChange}  
              booksOnShelf = {allbooks}
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
                    { bookshelves.map( (bs) =>(
                            <BookShelf
                                key={bs.id}
                                shelfname={bs.name}
                                booksOnShelf={allbooks.filter(book =>book.shelf === bs.id)}
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
