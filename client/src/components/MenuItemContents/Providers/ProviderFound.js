import React, { useState, useEffect } from 'react'
import EditUserModal from './EditProvider'
import DeleteUserModal from './DeleteProvider'
import axios from '../../../axiosConfig'
import { actionTypes } from '../../../store/reducers/Reducer'
import { useStateValue } from '../../../store/StateProvider'
import { BiEditAlt, BiTrash } from 'react-icons/bi'
import { BsEye } from 'react-icons/bs'

function UserFound({ user, setShowAllUsers, showAllUsers, setUserWasEdited, userWasEdited, handleGoBack }) {
  const [, dispatch] = useStateValue()

  const [
    firstname, 
    lastname, 
    email, 
    role,
    date_in, // original timestamp 
    date, 
    hour,     //firtname  lastname  email     role     date_in  date     hour     active
    active] = [  user[0],  user[1],  user[2], user[3], user[4], user[5], user[6], user[7] ]
  
    // togglers modals 
  const [toggleEdit, setToggleEdit] = useState(false)
  const [toggleDelete, setToggleDelete] = useState(false)
  const [userDataChangedFirsname, setUserDataChangedFirstname] = useState(true)
  const [userDataChangedLastname, setUserDataChangedLastname] = useState(true)
  const [answer, setAnswer] = useState(false)
  // state for the edit modal 
  const [newFirstname, setNewFirstname] = useState(firstname)
  const [newLastname, setNewLastname] = useState(lastname)

  useEffect(() => {
    console.log('role', role)
    console.log('date_in', date_in)
    console.log('date', date)
    console.log('hour', hour)
    console.log('active', active)
  }, [])

  /* Edit */
  const handleEdit = e => {
    e.preventDefault()
    console.log('handleEdit')

    // close edit box
    setToggleEdit(!toggleEdit)

    // if user data changed show the new values
    if(firstname !== newFirstname) {
      setUserDataChangedFirstname(false)
    }
    if(lastname !== newLastname) {
      setUserDataChangedLastname(false)
    }
    
    // update user data in the db
    let newUserData = {
      firstname: newFirstname,
      lastname: newLastname,
      email: email,
      role_id: role
    }
    //console.log('handleSubmit', newUserData)

    axios.put('accounts/update', newUserData).then( result => {
      // update LocalStorage      
      let oldValues = JSON.parse(localStorage.getItem('listOfAllUsers'))

      let index = 0
      // search the index of element to edit
      for (let i = 0; i < oldValues.length; i++) {
        console.log('i', i)
        if(oldValues[i].email === email) {
          console.log('i***', i)
          index = i
          break
        }
      }

      // create object with the new values
      let newValue = {
        firstname: newFirstname,
        lastname: newLastname,
        email: email,
        date_in: date_in,
        role,
        date: date,
        hour: hour,
        active,
      }

      console.log('INDEX*', index)

      // overwrite 
      oldValues[index] = newValue

      console.log('oldValues', oldValues)

      // update
      localStorage.setItem('listOfAllUsers', JSON.stringify(oldValues))

      setUserWasEdited(!userWasEdited) 
      dispatch({
        type: actionTypes.SET_ALL_USERS,
        listOfAllUsers: oldValues
      })     

    }).catch(err => console.log(err))
  }
  
  /* Delete */
  const handleDelete = e => {
    e.preventDefault()

    // close the modal
    setToggleDelete(false)

    let userData = {
      email: email,
      role_id: role
    }

    //console.log('userData', userData)

    axios.delete('accounts/delete', {
      data: { source: userData }
    }).then(res => {
      console.log('res', res.data.message)
      /// delete user from localStorage too
      
      // bring admin's list
      let listOfAllUsers = JSON.parse(localStorage.getItem('listOfAllUsers'))

      //console.log('listOfAllUsers', listOfAllUsers)

      // filter 
      let filteredValues = listOfAllUsers.filter(user => {
        return user.email !== email;
      })

      // convertir to json (array)
      let filteredValuesArray = JSON.stringify(filteredValues)

      //console.log('filteredValues', filteredValues)
      //console.log('filteredValuesArray', filteredValuesArray)

      // update localStorage  
      localStorage.setItem('listOfAllUsers', filteredValuesArray)

      // update reducer
      dispatch({
        type: actionTypes.DELETE_USER,
        listOfUsersUpdated: filteredValues
      })

      // go back to the previous list of all users
      setShowAllUsers(!showAllUsers)


      // change the active li of the pagination
      // select element
      console.log('holis31')
      let liActive = document.querySelectorAll('.react-paginate > ul li.active')
      let liNewActive = document.querySelectorAll('.react-paginate > ul li')

      console.log('liActive31', liActive)
      console.log('liNewActive31', liNewActive)
      console.log('liNewActive.length31', liNewActive.length)

      // erase active classname
      liActive[0].classList.toggle('active') 
      liNewActive[liNewActive.length-3].classList.toggle('activeDelete') 
      
      // el antepenultimo (incluyendo los li de < y > ) pasa a ser el ultimo
      //liNewActive[liNewActive.length-3].classList.toggle('activeDelete') 

      console.log('liActive31*', liActive)
      console.log('liNewActive31*', liNewActive)
      

      
    }).catch(err => console.log(err))

  }

  return (
    <div>
      <div className='wrapper-list'>
        <span>{ userDataChangedFirsname ? firstname : newFirstname }</span>
        <span>{ userDataChangedLastname ? lastname : newLastname }</span>
        <span>{ email }</span>
        <span>{ role === 0 ? 'Admin' : 'User' }</span>
        <span>{ date }</span>
        <span>{ hour }</span>
        <span style={{ marginTop: '-6px' }}>
          <div className='btns-accions'>
            {/* details */}
            <div className='btn btn-details'>
              <BsEye /* onClick={ handleBrowse } */ style={{ cursor: 'pointer' }}/>
              <span className='btn-description'>Details</span>
            </div>
            
            {/* update */}
            <div className='btn btn-edit' onClick={ () => setToggleEdit(!toggleEdit) }>
              <BiEditAlt style={{ cursor: 'pointer' }}/>
              <span className='btn-description' >Update</span>
            </div>
            
            {/* delete */}
            <div className='btn btn-delete' onClick={ () => setToggleDelete(true) }>
              <BiTrash  style={{ cursor: 'pointer'} }/>
              <span className='btn-description'>Delete</span>
            </div>
          </div>
        </span>
      </div>  

      {/* Go back btn */}
      <div>
        <button 
          onClick={ handleGoBack }
          className='btn-primary'
          style={{ marginTop: 20 }}>Back</button>
      </div>

      {/* edit modal */}
      { toggleEdit ? 
        <EditUserModal 
          open={ toggleEdit } 
          setOpen={ setToggleEdit }
          newFirstname={ newFirstname }
          setNewFirstname={ setNewFirstname }
          newLastname={ newLastname }
          setNewLastname={ setNewLastname }
          handleEdit={ handleEdit } /> 
        : ''
      }
      
      {/* delete modal */}
      { toggleDelete ? 
        <DeleteUserModal 
          name={ firstname }
          email={ email }
          open={ toggleDelete } 
          setOpen={ setToggleDelete }
          answer={ answer }  
          setAnswer={ setAnswer } 
          handleDelete={ handleDelete } /> 
        : ''
      }
    </div>
  )
}

export default UserFound
