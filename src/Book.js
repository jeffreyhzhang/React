import React from 'react'
import propTypes from "prop-types"

//book as props (passed in from bookShelf)
//how to control image width and height as we do not have that info from API...fixed width/height???
//  
const Book = (props) =>{
    //get from gloabl var
    const bookShelfList = window.$bookShelfList ;
    const {book, onChangeBookShelf} = props;
    //since no shlef data from search, set to None as default (the last one in array).
    if(!book.shelf) book.shelf = bookShelfList[bookShelfList.length - 1].id;
    //some books have no author, no imagelink....only id and title is required
    let mystyle= book.imageLinks ?
                { width: 128, height: 192, backgroundImage: `url(${book.imageLinks.thumbnail})` }
                :{ width: 128, height: 192, backgroundColor:'pink'}
    return (
        <div className="book">
        <div className="book-top">
          <div className="book-cover" style={mystyle}></div>
          <div className="book-shelf-changer">
            <select onChange={onChangeBookShelf}  defaultValue ={book.shelf}>
              <option value="move" disabled>Move to...</option>
              {
              bookShelfList.map((bs)=>(
                  <option value={bs.id}  key={bs.id} > {bs.name}</option>
              ))
             }
            </select>
          </div>
        </div>
        <div className="book-title">{book.title}</div>
        <div className="book-authors">{book.authors && book.authors.join(" and ")}</div>
      </div>
    )
}
Book.propTypes = {
    book: propTypes.object.isRequired,
    onChangeBookShelf:propTypes.func.isRequired
}
export default Book;