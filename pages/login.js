import Layout from '../components/Layout/Layout'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Login.module.scss'
import glogo from '../public/glogo.png'
import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import { isLoggedIn } from '../components/Auth/Auth'
import Input from '../components/Input/Input'
import Router from 'next/router'

export default function Login() {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const [ formErrors, setFormErrors ] = useState({
    email: "",
    password: ""
  })

  const clearError = (e) => {
    let s = e.target.name
    let ch = formErrors
    ch[s] = ""
    setFormErrors(formErrors => ({...ch}))
  }

  const handleLogin = () => {
    event.preventDefault()
    var check = true

    if (email.length < 1) {
      setFormErrors(formErrors => ({...formErrors, email: "Field can't be empty"}))
      check = false;
    }
    else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      setFormErrors(formErrors => ({...formErrors, email: "Email not valid"}))
      check = false;
    }

    if (password.length < 1) {
      setFormErrors(formErrors => ({...formErrors, password: "Field can't be empty"}))
      check = false;
    }

    if (check === true) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("grant_type", "password");
      urlencoded.append("client_id", process.env.client_id);
      urlencoded.append("username", email);
      urlencoded.append("password", password);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      fetch(process.env.api + "/auth/token/", requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.access_token) {
            Cookies.set('access_token', result.access_token)
            Cookies.set('refresh_token', result.refresh_token)
            Router.push('/projects')
          }
        })
    }
  }

  const handleGoogleLogin = useCallback(() => {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const redirectUri = 'google/auth/';

    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');

    const params = {
      response_type: 'code',
      client_id: process.env.google_id,
      redirect_uri: `${process.env.api}/${redirectUri}`,
      prompt: 'select_account',
      access_type: 'offline',
      scope
    };

    const urlParams = new URLSearchParams(params).toString();

    window.location = `${googleAuthUrl}?${urlParams}`;
  }, []);

  useEffect(async () => {
    if (await isLoggedIn() == true) {
      Router.push('/')
    }
  }, [])

  return (
    <Layout>
      <div className={styles.Login_wrapper}>
        <div className='Shell'>
          <div className={styles.Login_inner}>
            <div className={styles.Login}>
              <h2>Login</h2>
              <form>
                <Input onChange={(event) => setEmail(event.target.value)} clearError={clearError} value={email} error={formErrors.email} name="email" type="email" label="Email" />
                <Input onChange={(event) => setPassword(event.target.value)} clearError={clearError} value={password} error={formErrors.password} name="password" type="password" label="Password" />

                <div className={styles.Form_actions}>
                  <button onClick={handleLogin} className="Btn_login">
                    <span>Login</span>
                  </button>
                </div>
              </form>

              <div className={styles.SSO}>
                <button onClick={handleGoogleLogin}>
                  <span>Login with Google</span>
                  <Image src={glogo} width={18} height={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
