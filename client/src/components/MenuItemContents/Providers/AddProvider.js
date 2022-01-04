import React, { useState } from 'react'
import { makeStyles, Modal } from '@material-ui/core'
import Fade from '@material-ui/core/Fade'
import axios from '../../../axiosConfig'
import { validate } from 'react-email-validator'
import { useStateValue } from '../../../store/StateProvider'
import { actionTypes } from '../../../store/reducers/Reducer'
import { MdCancel } from 'react-icons/md'
import './Provider.css'

// position config 
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: '490px',
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

// modal styles
const useStyles = makeStyles( theme => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    // backgroundColor: 'red', 
    padding: theme.spacing(1, 0, 1, 2),
    color: 'white',
    textAlign: 'center',
  },
  paper: {
    position: 'absolute',
    width: 660,
    // height: 200, 
    //backgroundColor: theme.palette.background.paper,
    backgroundColor: 'white',
    border: '0px',
    borderRadius: '15px',
    outline: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(0, 0, 0),
  },
  form: {
    backgroundColor: 'white',
    height: 420,
    padding: theme.spacing(1, 3, 3, 3),
  }
}))

const AddProviders = ({ open, setOpen }) => {
  const [titleColor, setTitleColor]                 = useState(1)  
  const [providerName, setProviderName]             = useState('')
  const [providerActive, setProviderActive]         = useState(false)
  const [circuitName, setCircuitName]               = useState('')
  const [circuitIdentifier, setCircuitIdentifier]   = useState('')
  const [circuitHost, setCircuitHost]               = useState('')
  const [circuitPort, setCircuitPort]               = useState('')
  const [circuitActive, setCircuitActive]           = useState(false)
  const [circuitDescription, setCircuitDescription] = useState('')
  const [DDI, setDDI]                               = useState('')
  const [associateDDI, setAssociateDDI]             = useState('')
  const [DDIActive, setDDIActive]                   = useState(false)
  
  // modal state
  const [modalStyle] = useState(getModalStyle)
  const classes = useStyles()
  
  // reducer state 
  const [{ userRole }, dispatch] = useStateValue()

  // form state 
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [permission, setPermission] = useState('0')
  const [role, setRole] = useState('0')

  // add new user 
  const handleSubmit = e => {
    e.preventDefault()

    // validate email
    if(validate(email)) {

      let userData = {
        firstname:         firstname,
        lastname:          lastname,
        role_id:           role,
        email:             email.toLocaleLowerCase(),
        password:          password,
        active:            0,
        bloked:            0,
        attempts:          0,
        date_in:           null, 
        wait_until:        null,
        last_login:        null,
        last_pass_changed: null,
        last_remember:     null,
        permission_id:     permission
      }
  
      /* console.log(
        'firstname',       firstname, 
        '\nlastname',      lastname,
        '\nemail',         email, 
        '\npassword',      password, 
        '\nrole_id',       0, 
        '\npermission_id', permission 
      ) */
  
      axios.post('accounts/register', userData).then(res => {
        // show message
        //console.log('Success. User was added.', res.data.date, res.data.hour)
  
        // the backend give us the date_in
        let { date_in } = res.data
        
        // add date_in
        userData.date_in = date_in
        // change role_id name to role
        userData.role = parseInt(userData.role_id)
        delete userData.role_id

        // add date and hour
        userData.date = res.data.date
        userData.hour = res.data.hour 

        // format -> 2021-06-03 22:32:27
        //console.log('++userData', userData)
        // close modal
        setOpen(false)      
  
        // add the new user to localStorage
        // bring users's list
        let listOfAllUsers = JSON.parse(localStorage.getItem('listOfAllUsers'))
  
        // add the new one
        listOfAllUsers.push(userData)

        console.log('++new user added', listOfAllUsers)
  
        // convertir to json (array)
        let newListOfUsersFormatted = JSON.stringify(listOfAllUsers)
        
        // update localStorage  
        localStorage.setItem('listOfAllUsers', newListOfUsersFormatted)
  
        //console.log('listOfAllUsers', listOfAllUsers)
        //console.log('newListOfUsersFormatted', newListOfUsersFormatted)
  
        // update reducer (add the new user to the reducer)
        dispatch({
          type: actionTypes.SET_ALL_USERS,
          listOfAllUsers: listOfAllUsers
        })
  
        // reset values
        setFirstname('')
        setLastname('')
        setEmail('')
        setPassword('')
        setPermission(0)

      }).catch( err => alert(err.response.data.message) )
    } else {
      alert('Email format is wrong.')
    }
  }

  return (
    <div>
    {
      userRole === 0 
      ?
      <Modal className='add-admin-modal' open={ open } onClose={ () => setOpen(false) } >
        <Fade in={ open }>
        <div style={ modalStyle } className={ classes.paper }>
          
          <form className='provider-form' onSubmit={ handleSubmit }>
            <div style={{ display: 'flex' }}>
              <div className='provider-form-title'>Add Provider</div>
            </div>

            {/* left */}
            <div className='provider-form-left'>
              {/* PROVIDERS */}
              <div className='provider-section'>
                <div className={ `${'provider-title'} ${ titleColor === 0 ? ' redBg' : '' }` }>
                  <div>Provider</div>
                </div>
                <div className='provider-inputs'>
                  {/* name */}
                  <div className='provider-name'>
                    <label htmlFor='fProviderName'>Name: </label>
                    <select 
                      id='fProviderName'
                      name='fProviderName' 
                      className=''
                      value={ providerName }
                      onChange={ e => setProviderName(e.target.value) }>
                      <option value='option1'>option1</option>
                      <option value='option2'>option2</option>
                      <option value='option3'>option3</option>
                    </select>
                  </div>
                  {/* active */}
                  <div className='provider-active'>
                    <label htmlFor='fProviderActive' className='provider-input-label'>Active: </label>
                    <select 
                      id='fProviderActive'
                      name='fProviderActive' 
                      className=''
                      value={ providerActive }
                      onChange={ e => setProviderActive(e.target.value) }>
                      <option value='true'>true</option>
                      <option value='false'>false</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* DDIS */}
              {/* ddi name */}
              <div className='ddi-section'>
                <div className={ `${'ddi-title'} ${ titleColor === 0 ? ' redBg' : ''}` }>
                  <div>DDI</div>
                </div>
                <div className='ddi-inputs'>
                  <div className='ddi-inputs-left'>
                    {/* ddi principal */}
                    <div className='ddi-principal'>
                      <label htmlFor='fDDI' className='provider-input-label'>DDI: </label>
                      <input
                        id='fDDI' 
                        type='text'
                        className='provider-input-chart'
                        value={ DDI }
                        onChange={ e => setDDI(e.target.value) }
                      />
                    </div>
                    {/* ddi associate */}
                    <div className='ddi-associate'>
                      <label htmlFor='fDDIAssociate' className='provider-input-label'>Associate DDI: </label>
                      <input
                        id='fDDIAssociate' 
                        type='text'
                        className='provider-input-chart'
                        value={ associateDDI }
                        onChange={ e => setAssociateDDI(e.target.value) }
                      />
                    </div>
                  
                    
                  </div>
                  <div className='ddi-inputs-right'>
                    {/* active */}
                    <div className='ddi-active'>
                      <label htmlFor='fDDIActive' className='provider-input-label'>Active: </label>
                      <select 
                        id='fDDIActive'
                        name='fDDIActive' 
                        className=''
                        value={ DDIActive }
                        onChange={ e => setDDIActive(e.target.value) }>
                        <option value='true'>true</option>
                        <option value='false'>false</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* right */}
            <div>
              {/* CIRCUITS */}
              <div className='circuit-section'>
                <div className={ `${'circuit-title' } ${ titleColor === 0 ? ' redBg' : '' }` }>
                  <div>Circuit</div>
                </div>
                <div className='circuit-inputs'>
                  <div className='circuit-input-top'>
                    {/* left */}
                    <div className='circuit-inputs-left'>
                      {/* name */}
                      <div className='circuit-name'>
                        <label htmlFor='fCircuitName' className='provider-input-label'>Name: </label>
                        <select 
                          id='fCircuitName'
                          name='fCircuitName' 
                          className=''
                          value={ circuitName }
                          onChange={ e => setCircuitName(e.target.value) }>
                          <option value='option1'>option1</option>
                          <option value='option2'>option2</option>
                          <option value='option3'>option3</option>
                        </select>
                      </div>
                      {/* identifier */}
                      <div className='circuit-identifier'>
                        <label htmlFor='fCircuitIdentifier' className='provider-input-label'>Identifier: </label>
                        <input
                          id='fCircuitIdentifier' 
                          type='text'
                          className='provider-input-chart'
                          value={ circuitIdentifier }
                          onChange={ e => setCircuitIdentifier(e.target.value) }
                        />
                      </div>
                      {/* active */}
                      <div className='circuit-active'>
                        <label htmlFor='fCircuitActive' className='provider-input-label'>Active: </label>
                        <select 
                          id='fCircuitActive'
                          name='fCircuitActive' 
                          className=''
                          value={ circuitActive }
                          onChange={ e => setCircuitActive(e.target.value) }>
                          <option value='true'>true</option>
                          <option value='false'>false</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* right */}
                    <div className='circuit-inputs-right'>
                      {/* host */}
                      <div className='circuits-input-right'>
                        <div className='circuit-host'>
                          <label htmlFor='fCircuitHost' className='provider-input-label'>Host: </label>
                          <input
                            id='fCircuitHost' 
                            type='text'
                            className='provider-input-chart'
                            value={ circuitHost }
                            onChange={ e => setCircuitHost(e.target.value) }
                          />
                        </div>
                        {/* port */}
                        <div className='circuit-port'>
                          <label htmlFor='fCircuitPort' className='provider-input-label'>Port: </label>
                          <input
                            id='fCircuitPort' 
                            type='text'
                            className='provider-input-chart'
                            value={ circuitPort }
                            onChange={ e => setCircuitPort(e.target.value) }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='circuits-inputs-bottom'>
                    {/* description */}
                    <div className='circuit-description'>
                      <label htmlFor='fCircuitDescription' className='provider-input-label'>Description: </label>
                      <textarea 
                        id='fCircuitDescription' 
                        name='fCircuitDescription' 
                        rows='4' cols='85' 
                        placeholder='Make a description here...'
                        className='provider-input-chart'
                        value={ circuitDescription }
                        onChange={ e => setCircuitDescription(e.target.value) }
                      >
                      </textarea>
                    </div>
                  </div>
                  
                </div>
                {/* Send Btn */}
                <div className='btn-send-provider'>
                  <button className='btn-primary'>Send</button>
                </div>
              </div>
            </div>
            
          </form>   
        </div>
        </Fade>
        </Modal>
      :''
    }
    </div>
  )
}

export default AddProviders
