import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

//global variable
//pre-defined 4 categories of bookshelf, where unique id will be used for key prop in array map
window.$bookShelfList = [
    {id:'currentlyReading', name:'Currently Reading'},
    {id:'wantToRead', name:'Want to Read'},
    {id:'read', name:'Read'},
    {id:'none', name:'None'} //bu we do not want this to show on hmoe page
   ]
 
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'))
