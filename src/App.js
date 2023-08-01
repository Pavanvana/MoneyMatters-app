import { Component } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import LoginPage from './components/LoginPage'
import Home from './components/Home'
import Transactions from './components/Transactions'
import Profile from './components/Profile'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

import changeTabContex from './contex/ActiveTabContext'

import './App.css'

class App extends Component{
  state = {
    activeTab : "dashboard"
  }

  changeTab = tab => {
    this.setState({activeTab: tab})
  }

  render(){
    const {activeTab} = this.state
    return(
      <changeTabContex.Provider 
        value={{
          activeTab,
          changeTab: this.changeTab,
        }}
      >
      <Switch>
        <Route  exact path="/login" component={LoginPage} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/transactions" component={Transactions}/>
        <ProtectedRoute exact path="/profile" component={Profile}/>
        <Route path="/not-found" component={NotFound} />
        <Redirect to="not-found" />
    </Switch>
    </changeTabContex.Provider>
    )
  }
}

export default App