import {Routes, Route, Navigate} from 'react-router-dom'

import LoginPage from './components/LoginPage'
import Home from './components/Home'
import Transactions from './components/Transactions'
import Profile from './components/Profile'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import {StoreProvider}  from './context/storeContext'

import './App.css'

const App = () => {
  return(
    <StoreProvider>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route element={<ProtectedRoute/>}>
          <Route path="/" element={<Home/>} />
          <Route  path="/transactions" element={<Transactions/>}/>
          <Route  path="/profile" element={<Profile/>}/>
        </Route>
        <Route path="/not-found" element={<NotFound/>} />
      </Routes>
    </StoreProvider>
  )
}

export default App