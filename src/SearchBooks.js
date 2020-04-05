import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Book from './Book'
import propTypes from 'prop-types'
import { debounce  } from 'lodash';
class SearchBooks extends Component {
 
    constructor(props) {
      super(props)
    
      this.state = {
        query: '',
        matchingbooks: []   //hold matching books vis searching
      }
      //for performance, do not submit query for every fast keyup...
      // submit to server to run only every 0.3 second if needed
      this.submitQuery =  debounce(this.updateQuery, 300);
    }
    
    //if no match, it returns error
    //{"books":{"error":"empty query","items":[]}}    
    handleQueryInput = ({ target: { value } }) => {
      this.setState({ query: value });
      if (value.length > 1) {
        this.submitQuery(value);
      }
    }

    updateQuery = (query) => {
      this.setState({ query: query });
      if(query.trim().length<1) {
        this.setState({ matchingbooks: []});
        return;
      }

      //odd... error if no match..why not just return empty array
      BooksAPI.search(query).then((books) => {
        if(books.error)  {
          this.setState({ matchingbooks: []});
          return;
        }

        //sort books based on rating...may not available
        //books.sort((a,b)=> a.averageRating > b.averageRating?1:-1);

        //keep state....add shelf to searched results if already on shelf
        books.forEach(
          xx => { this.props.booksOnShelf.filter( yy => yy.id ===xx.id).map( zz => xx.shelf = zz.shelf); }
        );
        this.setState({ matchingbooks: books});

        //do it directly...if already on shelf, use that book on shelf...not always working....if we just Move the same book to different shelf
        //this.setState({ matchingbooks: books.map( xx => this.props.booksOnShelf[xx.id] ? this.props.booksOnShelf[xx.id]: xx) })
      }).catch((reason) => {
        if(reason === -999) {
          console.error("Had previously handled error");
        }
        else {
          console.error(`Trouble with api search(): ${reason}`);
        }
      })
    }

    render() {
        let { query, matchingbooks } = this.state;
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
                    //onChange={(event) => this.updateQuery(event.target.value)}
                    onChange={this.handleQueryInput}   
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                 {
                   matchingbooks.length>0?
                   matchingbooks.map( (book) => (
                      <li key={book.id}>
                        <Book book= {book}  
                            onChangeBookShelf={(event)=>this.props.onShelfChange(book, event.target.value)}>  
                        </Book>
                      </li>
                       //there are books with no author!!!
                       //console.log(bk.authors.join(" and "))
                     )
                   ):
                   query.trim().length>0  && matchingbooks.length>0 && <li><h2 style={{color:"orange"}}>No Books Found!</h2></li>
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
