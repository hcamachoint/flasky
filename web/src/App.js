import React from 'react';
import { Component } from 'react'

import {BrowserRouter as Router, Route} from 'react-router-dom'
import { Provider } from 'react-redux'

import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'

import store, { saveState } from './redux/store'

class App extends Component{
  componentDidMount(){
    window.addEventListener('unload', saveState);
  }
  render(){
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar/>
            <Route exact path="/" component={Landing}/>
            <div className="container">
              <Route exact path="/register" component={Register}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/profile" component={Profile}/>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
