import { Navigate, Outlet} from 'react-router-dom'

import useUserId from '../../hooks/useUserId'


const ProtectedRoute = () => {
  const userId = useUserId()
  return userId === undefined ? <Navigate to ="/login"/> : <Outlet />
}
export default ProtectedRoute