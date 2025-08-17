import AutoAuthChecker from '@/components/AuthChecker';
import Layout from '@/layout';
import { Issues } from '@/pages/Issues';
import { Login } from '@/pages/Login';
import { Projects } from '@/pages/Projects';
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
        element: <Projects />
      },
      {
        path: 'issues',
        element: <Issues />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
]);
