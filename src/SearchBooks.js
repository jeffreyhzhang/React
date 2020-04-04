import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Book from './Book'
import propTypes from 'prop-types'

class SearchBooks extends Component {
    state = {
        afterSearch: false,
        query: '',
        matchingbooks: []   //hold matching books vis searching
      }
    
    //if no match, it returns error
    //{"books":{"error":"empty query","items":[]}}
    //if paste word in search....nothing???
    updateQuery = (query) => {
   
        this.setState({ query: query.trim() });
        if(query.trim().length<1) {
          this.setState({ matchingbooks: [], afterSearch: false});
          return;
        }
        //odd...why error if no match..just return empty array
        BooksAPI.search(query.trim()).then((books) => {
          if(books.error)  {
            this.setState({ matchingbooks: [], afterSearch:true});
            return;
          }

          //sort books based on rating...may not available
          //books.sort((a,b)=> a.averageRating > b.averageRating?1:-1);

          //keep state....add shelf to searched results if already on shelf
          books.forEach(
            xx => { this.props.booksOnShelf.filter( yy => yy.id ===xx.id).map( zz => xx.shelf = zz.shelf); }
          );
          this.setState({ matchingbooks: books, afterSearch:true});

          //do it directly...if already on shelf, use that book on shelf...not always working....if we just Move the same book to different shelf
          //this.setState({ matchingbooks: books.map( xx => this.props.booksOnShelf[xx.id] ? this.props.booksOnShelf[xx.id]: xx) , afterSearch:true})
        }).catch((reason) => {
          if(reason === -999) {
            console.error("Had previously handled error");
          }
          else {
            console.error(`Trouble with api search(): ${reason}`);
          }
        }) ;
    }
    
    render() {
        let {afterSearch, query, matchingbooks } = this.state;
        return (
          <div className="search-books">
            <div className="search-books-bar">
              <Link
                    to='/'
                    className='close-search '
                >Close
                </Link>

              <div className="search-books-input-wrapper">
                <input 
                    type="text" 
                    placeholder="Search by title or author"
                    value={query}
                    onChange={(event) => this.updateQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                 {
                   matchingbooks.length>0?
                   matchingbooks.map( (bk) => (
                      <li key={bk.id}>
                        <Book book= {bk}  
                            onChangeBookShelf={(event)=>this.props.onShelfChange(bk, event.target.value)}>  
                        </Book>
                      </li>
                       //there are books with no author!!!
                       //console.log(bk.authors.join(" and "))
                     )
                   ):
                   afterSearch && <li><h2 style={{color:"orange"}}>No Books Found!</h2></li>
                  }
              </ol>
            </div>
          </div>
        )
    }
}

SearchBooks.propTypes = {
  onShelfChange:propTypes.func.isRequired,
  booksOnShelf:propTypes.array.isRequired
}

export default SearchBooks
