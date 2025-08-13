import { getToken } from '@/utils';
import { Navigate } from 'react-router';

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  if (!getToken()) {
    return <Navigate to={`login?redirect=${window.location.pathname}`} />;
  }

  return children;
};

export default AuthRoute;
