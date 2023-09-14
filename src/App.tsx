import {Routes, Route} from 'react-router-dom'
import { LOG_IN_PATH, HOME_PATH, TRANSACTIONS_PATH, PROFILE_PATH, NOT_FOUND_PATH } from './constants/NavigationConstants'

import LoginPage from './components/LoginPage/LoginPage'
import Home from './components/Home/Home'
import Transactions from './components/Transactions/Transactions'
import Profile from './components/Profile/Profile'
import NotFound from './components/NotFound/NotFound'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import {StoreProvider}  from './context/storeContext'

import './App.css'

const App = () => {
  return(
    <StoreProvider>
      <Routes>
        <Route path={LOG_IN_PATH} element={<LoginPage/>} />
        <Route element={<ProtectedRoute/>}>
          <Route path={HOME_PATH} element={<Home/>} />
          <Route  path={TRANSACTIONS_PATH} element={<Transactions/>}/>
          <Route  path={PROFILE_PATH} element={<Profile/>}/>
        </Route>
        <Route path={NOT_FOUND_PATH} element={<NotFound/>} />
      </Routes>
    </StoreProvider>
  )
}

export default App