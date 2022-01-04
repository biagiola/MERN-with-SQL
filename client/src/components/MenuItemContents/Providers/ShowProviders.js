import React from 'react'
import ShowProvider from './ShowProvider'

const ShowProviders = ({ 
  listOfProviders, 
  openDeleteUpdate, 
  setOpenDeleteUpdate, 
  selected, 
  offset, limit 
}) => {
  
  console.log('selected', selected)
  console.log('offset', offset)
  //console.log('limit', limit)

  //console.log('listOfAllUsers++', listOfAllUsers)

  return (
    <div>
      {
        listOfProviders.slice(selected*10, offset+10).map( provider => (
          <ShowProvider 
            key                 ={ provider.provider_id }
            openDeleteUpdate    ={ openDeleteUpdate }
            setOpenDeleteUpdate ={ setOpenDeleteUpdate }
            circuit_description ={ provider.circuit_description }
            circuit_host        ={ provider.circuit_host }
            circuit_id          ={ provider.circuit_id }
            circuit_identifier  ={ provider.circuit_identifier }
            circuit_name        ={ provider.circuit_name }
            circuit_port        ={ provider.circuit_port }
            circuit_active      ={ provider.circuit_active }
            date_in             ={ provider.date_in }
            ddi_active          ={ provider.ddi_active }
            ddi_associate       ={ provider.ddi_associate }
            ddi_id              ={ provider.ddi_id }
            ddi_principal       ={ provider.ddi_principal }
            provider_active     ={ provider.provider_active }
            provider_id         ={ provider.provider_id }
            provider_name       ={ provider.provider_name }
          />
        ))
      }
    </div>
  )
}

export default ShowProviders