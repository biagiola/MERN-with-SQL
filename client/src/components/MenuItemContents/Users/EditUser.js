import React, { useState } from 'react'
import { makeStyles, Modal } from '@material-ui/core'
import Fade from '@material-ui/core/Fade'
import { MdCancel } from 'react-icons/md'
import './User.css'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: '330px',
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}
// modal's styles
const useStyles = makeStyles( theme => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    padding: theme.spacing(1, 0, 1, 2),
    color: 'white',
    textAlign: 'center',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: 'white',
    border: '0px',
    borderRadius: '15px',
    outline: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(0, 0, 0),
  },
  form: {
    backgroundColor: 'white',
    height: 255,
    padding: theme.spacing(1, 3, 3),
  },
  inputBox: {
    padding: 5
  },
  input: {
    padding: 8,
    marginTop: 5
  },
  btn: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 15
  }
}))

const EditUser = ({ open, setOpen, newFirstname, setNewFirstname, newLastname, setNewLastname, handleEdit }) => {
  // modal's state
  const [modalStyle] = useState(getModalStyle)
  const classes = useStyles()

  //console.log('EditUser')

  return (
    <div>
    <Modal className='edit-user-modal' open={ open } onClose={ () => setOpen(false) }>
      <Fade in={ open }>
      <div style={ modalStyle } className={ classes.paper }>

        <form className='' onSubmit={ handleEdit }>
          <div className={ classes.header }>
            <div></div>
            {/* title */}
            <div className={ classes.title }>Edit User</div>
            {/* close btn */}
            <div className='edit-user-closebtn'>
              <MdCancel 
                onClick={ () => setOpen(false) }
                size={18} />
            </div>
          </div>

          <div className={ classes.form }>
            {/* Firstname */}
            <div className={['box-input', classes.inputBox].join(' ')} >
              <label htmlFor='fFirstname'>Firstname:  </label>
              <input 
                type='text'
                id='fFirstname'
                name='fFirstname'
                className={ classes.input }
                value={ newFirstname }
                onChange={ e => setNewFirstname(e.target.value) }
              />
            </div>  
            
            {/* Lastname */}
            <div className='box-input'>
              <label htmlFor='fLastname'>Lastname:  </label>
              <input 
                type='text'
                id='fLastname'
                name='fLastname'
                className={ classes.input }
                value={ newLastname }
                onChange={ e => setNewLastname(e.target.value) }
              />
            </div>
            
            <div className={ classes.btn }>
              <button 
                className={'btn btn-edit'}>Update</button>
            </div>
          </div> 
        </form>
      </div>
      </Fade>
    </Modal>
    </div>
  )
}

export default EditUser
