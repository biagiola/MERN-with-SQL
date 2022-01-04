export const initialState = {
  userFirstname:    null,
  userLastname:     null,
  userEmail:        null,
  userRole:         null,
  userTimestamp:    null,
  userDate:         null,
  userHour:         null,
  listOfAllUsers:   [],
  listOfProviders:  [],
  providerSelected: []
}

// if there are users value in the storage
const firstname        = JSON.parse(localStorage.getItem('userFirstname'))
const lastname         = JSON.parse(localStorage.getItem('userLastname'))
const email            = JSON.parse(localStorage.getItem('userEmail'))
const role             = JSON.parse(localStorage.getItem('userRole')) 
const date             = JSON.parse(localStorage.getItem('userTimestamp'))
const listOfAllUsers   = JSON.parse(localStorage.getItem('listOfAllUsers'))
const listOfAdmins     = JSON.parse(localStorage.getItem('listOfAdmins'))
const listOfUsers      = JSON.parse(localStorage.getItem('listOfUsers'))
const listOfProviders  = JSON.parse(localStorage.getItem('listOfProviders'))
const providerSelected = JSON.parse(localStorage.getItem('providerSelected'))

//console.log('listOfAllUsers', listOfAllUsers)

// set users values coming from localstorage (when we refresh the page - F5)
firstname         ? initialState.userFirstname    = firstname        : initialState.userFirstname     = null 
lastname          ? initialState.userLastname     = lastname         : initialState.userLastname      = null 
email             ? initialState.userEmail        = email            : initialState.userEmail         = null 
// admin role code is 0, that is a falsy value so...    
role || role===0  ? initialState.userRole         = role             : initialState.userRole          = null 
date              ? initialState.userTimestamp    = date             : initialState.userTimestamp     = null 
listOfAllUsers    ? initialState.listOfAllUsers   = listOfAllUsers   : initialState.listOfAllUsers    = null 
listOfAdmins      ? initialState.listOfAdmins     = listOfAdmins     : initialState.listOfAdmins      = null 
listOfUsers       ? initialState.listOfUsers      = listOfUsers      : initialState.listOfUsers       = null 
listOfProviders   ? initialState.listOfProviders  = listOfProviders  : initialState.listOfProviders   = null 
providerSelected  ? initialState.providerSelected = providerSelected : initialState.providerSelected  = null 


export const actionTypes = {
  SET_FIRSTNAME:         'SET_FIRSTNAME',
  SET_LASTNAME:          'SET_LASTNAME',
  SET_EMAIL:             'SET_EMAIL',
  SET_ROLE:              'SET_ROLE',
  SET_TIMESTAMP:         'SET_TIMESTAMP',
  SET_DATE:              'SET_DATE',
  SET_HOUR:              'SET_HOUR',
  SET_ALL_USERS:         'SET_ALL_USERS',
  SET_ADMINS:            'SET_ADMINS',
  SET_USERS:             'SET_USERS',
  SET_PROVIDERS:         'SET_PROVIDERS',
  SET_PROVIDER_SELECTED: 'SET_PROVIDER_SELECTED',
  DELETE_USER:           'DELETE_USER',
  DELETE_ADMIN:          'DELETE_ADMIN',
}

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_FIRSTNAME:
      return {
        ...state,
        userFirstname: action.userFirstname
      }

    case actionTypes.SET_LASTNAME:
    return {
      ...state,
      userLastname: action.userLastname
    }

    case actionTypes.SET_EMAIL:
      return {
        ...state,
        userEmail: action.userEmail
      }

    case actionTypes.SET_ROLE:
      return {
        ...state,
        userRole: action.userRole
      }

    case actionTypes.SET_TIMESTAMP:
      return {
        ...state,
        userTimestamp: action.userTimestamp
      }

    case actionTypes.SET_DATE:
      return {
        ...state,
        userDate: action.userDate
      }

    case actionTypes.SET_HOUR:
      return {
        ...state,
        userHour: action.userHour
      }

    case actionTypes.SET_ALL_USERS:
      return {
        ...state,
        listOfAllUsers: action.listOfAllUsers
      }

    case actionTypes.SET_ADMINS:
      return {
        ...state,
        listOfAdmins: action.listOfAdmins
      }

    case actionTypes.SET_USERS:
      return {
        ...state,
        listOfUsers: action.listOfUsers
      }

    case actionTypes.SET_PROVIDERS:
      return {
        ...state,
        listOfProviders: action.listOfProviders
      }

    case actionTypes.SET_PROVIDER_SELECTED:
      return {
        ...state,
        providerSelected: action.providerSelected
      }

    case actionTypes.DELETE_USER:
      return {
        ...state,
        listOfAllUsers: action.listOfUsersUpdated
    }

    default:
      return state
  }
}

export default reducer