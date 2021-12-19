import Layout from '../../components/Layout/Layout'
import styles from '../../styles/Login.module.scss'
import { useState, useEffect } from 'react'
import Input from '../../components/Input/Input'
import { useRouter } from 'next/router'
import { isLoggedIn, fetchWithToken } from '../../components/Auth/Auth'
import Cookies from 'js-cookie'

export default function Password() {
  const router = useRouter()
  const [ email, setEmail ] = useState('')
  const [ message, setMessage ] = useState([])
  const [ success, setSuccess ] = useState(false)

  const [ formErrors, setFormErrors ] = useState({
    email: "",
  })

  const clearError = (e) => {
    let s = e.target.name
    let ch = formErrors
    ch[s] = ""
    setFormErrors(formErrors => ({...ch}))
  }

  const handleChangePassword = () => {
    event.preventDefault()
    var check = true
    setSuccess(false)

    if (email.length < 1) {
      setFormErrors(formErrors => ({...formErrors, email: "Field can't be empty"}))
      check = false;
    }
    else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      setFormErrors(formErrors => ({...formErrors, email: "Email not valid"}))
      check = false;
    }

    if (check === true) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "username": email
      });

      var requestOptions = {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: raw,
        redirect: 'follow'
      };

      fetch(process.env.api + '/reset/password/', requestOptions)
      .then(response => response.json())
      .then(res => {
        setMessage(res)
        setSuccess(true)
      })
    }
  }

  return (
    <Layout>
      <div className={styles.Login_wrapper}>
        <div className='Shell'>
          <div className={styles.Login_inner}>
            <div className={styles.Login}>
              <h2>Reset password</h2>

              <form>
                <Input onChange={(event) => setEmail(event.target.value)} clearError={clearError} value={email} error={formErrors.email} name="email" type="email" label="Email" />

                <div style={{ marginBottom: 20}} className={styles.Form_actions}>
                  <button onClick={handleChangePassword} className="Btn_login">
                    <span>Send link</span>
                  </button>
                </div>

                <p className={`${success == true ? styles.Success : styles.Shide} ${"error" in message ? styles.Red : ""}`}>{"error" in message ? message['error'] : message['success']}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
