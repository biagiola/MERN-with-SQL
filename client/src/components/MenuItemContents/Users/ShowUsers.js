import React from 'react'
import ShowUser from './ShowUser'

const ShowUsers = ({ listOfAllUsers, selected, offset, limit }) => {
  console.log('selected', selected)
  console.log('offset', offset)
  //console.log('limit', limit)

  //console.log('listOfAllUsers++', listOfAllUsers)

  return (
    <div>
      {
        listOfAllUsers.slice(selected*10, offset+10).map( user => (
          <ShowUser 
            key={ Math.random() }
            firstname={ user.firstname }
            lastname={ user.lastname }
            email={ user.email }
            role={ user.role }
            date_in={ user.date_in }
            date={ user.date }
            hour={ user.hour }
            active={ user.active } />
        ))
      }
    </div>
  )
}

export default ShowUsers