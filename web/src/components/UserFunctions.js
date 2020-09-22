import axios from 'axios'

export const register = newUser => {
  return axios
  .post('http://localhost:8000/api/register',{
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    username: newUser.username,
    email: newUser.email,
    password: newUser.password
  })
  .then(res => {
    console.log(res)
  })
}

export const login = user => {
  return axios
    .post('http://localhost:8000/api/auth', {
      username: user.username,
      password: user.password
    })
    .then(response => {
      localStorage.setItem('usertoken', response.data.token)
      return response
    })
    .catch(err => {
      console.log(err.message)
      return {data:{'msg': err.message, 'status':500}}
    })
}

export const deluser = user => {
  return axios.delete('http://localhost:8000/api/user',{'headers': {
      "Authorization" : 'Bearer ' + localStorage.usertoken
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