import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

class Navbar extends Component{
   logOut(e){
    e.preventDefault()
    localStorage.removeItem('usertoken')
    this.props.history.push('/')
  }

  render(){
    const {profile} = this.props

    const guestLink = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/login">Login</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/register">Register</Link>
        </li>
      </ul>
    )

    const userLink = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/profile">Profile</Link>
        </li>
        <li className="nav-item dropdown">
			        <a className="nav-link dropdown-toggle" href="{null}" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{localStorage.usertoken ? profile.username : "profile"}</a>
			        <div className="dropdown-menu" aria-labelledby="dropdown01">
			       	  <a href="{null}" onClick={this.logOut.bind(this)} className="nav-link text-dark">Logout</a>
			        </div>
			      </li>
      </ul>
    )

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">

        <Link to="/" className="navbar-brand text-white">FLASKY</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbar1"
          aria-controls="navbar1"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggle-icon"></span>
        </button>



        <div className="collapse navbar-collapse" id="navbar1">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
          </ul>
          {localStorage.usertoken ? userLink : guestLink}
        </div>
      </nav>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.profile
  }
}
export default connect(mapStateToProps)(withRouter(Navbar))
