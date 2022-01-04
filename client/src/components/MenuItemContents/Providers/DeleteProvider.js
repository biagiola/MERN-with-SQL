import React, { useState } from 'react'
import { makeStyles, Modal } from '@material-ui/core'
import Fade from '@material-ui/core/Fade'
import { MdCancel } from 'react-icons/md'
import './Provider.css'

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
  deleteToast: {
    paddingTop: '35px', 
    fontWeight: 500, 
    cursor: 'default',
    textAlign: 'center',
    color: '#2b2b2b'
  },
  deleteBtns: {
    display: 'flex',
    justifyContent: 'space-evenly'
  }
}))

const DeleteProvider = ({ openDeleteModal, setOpenDeleteModal, handleDelete }) => {
  // modal's state
  const [modalStyle] = useState(getModalStyle)
  const [open/* , setopen */] = useState(openDeleteModal)
  const classes = useStyles()

  console.log('DeleteProvider')

  return (
    <div>
      <Modal className='delete-user-modal' open={ openDeleteModal } onClose={ () => setOpenDeleteModal(false) }>
        <Fade in={ openDeleteModal }>
        <div style={ modalStyle } className={ classes.paper }>

          <div className='' /* onSubmit={ handleDelete } */>
            <div className={ classes.header }>
              <div></div>
              {/* title */}
              <div className={ classes.title }>Delete Provider</div>
              {/* close btn */}
              <div className='edit-user-closebtn'>
                <MdCancel 
                  onClick={ () => setOpenDeleteModal(false) }
                  size={18} />
              </div>
            </div>

            <div className={ classes.form }>
              {/* <div 
                style={{ marginTop: '15px', cursor: 'default'  }}>
                Delete user: { 'email' }
              </div> */}
              <div
                className={ classes.deleteToast }
                style={{  }}>
                Are you sure?
              </div>
              <div className={ classes.deleteBtns }>
                <div 
                  style={{ marginTop: '40px', paddingLeft: '24px', paddingRight: '24px' }}
                  className='btn btn-delete'
                  onClick={ () => setOpenDeleteModal(false) }>No</div>
                <div 
                  style={{ marginTop: '40px', paddingLeft: '24px', paddingRight: '24px' }}
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

export default DeleteProvider