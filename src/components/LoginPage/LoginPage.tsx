import {Navigate, useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import useUserId from '../../hooks/useUserId'
import useFetch from '../../hooks/useFetch'

import { useTranslation } from 'react-i18next';

import './index.css'

interface Response {
  get_user_id: [
      {
          id: number
      }
  ]
}

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const userId = useUserId()

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
    const lng = navigator.language
    i18n.changeLanguage(lng)
  })

  useEffect(() => {
    if (data !== undefined ){
      getData()
    }
  }, [data,url])

  const getData = () => {
    const response = data as Response|undefined
    if (response&& response.get_user_id.length > 0){
      onSubmitSuccess(response.get_user_id[0].id)
      setShowErrorMsg(false)
    }else{
      setShowErrorMsg(true)
      onSubmitFailure("*Invalid user details")
    }
  }

  const onSubmitSuccess = (userId:number) => {
    Cookies.set('user_id', userId.toString(), {expires: 30})
    navigate('/')
  }

  const onSubmitFailure = (errorMsg: string) => {
    setShowErrorMsg(true)
    setErrorMsg(errorMsg)
  }

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchData()
  }

  if (userId !== undefined){
    return <Navigate to="/" />
  }
  return (
    <div className="login-container">
      <div className="login-and-form-container">
        <form className="form-container" onSubmit={(e) => onSubmitForm(e)}>
          <img
            src="https://res.cloudinary.com/daflxmokq/image/upload/v1690619081/Group_hmc6ea.jpg"
            alt="website logo"
            className="logo"
          />
          <h1 className="heading">{t('title')}</h1>
          <div className="input-container">
            <label className="label" htmlFor="email">
            {t('email')}
            </label>
            <input
              className="input"
              type="text"
              id="email"
              placeholder={t('emailPlaceHolder')}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="input-container">
            <label className="label" htmlFor="password">
              {t('password')}
            </label>
            <input
              className="input"
              type="password"
              id="password"
              placeholder={t('passwordPlaceHolder')}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
          <button type="submit" className="login-button">
            {t('login')}
          </button>
        </form>
      </div>
    </div>
  )
}
export default LoginPage