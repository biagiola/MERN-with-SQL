import React, { useState, useEffect } from 'react'
import { BiEditAlt, BiTrash } from 'react-icons/bi'
import { BsEye } from 'react-icons/bs'
import EditUserModal from './EditProvider'
import DeleteUserModal from './DeleteProvider'
import axios from '../../../axiosConfig'
import { actionTypes } from '../../../store/reducers/Reducer'
import { useStateValue } from '../../../store/StateProvider'
import './Provider.css'

const ShowProvider = ({ 
  openDeleteUpdate,
  setOpenDeleteUpdate,
  circuit_description,
  circuit_host,
  circuit_id,
  circuit_identifier,
  circuit_name,
  circuit_port,
  circuit_active,
  date_in,
  ddi_active,
  ddi_associate,
  ddi_id,
  ddi_principal,
  provider_active,
  provider_id,
  provider_name
 }) => {
  const [, dispatch] = useStateValue()

  const [toggleEdit, setToggleEdit] = useState(false)
  const [toggleDelete, setToggleDelete] = useState(false)
  const [userDataChangedFirsname, setUserDataChangedFirstname] = useState(true)
  const [userDataChangedLastname, setUserDataChangedLastname] = useState(true)
  //const [newFirstname, setNewFirstname] = useState(firstname)
  //const [newLastname, setNewLastname] = useState(lastname)

  /* useEffect(() => {
    console.log('ROLE//', firstname, role)
  }, [role]) */

  /* Edit */
  const handleEdit = e => {
    e.preventDefault()
    console.log('handleEdit')

    // close edit box
    /* setToggleEdit(!toggleEdit)

    // if user data changed show the new values
    if(firstname !== newFirstname) {
      setUserDataChangedFirstname(false)
    }
    if(lastname !== newLastname) {
      setUserDataChangedLastname(false)
    }
    
    // set user data
    let newUserData = {
      firstname: newFirstname,
      lastname: newLastname,
      // email: newEmail,
      email: email,
      // role: newRoll 
      role_id: role
    }
    //console.log('handleSubmit', newUserData)

    axios.put('accounts/update', newUserData).then( result => {
      // update LocalStorage   
      // get array variables to be updated (firstname and lastname) 
      let oldValues = JSON.parse(localStorage.getItem('listOfAllUsers'))

      console.log('oldValues', oldValues)
      
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

      console.log('after axios put date', date)

      // create newValue to be updated
      let newValue = {
        firstname: newFirstname,
        lastname: newLastname,
        active: active,
        date_in: date_in,
        date: date,
        hour: hour,
        email: email,
        role: role
      }

      // overwrite
      oldValues[index] = newValue

      // update
      localStorage.setItem('listOfAllUsers', JSON.stringify(oldValues))

    }).catch(err => console.log(err)) */
  }
  
  /* Delete */
  const handleDelete = e => {
    e.preventDefault()

    // close the modal
    /* setToggleDelete(false)

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

      // filter 
      let filteredValues = listOfAllUsers.filter(user => {
        return user.email !== email
      })

      // convertir to json (array)
      let filteredValuesStringify = JSON.stringify(filteredValues)

      //console.log('filteredValues', filteredValues)
      //console.log('filteredValuesStringify', filteredValuesStringify)

      // update localStorage  
      localStorage.setItem('listOfAllUsers', filteredValuesStringify)

      // update reducer
      dispatch({
        type: actionTypes.SET_ALL_USERS,
        listOfAllUsers: filteredValues
      })

      // change the active li of the pagination
      // select element
      console.log('holis33')
      let liActive = document.querySelectorAll('.react-paginate > ul li.active')
      let liNewActive = document.querySelectorAll('.react-paginate > ul li')

      console.log('liActive33', liActive)
      console.log('liNewActive33', liNewActive)
      
      // erase active classname
      liActive[0].classList.toggle('active') 
      
      // el antepenultimo (incluyendo los li de < y > ) pasa a ser el ultimo
      liNewActive[liNewActive.length-3].classList.toggle('activeDelete') 

      console.log('liActive33*', liActive)
      console.log('liNewActive33*', liNewActive)

      
    }).catch(err => console.log(err)) */

  }

  const handleDeleteUpdate = () => {
    setOpenDeleteUpdate(!openDeleteUpdate)

    let providerSelected = {
      openDeleteUpdate,
      setOpenDeleteUpdate,
      circuit_description,
      circuit_host,
      circuit_id,
      circuit_identifier,
      circuit_name,
      circuit_port,
      circuit_active,
      date_in,
      ddi_active,
      ddi_associate,
      ddi_id,
      ddi_principal,
      provider_active,
      provider_id,
      provider_name
    }

    // save to reducer
    dispatch({
      type: actionTypes.SET_PROVIDER_SELECTED,
      providerSelected: providerSelected
    })

    // save to localstorage
    let providerSelectedJSON = JSON.stringify(providerSelected)
    localStorage.setItem('providerSelected', providerSelectedJSON)
  }

  return (
    <div onClick={ () => handleDeleteUpdate() }>
      {/* user data */}
      <div className='wrapper-provider-content'>
        <div className='wrapper-provider-providerContent'>
          <span>{ provider_id }</span>
          <span>{ provider_name }</span>
          <span>{ provider_active }</span>
        </div>
        <div className='wrapper-provider-ddiContent'>
          {/* <span>{ ddi_id }</span> */}
          <span>{ ddi_principal }</span>
          <span>{ ddi_associate }</span>
          <span>{ ddi_active }</span>
        </div>
        <div className='wrapper-provider-circuitContent'>
          {/* <span>{ circuit_id }</span> */}
          <span>{ circuit_name }</span>
          <span>{ circuit_identifier }</span>
          <span>{ circuit_host }</span>
          <span>{ circuit_port }</span>
          <span>{ circuit_active }</span>
        </div>
      </div>
    </div>
  )
}

export default ShowProvider