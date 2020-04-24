import axios from 'axios'

export const register = newUser => {
  return axios
  .post('register',{
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
    .post('auth', {
      username: user.username,
      password: user.password
    })
    .then(response => {
      if (response.data.status === 200) {
        localStorage.setItem('usertoken', response.data.token)
      }
      return response
    })
    .catch(err => {
      return err
    })
}
