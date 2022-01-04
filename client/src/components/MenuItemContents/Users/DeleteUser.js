import React, { useState } from 'react'
import { makeStyles, Modal } from '@material-ui/core'
import Fade from '@material-ui/core/Fade'
import { MdCancel } from 'react-icons/md'
import './User.css'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: '280px',
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
    height: 210,
    padding: theme.spacing(1, 3, 3),
  },
  deleteBtns: {
    display: 'flex',
    justifyContent: 'space-evenly'
  }
}))

const DeleteUser = ({ email, open, setOpen, handleDelete }) => {
  // modal's state
  const [modalStyle] = useState(getModalStyle)
  const classes = useStyles()

  console.log('DeleteUser')

  return (
    <div>
      <Modal className='delete-user-modal' open={ open } onClose={ () => setOpen(false) }>
        <Fade in={ open }>
        <div style={ modalStyle } className={ classes.paper }>

          <div className='' /* onSubmit={ handleDelete } */>
            <div className={ classes.header }>
              <div></div>
              {/* title */}
              <div className={ classes.title }>Delete User</div>
              {/* close btn */}
              <div className='edit-user-closebtn'>
                <MdCancel 
                  onClick={ () => setOpen(false) }
                  size={18} />
              </div>
            </div>

            <div className={ classes.form }>
              <div 
                style={{ marginTop: '15px', cursor: 'default'  }}>
                Delete user: { email }
              </div>
              <div
                style={{ marginTop: '15px', fontWeight: 500, cursor: 'default' }}>
                Are you sure?
              </div>
              <div className={ classes.deleteBtns }>
                <div 
                  style={{ marginTop: '65px', paddingLeft: '24px', paddingRight: '24px' }}
                  className='btn btn-delete'
                  onClick={ () => setOpen(false) }>No</div>
                <div 
                  style={{ marginTop: '65px', paddingLeft: '24px', paddingRight: '24px' }}
                  className='btn btn-delete'
                  onClick={ handleDelete }>Yes</div>
              </div>
            </div> 
          </div>
        </div>
        </Fade>
      </Modal>
    </div>
  )
}

export default DeleteUser