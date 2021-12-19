import Layout from '../components/Layout/Layout'
import styles from '../styles/Login.module.scss'
import { useState, useEffect } from 'react'
import Input from '../components/Input/Input'
import Router from 'next/router'
import { isLoggedIn, fetchWithToken } from '../components/Auth/Auth'

export default function Profile() {
  const [ fname, setFname ] = useState('')
  const [ lname, setLname ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ id, setId ] = useState('')
  const [ success, setSuccess ] = useState(false)

  const [ formErrors, setFormErrors ] = useState({
    fname: "",
    lname: ""
  })

  const clearError = (e) => {
    let s = e.target.name
    let ch = formErrors
    ch[s] = ""
    setFormErrors(formErrors => ({...ch}))
  }

  const handleEdit = () => {
    event.preventDefault()
    setSuccess(false)
    var check = true

    if (fname.length < 2) {
      check = false
      setFormErrors(formErrors => ({...formErrors, fname: "Minimum 2 symbols"}))
    }

    if (lname.length < 2) {
      check = false
      setFormErrors(formErrors => ({...formErrors, lname: "Minimum 2 symbols"}))
    }

    if (check === true) {
      var raw = JSON.stringify({
        "user": {
          "first_name": fname,
          "last_name": lname
        }
      });

      var requestOptions = {
        method: 'PATCH',
        headers: {"Content-Type": "application/json"},
        body: raw,
        redirect: 'follow'
      };

      fetchWithToken(process.env.api + "/customers/" + id + '/', requestOptions)
      .then(response => response.json())
      .then(res => {
        setSuccess(true)
      })
    }
  }

  useEffect(async () => {
    if (await isLoggedIn() == false) {
      Router.push('/login')
    }
    else {
      let response = await fetchWithToken(process.env.api + "/customers/")
      let data = await response.json()
      setId(data['id'])
      setFname(data['user']['first_name'])
      setLname(data['user']['last_name'])
      setEmail(data['user']['username'])
    }
  }, [success])

  return (
    <Layout>
      <div className={styles.Login_wrapper}>
        <div className='Shell'>
          <div className={styles.Login_inner}>
            <div className={styles.Login}>
              <h2>Profile</h2>
              <form>
                <div className={styles.Form_group}>
                  <Input onChange={(event) => setFname(event.target.value)} clearError={clearError} value={fname} error={formErrors.fname} name="fname" type="text" label="First name" />
                  <Input onChange={(event) => setLname(event.target.value)} clearError={clearError} value={lname} error={formErrors.lname} name="lname" type="text" label="Last name" />
                </div>
                <Input disabled={true} onChange={(event) => setEmail(event.target.value)} clearError={clearError} value={email} error={formErrors.email} name="email" type="email" label="Email" />

                <div style={{marginBottom: 20}} className={styles.Form_actions}>
                  <button onClick={handleEdit} className="Btn_login">
                    <span>Save changes</span>
                  </button>
                </div>

                <p className={success == true ? styles.Success : styles.Shide}>Changes successfuly saved</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
