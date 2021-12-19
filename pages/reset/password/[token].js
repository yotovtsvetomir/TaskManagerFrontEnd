import Layout from '../../../components/Layout/Layout'
import styles from '../../../styles/Login.module.scss'
import { useState, useEffect } from 'react'
import Input from '../../../components/Input/Input'
import { useRouter } from 'next/router'
import { isLoggedIn, fetchWithToken } from '../../../components/Auth/Auth'
import Cookies from 'js-cookie'

export async function getServerSideProps({params, res}) {
  const tok = params.token

  return {
    props: {
      tok,
    },
  };
}

export default function Password({ tok }) {
  const router = useRouter()
  const { token } = router.query

  const [ new_password, setNew_password ] = useState('')
  const [ confirm_password, setConfirm_password ] = useState('')

  const [ message, setMessage ] = useState([])
  const [ success, setSuccess ] = useState(false)

  const [ formErrors, setFormErrors ] = useState({
    new_password: "",
    confirm_password: ""
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

    if (new_password.length < 7) {
      setFormErrors(formErrors => ({...formErrors, new_password: "Minimum 7 symbols"}))
      check = false;
    }

    if (confirm_password.length < 7) {
      setFormErrors(formErrors => ({...formErrors, confirm_password: "Minimum 7 symbols"}))
      check = false;
    }
    else if (confirm_password !== new_password) {
      setFormErrors(formErrors => ({...formErrors, confirm_password: "Passwords mismatch"}))
      check = false;
    }

    if (check === true) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + tok)
      myHeaders.append("Content-Type", "application/json")

      var raw = JSON.stringify({
        "new_password": new_password
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(process.env.api + '/reset/change/password/', requestOptions)
      .then(response => response.json())
      .then(res => {
        setMessage(res)
        setSuccess(true)
        router.push('/login')
      })
    }
  }

  return (
    <div className={styles.Login_wrapper}>
      <div className='Shell'>
        <div className={styles.Login_inner}>
          <div className={styles.Login}>
            <h2>Reset password</h2>

            <form>
              <Input onChange={(event) => setNew_password(event.target.value)} clearError={clearError} error={formErrors.new_password} value={new_password} name="new_password" type="password" label="New password" />
              <Input onChange={(event) => setConfirm_password(event.target.value)} clearError={clearError} error={formErrors.confirm_password} value={confirm_password} name="confirm_password" type="password" label="Repeat new password" />

              <div style={{ marginBottom: 20}} className={styles.Form_actions}>
                <button onClick={handleChangePassword} className="Btn_login">
                  <span>Reset</span>
                </button>
              </div>

              <p className={`${success == true ? styles.Success : styles.Shide} ${"error" in message ? styles.Red : ""}`}>{"error" in message ? message['error'] : message['success']}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
