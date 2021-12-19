import styles from './Header.module.scss'
import Link from 'next/link'
import { isLoggedIn } from '../Auth/Auth'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

export default function Header() {
  const [ isLogged, setIsLogged ] = useState(false)

  const logout = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("client_id", process.env.client_id);
    urlencoded.append("token", Cookies.get('access_token'));

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch(process.env.api + "/auth/revoke_token/", requestOptions)
      .then(response => {
        if (response.status == 200) {
          Cookies.remove('access_token')
          Cookies.remove('refresh_token')
          window.location.reload();
        }
      })
  }

  useEffect(async () => {
    if (await isLoggedIn() == true) {
      setIsLogged(true)
    }
  }, [])

  return (
    <header className={styles.Header}>
        <div className="Shell">
          <div className={styles.Header_inner}>
            <Link href="/">
              <a className={styles.Logo}>Task Manager App</a>
            </Link>

            <nav className={styles.Nav}>
              {
                isLogged === true ?
                <Link href="/projects">
                  <a>My Projects</a>
                </Link>
                : ""
              }
              {
                isLogged === true ?
                <Link href="/profile">
                  <a>My Profile</a>
                </Link>
                : ""
              }
              {
                isLogged === true ?
                <Link href="/change/password">
                  <a>Change password</a>
                </Link>
                : ""
              }
              {
                isLogged === false ?
                <Link href="/login">
                  <a>Login</a>
                </Link>
                :""
              }
              {
                isLogged === false ?
                <Link href="/register">
                  <a>Register</a>
                </Link>
                :""
              }
              {
                isLogged === false ?
                <Link href="/reset/password">
                  <a>Reset password</a>
                </Link>
                :""
              }
              {
                isLogged === true ?
                <button onClick={logout}>Log out</button>
                :""
              }
            </nav>
          </div>
        </div>
    </header>
  )
}
