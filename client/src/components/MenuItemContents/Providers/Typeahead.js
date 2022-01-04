import React from 'react'
import Downshift from 'downshift'

const Typeahead = ({ handleUserFound, listOfNames }) => {
  const stateReducer = (state, changes) => {
    /* console.log('state', state)
    console.log('changes', changes) */

    /* if(state.selectedItem) {
      console.log('*****')
      console.log('state.selectedItem.firstname', state.selectedItem.firstname)
      console.log('changes.inputValue', changes.inputValue)
    } */
    switch (changes.type) {
      case Downshift.stateChangeTypes.clickItem:
        //console.log('clickedItem')
        state.selectedItem = null
        return {
          ...changes,
          inputValue: '',
          isOpen: false,
          //selectedItem: null
        }
      case Downshift.stateChangeTypes.keyDownEnter:
        return {
          ...changes,
          //isOpen: state.isOpen,
          //highlightedIndex: state.highlightedIndex,
        }
      default:
        return changes
    }
  }

  return (
    <div>
    <Downshift
      onChange={ selection => handleUserFound(selection) }
      stateReducer={ stateReducer }
      itemToString={ item => (item ? item.fir : '') }>
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
      }) => (
        /* search input */
        <div className='search-input-box' /* onClick={ selectedItem = null } */>
          <label { ...getLabelProps() }></label>
          <input { ...getInputProps() } 
            id='search-user-input'
            type='text'
            placeholder='Search by firstname...'
          />
          {isOpen ? (
            /* list of users to match */
            <div style={{ position: 'absolute' }}/*  isOpen={ !showAllUsers } */>

              {isOpen
                ? listOfNames
                  .filter(item => !inputValue || item.firstname.includes(inputValue))
                  .map((item, index) => (
                    /* individual user */
                    <div 
                      {...getItemProps({
                        key: Math.random(),
                        index,
                        item,
                        style: {
                          backgroundColor:
                            highlightedIndex === index ? '#F0F0F0' : 'white',
                          fontWeight: selectedItem === item ? 'bold' : 'normal',
                          padding: '15px',
                          cursor:
                            highlightedIndex === index ? 'pointer' : 'default',
                        },
                      })}
                      /* onChange={ () => { isOpen=false; selectedItem.firstname=null } } */
                      /* onChange={  } */
                      /* onClick={ () => setNewValue('you click it')} */>
                        { item.firstname }: { item.email }
                    </div>
                  ))
                : alert('Something went wrong. Refresh the page.')
              }
              {/* { console.log('isOpen', isOpen,
                            '\ninputValue', inputValue,
                            '\nselectedItem', selectedItem,
                            '\getItemProps', getItemProps )} */}
            </div>
          ) : null}
        </div>
      )}
  </Downshift>
  </div>
  )
}

export default Typeahead
