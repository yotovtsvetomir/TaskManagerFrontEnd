import Layout from '../components/Layout/Layout'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Login.module.scss'
import glogo from '../public/glogo.png'
import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import { isLoggedIn } from '../components/Auth/Auth'
import Input from '../components/Input/Input'
import LoadingCircle from '../components/LoadingCircle/LoadingCircle'
import Router from 'next/router'

export default function Register() {
  const [ fname, setFname ] = useState('')
  const [ lname, setLname ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ confirm_password, setConfirm_password ] = useState('')

  const [ loading, setLoading ] = useState(false)

  const [ formErrors, setFormErrors ] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirm_password: ""
  })

  const clearError = (e) => {
    let s = e.target.name
    let ch = formErrors
    ch[s] = ""
    setFormErrors(formErrors => ({...ch}))
  }

  const handleRegister = () => {
    event.preventDefault()
    setLoading(true)
    var check = true

    if (fname.length < 2) {
      check = false
      setFormErrors(formErrors => ({...formErrors, fname: "Minimum 2 symbols"}))
    }

    if (lname.length < 2) {
      check = false
      setFormErrors(formErrors => ({...formErrors, lname: "Minimum 2 symbols"}))
    }

    if (email.length < 1) {
      setFormErrors(formErrors => ({...formErrors, email: "Filed can't be empty"}))
      check = false;
    }
    else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      setFormErrors(formErrors => ({...formErrors, email: "Email not valid"}))
      check = false;
    }

    if (password.length < 7) {
      setFormErrors(formErrors => ({...formErrors, password: "Minimum 7 symbols"}))
      check = false;
    }

    if (confirm_password.length < 7) {
      setFormErrors(formErrors => ({...formErrors, confirm_password: "Minimum 7 symbols"}))
      check = false;
    }
    else if (confirm_password !== password) {
      setFormErrors(formErrors => ({...formErrors, confirm_password: "Passwords mismatch"}))
      check = false;
    }

    if (check === false) {
      setLoading(false)
    }

    if (check === true) {
      event.preventDefault()
      var myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "first_name": fname,
        "last_name": lname,
        "username": email,
        "password": password
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(process.env.api + "/customers/", requestOptions)
        .then(response => {
          if (response.status == 201) {
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
          else if (response.status == 409) {
            setFormErrors(formErrors => ({...formErrors, email: "Account with this email already exists."}))
            setLoading(false)
          }
          else {
            setFormErrors(formErrors => ({...formErrors, email: "Email is fake"}))
            setLoading(false)
          }
        })
    }
  }

  const handleGoogleRegister = useCallback(() => {
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
              <h2>Register</h2>
              <form>
                <div className={styles.Form_group}>
                  <Input onChange={(event) => setFname(event.target.value)} clearError={clearError} value={fname} error={formErrors.fname} name="fname" type="text" label="First name" />
                  <Input onChange={(event) => setLname(event.target.value)} clearError={clearError} value={lname} error={formErrors.lname} name="lname" type="text" label="Last name" />
                </div>

                <Input onChange={(event) => setEmail(event.target.value)} clearError={clearError} value={email} error={formErrors.email} name="email" type="email" label="Email" />

                <div className={styles.Form_group}>
                  <Input onChange={(event) => setPassword(event.target.value)} clearError={clearError} error={formErrors.password} value={password} name="password" type="password" label="Password" />
                  <Input onChange={(event) => setConfirm_password(event.target.value)} clearError={clearError} error={formErrors.confirm_password} value={confirm_password} name="confirm_password" type="password" label="Repeat password" />
                </div>

                { loading === false ?
                  <div className={styles.Form_actions}>
                    <button onClick={handleRegister} className="Btn_login">
                      <span>Register</span>
                    </button>
                  </div>
                  :
                  <LoadingCircle loading={true} />
                }
              </form>

              <div className={styles.SSO}>
                <button disabled={loading} onClick={handleGoogleRegister}>
                  <span>Register with Google</span>
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
