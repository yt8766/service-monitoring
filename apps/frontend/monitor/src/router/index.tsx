import { Login } from '@/pages/Login';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home</div>,
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
