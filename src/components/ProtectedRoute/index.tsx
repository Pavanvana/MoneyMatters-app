import { Navigate, Outlet} from 'react-router-dom'

import useUserId from '../CustomHook/getUserId'


const ProtectedRoute = () => {
  const userId = useUserId()
  return userId === undefined ? <Navigate to ="/login"/> : <Outlet />
}
export default ProtectedRoute