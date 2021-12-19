import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken';
import merge from 'lodash/merge'

export const isLoggedIn = async () => {
  if (Cookies.get('access_token') !== undefined) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + Cookies.get('access_token'));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let resp = await fetch(process.env.api + "/customers/", requestOptions)

    if (resp.status == 200) {
      // you are logged in
      return await true
    }
    else {
      // refresh token
      return await false
    }
  }
  else {
    return await false
  }
}

export const fetchWithToken = async (url, options) => {
   let optionsWithToken = options
   if (Cookies.get('access_token') != null) {
     optionsWithToken = merge({}, options, {
       headers: {
         "Authorization": `Bearer ${Cookies.get('access_token')}`
       }
     })
   }
   let s = await fetch(url, optionsWithToken)

   if (s.status === 401) {
     const asd = await fetch(process.env.api + "/auth/refresh/", {
       headers: {"Content-Type": "application/json"},
       method: 'POST',
       body: JSON.stringify({"refresh": Cookies.get("refresh_token")})
     })

     const data = await asd.json()

     if (asd.status === 200) {
       Cookies.set('access_token', (data.access))
     }
     else {
       Cookies.remove('access_token')
       Cookies.remove('refresh_token')
       Router.push('/login')
     }

     optionsWithToken = merge({}, options, {
       headers: {
         "Authorization": `Bearer ${Cookies.get("access_token")}`
       }
     })

     const resp = await fetch(url, optionsWithToken)
     return resp
   }
   else {
     const resp = s
     return resp
   }
 }
