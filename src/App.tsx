import {Switch, Route, Redirect} from 'react-router-dom'

import LoginPage from './components/LoginPage'
import Home from './components/Home'
import Transactions from './components/Transactions'
import Profile from './components/Profile'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'


import './App.css'

const App = () => {
  return(
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/transactions" component={Transactions}/>
      <ProtectedRoute exact path="/profile" component={Profile}/>
      <Route path="/not-found" component={NotFound} />
      <Redirect to="not-found" />
  </Switch>
  )
}

export default App