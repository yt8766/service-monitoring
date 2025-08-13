import AutoAuthChecker from '@/components/AuthChecker';
import Layout from '@/layout';
import { Login } from '@/pages/Login';
import { createBrowserRouter } from 'react-router';
import AuthRoute from './AuthRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AutoAuthChecker>
        <AuthRoute>
          <Layout />
        </AuthRoute>
      </AutoAuthChecker>
    ),
    children: [
      {
        path: 'projects',
        element: <div>projects</div>
      },
      {
        path: 'issues',
        element: <div>issues</div>
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
]);
