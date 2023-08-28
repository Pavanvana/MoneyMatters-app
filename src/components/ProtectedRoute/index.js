import {Route, Redirect} from 'react-router-dom'

import useUserId from '../customHook/getUserId'

const ProtectedRoute = props => {
  const userId = useUserId()
  if (userId === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}
export default ProtectedRoute