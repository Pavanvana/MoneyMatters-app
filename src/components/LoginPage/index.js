import {Redirect, useHistory} from 'react-router-dom'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import useCookieId from '../customHook/getUserId'
import useFetch from '../customHook/useFetch'

import './index.css'

const LoginPage = () => {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const userId = useCookieId()

  const accesToken = "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF"
  const userDetails = {
    email,
    password
  }
  const url =  "https://bursting-gelding-24.hasura.app/api/rest/get-user-id"
  const options = {
    method: 'POST',
    headers:{
      "x-hasura-admin-secret": accesToken,
      'Content-Type' : "application/json"
    },
    body: JSON.stringify(userDetails)
  }
  const {data, fetchData} = useFetch(url, options)

  useEffect(() => {
    if (data.get_user_id !== undefined ){
      onfetchData()
    }
  }, [data])

  const onfetchData = () => {
    console.log("data", data)
    if (data.get_user_id.length > 0){
      onSubmitSuccess(data.get_user_id[0].id)
      setShowErrorMsg(false)
    }else{
      setShowErrorMsg(true)
      onSubmitFailure("*Invalid user details")
    }
  }

  const onSubmitSuccess = userId => {
    Cookies.set('user_id', userId, {expires: 30})
    history.replace('/')
  }

  const onSubmitFailure = errorMsg => {
    setShowErrorMsg(true)
    setErrorMsg(errorMsg)
  }

  const onSubmitForm = event => {
    event.preventDefault()
    fetchData()
  }

  const onChangeEmail = event => {
    setEmail(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  if (userId !== undefined){
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