import axios from '../../axiosConfig'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { actionTypes } from '../../store/reducers/Reducer'
import { useStateValue } from '../../store/StateProvider'
import { Avatar, Menu, MenuItem, Divider } from '@material-ui/core'
import { BiChevronDown, BiExit } from 'react-icons/bi'
import avatarExample from '../../assets/avatarExample.png'
import miaLogo from '../../assets/logo-mia.png'
import './Header.css'

const Header = () => {
  // state from reducer
  const [{ userFirstname, userEmail, userRole }, dispatch] = useStateValue()
  // for the header menu
  const [anchorEl, setAnchorEl] = useState(null) 
  // for redirect when we logout
  const history = useHistory()
  
  // open modal
  const openHeaderMenu = e => {
    //console.log('e.currentTarget', e.currentTarget)
    setAnchorEl(e.currentTarget)
    //console.log(userRole)
  }
  // close modal
  const closeHeaderMenu = () => {
    //console.log('closeHeaderMenu')
    setAnchorEl(null)
  }

  const handleLogout = e => {
    e.preventDefault()

    //console.log('userRole', userRole)
    
    axios.post('accounts/logout', { email: userEmail, role_id: userRole })
    .then( res => {

      setAnchorEl(null)
      
      console.log(`user was logout ${userEmail}`)
      // Reset reducer's value
      // firstname
      dispatch({
        type: actionTypes.SET_FIRSTNAME,
        userFirstname: null
      })
      // lastname 
      dispatch({
        type: actionTypes.SET_LASTNAME,
        userLastname: null
      })
      // email
      dispatch({
        type: actionTypes.SET_EMAIL,
        userEmail: null
      })
      // role
      dispatch({
        type: actionTypes.SET_ROLLE,
        userRole: null
      })
      // timestamp
      dispatch({
        type: actionTypes.SET_TIMESTAMP,
        userRole: null
      })
      // all Users
      dispatch({
        type: actionTypes.SET_ALL_USERS,
        listOfAllUsers: null
      })
      // all providers
      dispatch({
        type: actionTypes.SET_PROVIDERS,
        listOfAllUsers: null
      })
      // providers selected
      dispatch({
        type: actionTypes.SET_PROVIDER_SELECTED,
        listOfAllUsers: null
      })

      // delete the local storage
      localStorage.removeItem('userFirstname')
      localStorage.removeItem('userLastname')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userTimestamp')
      localStorage.removeItem('listOfAllUsers')
      localStorage.removeItem('listOfProviders')
      localStorage.removeItem('providerSelected')
      /* localStorage.removeItem('listOfAdmins')
      localStorage.removeItem('listOfUsers') */
  
      // redirect
      history.push('/login')

    })
    .catch( err => console.log(err))
  }

  return (
    <div className='header'>
      {/* Logo */}
      <div className='header-logo'>
        <img src={ miaLogo } width='80px' height='35px' alt='mia-logo'/>
      </div> 
      {/* Right Options */}
      <div className='header-right'>
        <div onClick={ openHeaderMenu }>
          {/* username */}
          <div className='header-avatar'>
            <Avatar src={ avatarExample } />
          </div>
          {/* <div className='header-username' >{ userFirstname }</div> */}
          {/* btn dropdown */}
          <BiChevronDown className='header-chevron-down'/>
        </div>
        {/* header menu */}
        <Menu
          id='header-modal'
          anchorEl={ anchorEl }
          keepMounted
          open={ Boolean(anchorEl) }
          onClose={ closeHeaderMenu }
        >
          <MenuItem>
            <div>Name:</div>
            <div className='header-menu-options'>{ userFirstname }</div>
          </MenuItem>
          { userRole === 'user' ?
            <MenuItem>
              <div>Email:</div>
              <div className='header-menu-options'>{ userEmail }</div>
            </MenuItem>
            : ''
          }
          <MenuItem>
            <div>Role:</div>
            <div className='header-menu-options'>{ userRole === 0 ? 'Admin' : 'User' }</div>
          </MenuItem>

          <Divider />

          <MenuItem onClick={ handleLogout }>
            <BiExit />
            <div className='header-menu-options-logout'>Log out</div>
          </MenuItem>
            
        </Menu>
      </div>
    </div>
  )
}

export default Header