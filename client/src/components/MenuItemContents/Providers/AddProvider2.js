import React, { useState } from 'react'
import { IoIosArrowDropleft } from 'react-icons/io'
import axios from '../../../axiosConfig'
import './Provider.css'

const Providers = ({ open, setOpen }) => {
  const [titleColor, setTitleColor]                 = useState(0)  
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

  const handleSubmit = e => {
    e.preventDefault()

    console.log(
      'providerName', providerName,
      '\n providerActive', providerActive,
      '\n circuitName', circuitName,
      '\n circuitIdentifier', circuitIdentifier,
      '\n circuitHost', circuitHost,
      '\n circuitPort', circuitPort,
      '\n circuitDescription', circuitDescription,
      '\n circuitActive', circuitActive,
      '\n DDI', DDI,
      '\n associateDDI', associateDDI,
      '\n DDIActive', DDIActive,
    )

    // convert string to booleans
    providerActive === 'true' ? setProviderActive(true) : setProviderActive(false)
    circuitActive  === 'true' ? setCircuitActive(true)  : setCircuitActive(false)
    DDIActive      === 'true' ? setDDIActive(true)      : setDDIActive(false)

    let providerData = {
      providerName,
      providerActive,
      circuitName,
      circuitIdentifier,
      circuitHost,
      circuitPort,
      circuitDescription,
      circuitActive,
      DDI,
      associateDDI,
      DDIActive,
    }

    axios.post('providers/add', providerData)
    .then( res => {
      console.log('Provider was added.',res)
    })
    .catch(err => alert(err.response.data.message))
  }

  return (
    <div className=''>
      <div className='header-dashboard-user'>
        <div 
          onClick={ () => setOpen(!open)} 
          className='plus-btn-add'>
          <IoIosArrowDropleft size={ 32 } />
        </div>
      </div>
      {/* Add Users */}
      {
        /* (userRole === 'admin')  */
        true
        ? <div>
            <form className='provider-form' onSubmit={ handleSubmit }>
              <div style={{ display: 'flex' }}>
                <div className='provider-form-title'>Add Provider</div>

                {/* <div className='select-colors'>
                  <input 
                    type='radio' 
                    id='red' 
                    name='red' 
                    value='red' 
                    defaultChecked
                    onClick={ () => setTitleColor(0) }
                  />
                  <label for='red'>red</label>
                  <input 
                    type='radio' 
                    id='orange' 
                    name='orange' 
                    value='orange'
                    defaultChecked
                    onClick={ () => setTitleColor(1) }
                  />
                  <label for='orange'>orange</label>
                </div> */}
                
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
        :''
      }
    </div>
  )
}

export default Providers
