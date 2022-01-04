import './App.css'
import { useStateValue } from './store/StateProvider'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Header from './components/Header/Header'
import Sidebar from './components/MenuItemContents/SideMenu/Sidebar'
import Users from './components/MenuItemContents/Users/Users'
import Providers from './components/MenuItemContents/Providers/Providers'
import Providers2 from './components/MenuItemContents/ProvidersOld/Providers'

import Login from './components/Login/Login'

import './components/Wrapper.css'

function App() {
  const [{ userFirstname }] = useStateValue()
  console.log('userFirstname', userFirstname)
  
  return (
    <BrowserRouter>
      <Route render={( {location} ) => (
        <Switch location={ location }>
          <Route exact path='/login' component={ Login } />
          <>
            <Header /> 
            <Sidebar/>
            <div className='wrapper'>
              <Route path='/dashboard' component={ Users } />
              <Route path='/providers' component={ Providers } />
              {/* <Route path='/analytics' component={ Providers2 } /> */}
              {  
                userFirstname
                ? 
                <Route path='/'>
                  <Redirect to='/dashboard' />
                </Route> 
                :
                <Route path='/'>
                  <Redirect to='/login' />
                </Route>
              }
            </div>
          </>
        </Switch>
      )}/>
    </BrowserRouter>
  )
}

export default App