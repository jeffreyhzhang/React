import React  from 'react'
import Book from './Book'
import propTypes from "prop-types"
//for given bookshelf, we have id/name, booksonshelf 

const BookShelf = (props) =>{
        let {shelfname, booksOnShelf, onShelfChange} = props;
        return (
                <div className="bookshelf">
                  <h2 className="bookshelf-title">{shelfname}</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                    {booksOnShelf.map( (bs) => (
                      <li key={bs.id}>
                        <Book book= {bs}  
                            onChangeBookShelf={(event)=>onShelfChange(bs, event.target.value)}>  
                        </Book>
                      </li>
                     )
                    )}
                    </ol>
                  </div>
                </div>
        )
}

BookShelf.propTypes = {
     shelfname:propTypes.string.isRequired,
  booksOnShelf:propTypes.array.isRequired,
 onShelfChange:propTypes.func.isRequired
}

export default BookShelf
