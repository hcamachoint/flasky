import React, {Component} from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

class Profile extends Component{
  constructor(){
    super()
    this.state = {
      first_name: '',
      last_name: '',
      username: '',
      email: ''
    }
    this.delUser = this.delUser.bind(this);
  }

  componentDidMount(){
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)

    this.setState({
      first_name: decoded.identity.first_name,
      last_name: decoded.identity.last_name,
      username: decoded.identity.username,
      email: decoded.identity.email
    })
  }

  delUser(){
    const tok = 'Bearer ' + localStorage.usertoken
    axios.delete('user',{'headers': {
        "Authorization" : tok
      }
    }).then(res => {
      if (res.data.status === 200) {
        localStorage.removeItem('usertoken')
        console.log(res.data.msg)
        this.props.history.push('/')
      }else if (res.data.status === 403) {
        console.log(res.data.msg)
        this.props.history.push('/profile')
      }else {
        console.log("No server connection")
        this.props.history.push('/profile')
      }
    }).catch(err => {
      alert(err)
      return err
    })
  }

  render(){
    return(
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">Profile</h1>
          </div>
          <table className="table col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>Fist name</td>
                <td>{this.state.first_name}</td>
              </tr>
              <tr>
                <td>Last name</td>
                <td>{this.state.last_name}</td>
              </tr>
              <tr>
                <td>Username</td>
                <td>{this.state.username}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.state.email}</td>
              </tr>
              <tr>
                <td></td>
                <td><button className="btn btn-danger" onClick={this.delUser}>Eliminar perfil</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Profile
