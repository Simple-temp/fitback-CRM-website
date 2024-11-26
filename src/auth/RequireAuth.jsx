import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/loaders';
import { useAuthContext } from './useAuthContext';

const RequireAuth = () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const userParse = JSON.parse(loggedInUser)
  console.log(userParse)

  const {
    auth,
    isLoading
  } = useAuthContext();
  const location = useLocation();
  if (isLoading) {
    return <ScreenLoader />;
  }
  return userParse || auth ? <Outlet /> : <Navigate to="/auth/login" state={{
    from: location
  }} replace />;
};
export { RequireAuth };