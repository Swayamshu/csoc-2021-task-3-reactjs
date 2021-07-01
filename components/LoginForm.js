import React, { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { useAuth } from "../context/auth"
import { API_URL } from "../utils/constants"
import { useCookies } from "react-cookie"
import { Button } from "react-bootstrap"

export default function RegisterForm() {
  const router = useRouter()
  const { setToken } = useAuth()
  const [profileName, setProfileName] = useState('')
  const [avatarImage, setAvatarImage] = useState('#')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [cookies, setCookies, removeCookies] = useCookies(['auth'])
  let name

  function validFieldValues(username, password) {
    if (username === '' || password == '')
      return false
    return true
  }

  function handleUsernameChange(event) {
    const newUsername = event.target.value
    setUsername(newUsername)
  }

  function handlePasswordChange(event) {
    const newPassword = event.target.value
    setPassword(newPassword)
  }

  const login = () => {
    if (validFieldValues(username, password)) {
      console.log("logging in...")

      axios({
        url: API_URL + 'auth/login/',
        method: 'post',
        data: {
          username: username,
          password: password
        }
      }).then(res => {
        setToken(res.data.token)
        setAvatarImage(
          'https://ui-avatars.com/api/?name=' +
            res.data.name +
            '&background=fff&size=33&color=007bff'
        )
        setProfileName(res.data.name)
        name = res.data.name
        router.push('/')
        console.log("logged in!")
      }).catch(error => {
        console.log(error)
      })
    }
  }

  return (
    <div className='bg-grey-lighter min-h-screen flex flex-col'>
      <div className='container max-w-sm mx-auto flex-col items-center justify-center px-2'>
        <div className='bg-white px-6 py-8 rounded shadow-md text-black w-full'>
          <h1 className='mb-8 text-3xl text-center'>Login</h1>
          <input
            type='text'
            onChange={handleUsernameChange}
            value={username}
            className='block border border-grey-light w-full p-3 rounded mb-4'
            name='inputUsername'
            id='inputUsername'
            placeholder='Username'
          />

          <input
            type='password'
            onChange={handlePasswordChange}
            value={password}
            className='block border border-grey-light w-full p-3 rounded mb-4'
            name='inputPassword'
            id='inputPassword'
            placeholder='Password'
          />

          <Button variant="outline-success"
            type='submit'
            size="lg"
            style={{ width: "100%"}}
            onClick={login}>
            Login
          </Button>
        </div>
      </div>
    </div>
  )
}
