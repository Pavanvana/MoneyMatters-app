import {Route, Redirect} from 'react-router-dom'

import useUserId from '../CustomHook/getUserId'

interface Props{
  component: React.ComponentType<any> | any;
  exact: boolean
  path: string
}

const ProtectedRoute = (props: Props) => {
  const userId = useUserId()
  if (userId === undefined) {
    return <Redirect to ="/login"/>
  }
  return <Route {...props} />
}
export default ProtectedRoute