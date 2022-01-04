import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { actionTypes } from '../../store/reducers/Reducer'
import { useStateValue } from '../../store/StateProvider'
import axios from '../../axiosConfig'
import './Login.css'

const Login = () => {
  const [, dispatch] = useStateValue()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [listOfUserWithDateAndHour, setListOfUserWithDateAndHour] = useState([])
  const [userWasLogged, setUserWasLogged] = useState(false)
  //const [colorErrorEmail, setColorErrorEmail] = useState('grey')

  const handleLogin = e => {
    e.preventDefault()

    // search the account
    axios.post('accounts/login', {
      email: email,
      password: password,
    })
    .then( res => {
      console.log('res.data',res.data)

      // save to reducer
      dispatch({
        type: actionTypes.SET_FIRSTNAME,
        userFirstname: res.data.firstname,
      })
      dispatch({
        type: actionTypes.SET_LASTNAME,
        userLastname: res.data.lastname,
      })
      dispatch({
        type: actionTypes.SET_EMAIL,
        userEmail: res.data.email,
      })
      dispatch({
        type: actionTypes.SET_ROLE,
        userRole: res.data.role_id,
      })
      dispatch({
        type: actionTypes.SET_TIMESTAMP,
        userTimestamp: res.data.date_in,
      })

      // save to localstorage
      localStorage.setItem('userFirstname', JSON.stringify(res.data.firstname))
      localStorage.setItem('userLastname',  JSON.stringify(res.data.lastname))
      localStorage.setItem('userEmail',     JSON.stringify(res.data.email))
      localStorage.setItem('userRole',      JSON.stringify(res.data.role_id))
      localStorage.setItem('userTimestamp', JSON.stringify(res.data.date_in))

      // get users list
      axios.get('accounts/getAccounts')
      .then( res => {
        console.log('res.data.listOfUsers', res.data.listOfUsers)

        dispatch({
          type: actionTypes.SET_ALL_USERS,
          listOfAllUsers: res.data.listOfUsers
        })

        localStorage.setItem('listOfAllUsers', JSON.stringify(res.data.listOfUsers))

      }).catch(err => console.log(err.response.data.message))

      // get providers list
      axios.get('providers/getProviders')
      .then( res => {
        console.log('res.data',res.data.listOfProviders)

        // save to reducer
        dispatch({
          type: actionTypes.SET_PROVIDERS,
          listOfProviders: res.data.listOfProviders
        })

        // save to the localstorage
        localStorage.setItem('listOfProviders', JSON.stringify(res.data.listOfProviders))

        history.replace('/dashboard')
      })
      .catch(err => console.log(err.response.data.message))
    })

    
    
  }

  return (
    <form className='login-container' onSubmit={ handleLogin }>
      <div className='login-box'>
        <div className='login-title'>Login</div>
        
        <div className='login-form'>
          <div className='input-data'>
            <input 
              type='text' 
              label='email'
              required
              value={ email }
              onChange={ e => setEmail(e.target.value) }
            />
            <div className='underline'></div>
            <label style={{ color: 'grey' /* colorErrorEmail */ }}>Email</label>
            {/* <span className='wrong-input-email'>Email is wrong</span> */}
          </div>

          <div className='input-data'>
            <input 
              type='password' 
              label='password'
              required
              value={ password }
              onChange={ e => setPassword(e.target.value) }
            />
            <div className='underline'></div>
            <label>Password</label>
          </div>

          <div className='login-form-btns'>
            <button type='submit' className='login-form-btn'>
              Login
            </button>
          </div>
        </div>

      </div>
    </form>
  )
}

export default Login