import { useRouter, useContext } from 'next/router'
import { useState, useEffect } from 'react'
import { isLoggedIn } from '../components/Auth/Auth'
import Link from 'next/link'
import Layout from '../components/Layout/Layout'
import Cookies from 'js-cookie'

export default function Google() {
  const router = useRouter()
  const { access_token } = router.query
  Cookies.set('access_token', access_token)

  useEffect(() => {
    router.push('/')
  }, [])

  return (
    <div></div>
  )
}
