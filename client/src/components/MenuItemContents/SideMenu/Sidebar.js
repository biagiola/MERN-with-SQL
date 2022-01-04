import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useStateValue } from '../../../store/StateProvider'
import { Divider } from '@material-ui/core'
import { IconContext } from 'react-icons'
import { BsPerson } from 'react-icons/bs'
import { BiMenu, BiCog, BiPieChartAlt2, BiPhoneOutgoing } from 'react-icons/bi'
import './Sidebar.css'

const Sidebar = () => {
  const [{ userFirstname }] = useStateValue()
  
  /* display full width sidebar */
  useEffect(() => {
    let btn = document.querySelector('#btn')
    let sidebar = document.querySelector('.sidebar')

    btn.onclick = function() {
      sidebar.classList.toggle('active')
    }
  }, [])

  // this node is for the entire sidebar element
  const sidebarRef = useRef()

  // handle click outside/inside
  const handleClickInsideOutside = e => {
    //console.log(sidebarRef)
    if (sidebarRef.current.contains(e.target)) {
      // inside click
      // nothing to do here
      // we just on sidebar with the burger icon
      return
    }
    // outside click (close sidebar menu)
    let sidebar = document.querySelector('.sidebar')
    if (sidebar.classList.contains('active')) {
      sidebar.classList.toggle('active')
    }
  }

  // listening for clicking outside/inside  
  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleClickInsideOutside)
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickInsideOutside)
    }
  }, [])

  return (
    <div className='sidebar' ref={ sidebarRef } >
      {/* Content */}
      <div className='header-sidebar'>
        {/* Logo */}
        
        <div className='sidebar-name'>
          <div className='name'>{ userFirstname }</div>
        </div>
        {/* Burger Icon */}
        <IconContext.Provider value={{ style: { width: '32px' }, className: 'burger-icon' }}>
          <div>
            <BiMenu id='btn' className='burger-icon'/>
          </div>
        </IconContext.Provider>
      </div>
      
      <Divider />
      
      {/* Page's List */}
      <ul className='nav_list'>
        {/* dashboard */}
        <li>
          <NavLink activeClassName='activeLink' to='/dashboard'>
            <BsPerson />
            <span className='links-name'>Users</span>
          </NavLink>
          <span className='tooltip'>Users</span>
        </li>
        {/* users */}
        {/* <li>
          <NavLink activeClassName='activeLink' to='/users'>
            <BsPeople />
            <span className='links-name'>Users</span>
          </NavLink>
          <span className='tooltip'>User</span>
          {/* Collapse pages * /}
          <ul className='collapse__menu'>
            {/* <a href='#' className='collapse__sublink'>Data</a>
            <a href='#' className='collapse__sublink'>Group</a>
            <a href='#' className='collapse__sublink'>Members</a> * /}
          </ul>
        </li> */}
        
        {/* Provider */}        
        <li>
          <NavLink activeClassName='activeLink' to='/providers'>
            <BiPhoneOutgoing />
            <span className='links-name'>Providers</span>
          </NavLink>
          <span className='tooltip'>Providers</span>
        </li>

        {/* Analytics */}
        <li>
          <NavLink activeClassName='activeLink' to='/analytics'>
            <BiPieChartAlt2 />
            <span className='links-name'>Analytics</span>
          </NavLink>
          <span className='tooltip'>Analytics</span>
        </li>

        {/* Settings */}
        <li>
          <NavLink activeClassName='activeLink' to='/settings'>
            <BiCog />
            <span className='links-name'>Settings</span>
          </NavLink>
          <span className='tooltip'>Settings</span>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
