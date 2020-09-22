import React, { Component } from 'react'
import {connect} from 'react-redux'
import { login } from './UserFunctions'
import setProfile from '../redux/actions/setProfile'
import Swal from 'sweetalert2'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()

    const user = {
      username: this.state.username,
      password: this.state.password
    }

    login(user).then(res => {
      if (res.data.status === 200) {
        this.props.setProfile({'username':this.state.username})
        this.props.history.push('/profile')
      }else if (res.data.status === 403) {
        this.props.history.push('/login')
        Swal.fire(
          'Something went wrong',
          res.data.msg,
          'error'
        )
      }else {
        Swal.fire(
          'Something went wrong',
          res.data.msg,
          'error'
        )
      }
    })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Enter username"
                  value={this.state.username}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    setProfile: state.setProfile
  }
}

const mapDispatchToProps = {
  setProfile,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
