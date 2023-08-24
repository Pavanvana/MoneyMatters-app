import {Redirect, useHistory} from 'react-router-dom'
import { useState } from 'react'
import Cookies from 'js-cookie'

import './index.css'

const LoginPage = () => {
  const history = useHistory()
  const [email, changeEmail] = useState('')
  const [password, changePassword] = useState('')
  const [showErrorMsg, changeShowErrorMsg] = useState(false)
  const [errorMsg, changeErrorMsg] = useState('')

  const userId = Cookies.get('user_id')

  const onSubmitSuccess = userId => {
    Cookies.set('user_id', userId, {expires: 30})
    history.replace('/')
  }

  const onSubmitFailure = errorMsg => {
    changeShowErrorMsg(true)
    changeErrorMsg(errorMsg)
  }

  const onSubmitForm = async event => {
    event.preventDefault()
    const accesToken = "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF"
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
      onSubmitSuccess(data.get_user_id[0].id)
    } else {
      onSubmitFailure("wrong user details")
    }
  }

  const onChangeEmail = event => {
    changeEmail(event.target.value)
  }

  const onChangePassword = event => {
    changePassword(event.target.value)
  }

  if (userId !== undefined) {
    return <Redirect to="/" />
  }
  return (
    <div className="login-container">
      <div className="login-and-form-container">
        <form className="form-container" onSubmit={onSubmitForm}>
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
              onChange={onChangeEmail}
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
              onChange={onChangePassword}
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
export default LoginPage