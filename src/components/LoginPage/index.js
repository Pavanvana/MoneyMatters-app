import {Component} from 'react'

import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginPage extends Component {
  state = {
    email: '',
    password: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  onSubmitSuccess = userId => {
    const {history} = this.props
    Cookies.set('user_id', userId, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const accesToken = "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF"
    const {email, password} = this.state
    const userDetails = {
      email,
      password
    }
    const url =  `https://bursting-gelding-24.hasura.app/api/rest/get-user-id?email=${email}&password=${password}`
    const options = {
      method: 'POST',
      headers:{
        "x-hasura-admin-secret": accesToken,
        'Content-Type' : "application/json"
      },
      body: JSON.stringify(userDetails)
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (data.get_user_id.length > 0) {
      this.onSubmitSuccess(data.get_user_id[0].id)
    } else {
      this.onSubmitFailure("wrong user details")
    }
  }

  onChangeUsername = event => {
    this.setState({email: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {email, password, showErrorMsg, errorMsg} = this.state
    const userId = Cookies.get('user_id')
    if (userId !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="login-and-form-container">
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <img
              src="https://res.cloudinary.com/daflxmokq/image/upload/v1690619081/Group_hmc6ea.jpg"
              alt="website logo"
              className="logo"
            />
            <h1 className="heading">Money Matters</h1>
            <div className="input-container">
              <label className="label" htmlFor="email">
                EMAIL
              </label>
              <input
                className="input"
                type="text"
                id="email"
                placeholder="Email"
                onChange={this.onChangeUsername}
                value={email}
              />
            </div>
            <div className="input-container">
              <label className="label" htmlFor="password">
                PASSWORD
              </label>
              <input
                className="input"
                type="password"
                id="password"
                placeholder="Password"
                onChange={this.onChangePassword}
                value={password}
              />
            </div>
            {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}
export default LoginPage