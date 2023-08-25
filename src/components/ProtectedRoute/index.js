import {Route, Redirect} from 'react-router-dom'

import useCookieId from '../customHook/getUserId'
const ProtectedRoute = props => {
  const userId = useCookieId()
  if (userId === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}
export default ProtectedRoute