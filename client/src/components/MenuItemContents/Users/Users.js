import React, { useState, useEffect } from 'react'
import { useStateValue } from '../../../store/StateProvider'
import Downshift from './Typeahead'
import ReactPaginate from 'react-paginate'
import { DisappearedLoading } from 'react-loadingg'
import AddUser from './AddUser'
import ShowUsers from './ShowUsers'
import UserFound from './UserFound'
import { BiPlusCircle } from 'react-icons/bi'
import './User.css'
import './Pagination.css'

const Users = () => {
  // toggle AddAdmin's modal state 
  const [open, setOpen] = useState(false)
  const [listOfNames, setListOfNames] = useState([])
  const [showAllUsers, setShowAllUsers] = useState(true)
  const [userFound, setUserFound] = useState([])
  const [usersWasLoaded, setUsersWasLoaded] = useState(false)
  //listOfAllUsers
  const [userWasEdited, setUserWasEdited] = useState(false)
  // pagination's state
  const [offset, setOffset] = useState(0)
  const [selected, setSelected] = useState(0)
  const [limit/* , setLimit */] = useState(10)
  const [pageCount, setPageCount] = useState(null)
  const [firstRender, setFirstRender] = useState(true)
  const [deleteToggle, setDeleteToggle] = useState(false)
  
  // user's state 
  const [{ userRole, listOfAllUsers }] = useStateValue()

  // list of names to be search by the Typeahead 
  useEffect(() => {
    //console.log('listOfAllUsers had changed')

    if(listOfAllUsers) {
      listOfAllUsers.map( user => {
        // split date
        if(user) {
          if(user.date_in) {
            let dateSplit = user.date_in.split('T')
            //console.log('dateSplit', dateSplit)
            // split hour
            if(dateSplit[1]) {
              let hourSplit = dateSplit[1].split('.')
              // list of users for the typeahead
              handleListOfNames(user, dateSplit[0], hourSplit[0])
            
            } else {
              // list of users for the typeahead
              handleListOfNames(user, dateSplit[0], dateSplit[1])
            }
            //console.log(dateSplit)
          }
        }

        return true
      })
    }
  }, [listOfAllUsers])

  // listOfNames and listOfAllUsers are the same but the first have date and hour
  const handleListOfNames = (user, newDate, newHour) => {
    console.log('handleListOfNames')

    let {
      firstname,
      lastname,
      email,
      active,
      attempts,
      blocked,
      date_in,
      last_login,
      last_pass_changed,
      last_remember,
      permission_id,
      role,
      wait_until
    } = user

    // set date_in, date, hour and others values

    let obj = { 
      firstname,
      lastname,
      email, 
      active,
      attempts,
      blocked,
      date_in,
      date: newDate,
      hour: newHour,
      last_login,
      last_pass_changed,
      last_remember,
      permission_id,
      role,
      wait_until,
    }

    //console.log('obj', obj)

    setListOfNames(oldValues => [...oldValues, obj])
  }

  const handleGoBack = e => {
    //e.preventDefault()
    setShowAllUsers(!showAllUsers)
    
    let listOfAllUsersFromLocalStorage = JSON.parse(localStorage.getItem('listOfAllUsers'))
    
    if(listOfAllUsersFromLocalStorage !== listOfNames) {
      console.log('la lista ha cambiado')
      
      console.log('handleGoBack listOfNames', listOfNames)
      console.log('listOfAllUsersFromLocalStorage', listOfAllUsersFromLocalStorage)

      setListOfNames(listOfAllUsers)
    }
  }

  // tell us when everything is loaded
  useEffect(() => {
    if(listOfNames.length && pageCount) {
      setUsersWasLoaded(true)
    }
  }, [listOfNames, pageCount])

  // pass props to userFound component 
  const handleUserFound = item => {
    // hide all users to show just user found
    setShowAllUsers(!showAllUsers)

    console.log('item', item)
    console.log('item.date', item.date_in)
    console.log('item.date', item.date)
    console.log('item.hour', item.hour)

    // generate all user's found value
    let localUserFound = [
      item.firstname,
      item.lastname,
      item.email,
      item.role,
      item.date_in,
      item.date,
      item.hour,
      item.active,
      item.attempts,
      item.blocked,
      item.last_login,
      item.last_pass_changed,
      item.last_remember,
      item.permission_id,
      item.wait_until
    ]
    
    // set all the values to the global userFound state
    setUserFound(localUserFound)
  }

  /* useEffect(() => {
    console.log('pageCount/', pageCount)
  },[pageCount]) */

  // set pageCount for pagination
  useEffect(() => {
    //console.log('yeas firstRender', firstRender)
    // wait for load listOfNames and just the first time 
    if(listOfAllUsers) {
      if(listOfNames.length && pageCount == null) {
        console.log('pageCount*', Math.floor(listOfNames.length/10))
        console.log('setFirstRender paginate')
        setPageCount(Math.ceil(listOfNames.length/10))  
        
        setFirstRender(false)
      }
  
      // calculate the pageCount 
      let actualPageCount = Math.ceil(listOfAllUsers.length/10)
      console.log('listOfAllUsers.length', listOfAllUsers.length)
      console.log('actualPageCount', actualPageCount)
      //console.log('pageCount', pageCount)
      
      if(actualPageCount > pageCount && !firstRender) {
        console.log('less')
        setPageCount(pageCount+1)
        let data = { selected: 0 }
        handlePaginationClick(data)
      }
  
      if(actualPageCount < pageCount && !firstRender) {
        console.log('more')
        setPageCount(pageCount-1)
        let data = { selected: actualPageCount-1 }
        handlePaginationClick(data)
      }
    }
    
  }, [listOfNames])

  // Pagination handle
  const handlePaginationClick = data => {
    console.log('handlePaginationClick')

    console.log('data.selected', data.selected)
    console.log('pageCount', pageCount)
    let newSelected = data.selected
    let newOffset = Math.ceil(newSelected * 10)

    setOffset(newOffset)
    setSelected(newSelected)

    // erease the active generate by the delete user
    let liActiveDelete = document.querySelectorAll('.react-paginate > ul li.activeDelete')
    console.log('liActiveDelete', liActiveDelete)
    console.log('deleteToggle', deleteToggle)
    if(liActiveDelete[0] ) {
      if(deleteToggle) {
        liActiveDelete[0].classList.toggle('activeDelete')
        setDeleteToggle(false)
        return
      }
      setDeleteToggle(true)
    }
  }

  const handlePageActive = () => {
    console.log('handlePageActive')
  }
  return (
    <div>
      {/* Add User's modal */}
      <AddUser open={ open } setOpen={ setOpen }/> 
      
      {/* Dashdoard header */}
      <div className='header-dashboard-user' >
        {/* add btn */}
        {userRole === 0 ?
          <div className='plus-btn-add' onClick={ () => setOpen(true) }>
            <span className='plus-btn-tooltip'>add user</span>
            <BiPlusCircle size={ 32 } />
          </div>
          :''
        }
        
        {/* search  */}
        <div className='search-user'>
          {/* input - typeahead */}
          <Downshift 
            showAllUsers={ showAllUsers }
            handleUserFound={ handleUserFound }
            listOfNames={ /* listOfNames */listOfAllUsers }
          />
        </div>
      </div>

      {/* list of users */}
      <div className='dashboard-list'>
        {/* Header */}
        <div className='wrapper-list-header'>
          <span>Firstname</span>
          <span>Lastname</span>
          <span>Email</span>
          <span>Role</span>
          <span>Date</span>
          <span>Hour</span>
          <span>Accions</span>
        </div>
        
        { listOfAllUsers ? 
            usersWasLoaded ?
            <div>
              {showAllUsers 
                ? 
                  <ShowUsers
                    listOfAllUsers={ /* listOfNames */listOfAllUsers } /* listOfName is same of listOfAllUsers but have date and hour separated */
                    selected={ selected }
                    offset={ offset }
                    limit={ limit }
                  />
                  
                : <UserFound 
                    user={ userFound } 
                    showAllUsers={ showAllUsers } 
                    setShowAllUsers={ setShowAllUsers } 
                    setUserWasEdited={ setUserWasEdited }
                    userWasEdited={ userWasEdited }
                    handleGoBack={ handleGoBack }
                  /> 
              }

              {showAllUsers ?
                <div className='react-paginate'>
                  <ReactPaginate
                    previousLabel={ '<' }
                    nextLabel={ '>' }
                    breakLabel={'... ' }
                    breakClassName={ 'break-me' }
                    pageCount= { pageCount }
                    marginPagesDisplayed= { 3 }
                    pageRangeDisplayed= { 3 }
                    onPageChange= { handlePaginationClick }
                    onPageActive={ handlePageActive }
                    containerClassName={ 'pagination' }
                    activeClassName={ 'active' }
                  />
                </div>
              : ''}              
            </div> 

              /* loader animation component */
            : <DisappearedLoading color={'red'} style={{ margin: '75px auto' }}/>
          :<div>List of users empty</div>
        }
      </div>
    </div>
  )
}

export default Users