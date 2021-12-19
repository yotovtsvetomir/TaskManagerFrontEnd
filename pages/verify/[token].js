import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { isLoggedIn, fetchWithToken } from '../../components/Auth/Auth'
import Cookies from 'js-cookie'

export async function getServerSideProps({params, res}) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + params.token);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  const resp = await fetch(process.env.api + "/verify/email/", requestOptions);
  const jso = await resp.json()

  return {
    props: {
      jso,
    },
  };
}

export default function Verify({ resp }) {
  const router = useRouter()
  const { token } = router.query
  Cookies.set('access_token', token)

  useEffect(() => {
    router.push('/')
  }, [])

  return (
    <div></div>
  )
}
