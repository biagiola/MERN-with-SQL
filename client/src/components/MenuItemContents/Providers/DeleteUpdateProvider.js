import React, { useEffect, useState } from 'react'
import { actionTypes } from '../../../store/reducers/Reducer'
import { useStateValue } from '../../../store/StateProvider'
import { FaCircle } from 'react-icons/fa'
import DeleteProvider from './DeleteProvider'
import axios from '../../../axiosConfig'

const DeleteUpdateProvider = ({ openDeleteUpdate, setOpenDeleteUpdate }) => {
  const [{ userRole, providerSelected }, dispatch] = useStateValue()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)

  useEffect(() => {
    //console.log('providerSelected', providerSelected)
    //console.log('len', providerSelected.length)
  }, [providerSelected])

  const handleDelete = () => {
    console.log('handleDelete')
    
    // close modal
    setOpenDeleteModal(false)

    let providerData = {
      provider_id: providerSelected.provider_id,
      role_id: userRole
    }

    axios.delete('providers/delete', {
      data: { source: providerData }
    }).then( res => {
      console.log('res', res)

      //delete user from localStorage
      let listOfProviders = JSON.parse(localStorage.getItem('listOfProviders'))
      console.log('listOfProviders*', listOfProviders)
      // filter
      let filteredProviders = listOfProviders.filter(provider => {
        return provider.provider_id !== providerSelected.provider_id
      })

      // convert to json (array)
      let filteredProvidersStringify = JSON.stringify(filteredProviders)

      console.log('filteredProviders', filteredProviders)
      console.log('filteredProvidersStringify', filteredProvidersStringify)

      // update localStorage
      localStorage.setItem('listOfProviders', filteredProvidersStringify)

      // update reducer - provider's list
      dispatch({
        type: actionTypes.SET_PROVIDERS,
        listOfProviders: filteredProviders
      })

      // update reducer - providerSelected
      dispatch({
        type: actionTypes.SET_PROVIDER_SELECTED,
        providerSelected: null
      })

      // clear the localstorage
      localStorage.setItem('providerSelected', null)

      // go back to the list of providers
      setOpenDeleteUpdate(true)
    })
    .catch(err => console.log(err/* .response.data.message */))
    
  }

  return (
    providerSelected ?
    <div className='wrapper-provider-selected box'>
      <div >
        {/* Header */}
        <div className='provider-selected-maintitle'>
          <div>Provider Details</div>
        </div>
        {/* Btn */}
        <div className='provider-selected-btn-content'>
          <div>
            <div className='btn-secondary-orange'>update</div>
          </div>
          <div>
            <div 
              className='btn-secondary-red'
              onClick={ () => setOpenDeleteModal(true) }>Delete</div>
          </div>
        </div>
        {/* Data */}
        <div className='wrapper-provider-selected-data'>
          {/* Left */}
          <div className='wrapper-provider-selected-left'>
            <div>
              <div className='provider-selected-subtitle'>Provider</div>
            </div>
            <div>
              <div className='provider-selected'>
                <div className='provider-selected-active'>
                  active: 
                  {providerSelected.provider_active === 1 
                    ? <FaCircle color={'green'}/>
                    : <FaCircle color={'red'}  />}
                </div>
                <div>id: {providerSelected.provider_id}</div>
                <div>name: {providerSelected.provider_name}</div>  
              </div>
            </div>
            <div>
              <div className='provider-selected-subtitle'>DDI</div>
            </div>
            <div>
              <div className='ddi-selected'>
                <div className='provider-selected-active'>
                  active: 
                  {providerSelected.provider_active === 1 
                    ? <FaCircle color={'green'}/>
                    : <FaCircle color={'red'}  />}</div>
                <div>associate: {providerSelected.ddi_associate}</div>
                {/* <div>id: {providerSelected.ddi_id}</div> */}
                <div>principal: {providerSelected.ddi_principal}</div>  
              </div>
            </div>
          </div>
          {/* Right */}
          <div className='wrapper-provider-selected-right'>
            <div>
              <div>
                <div className='provider-selected-subtitle'>Circuit</div>
              </div>
              <div className='circuit-selected'>
                <div className='provider-selected-active'>
                  active: 
                  {providerSelected.provider_active === 1 
                    ? <FaCircle color={'green'}/>
                    : <FaCircle color={'red'}  />}
                </div>
                <div>host: {providerSelected.circuit_host}</div>
                {/* <div>id: {providerSelected.circuit_id}</div> */}
                <div>identifier: {providerSelected.circuit_identifier}</div>
                <div>name: {providerSelected.circuit_name}</div>
                <div>port: {providerSelected.circuit_port}</div>  
                <div>date: {providerSelected.date_in}</div>
                <div>description: {providerSelected.circuit_description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="go-back-selected">
        <div 
          className="btn-primary"
          onClick={ () => setOpenDeleteUpdate(!openDeleteUpdate) }
        >Go Back</div>
      </div>

      {/* Modals */}
      {openDeleteModal 
        ? <DeleteProvider 
          handleDelete={ handleDelete }
          setOpenDeleteModal={ setOpenDeleteModal }
          openDeleteModal={ openDeleteModal } /> 
        : ''}
    </div> : ''
  )
}

export default DeleteUpdateProvider
