import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import ErrorPage from 'views/pages/error/errorPage';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/pages/login',
      element: <AuthLogin3 />
    },
    {
      path: '/pages/register',
      element: <AuthRegister3 />
    },
    {
      path: '/pages/error',
      element: <ErrorPage />
    }
  ]
};

export default AuthenticationRoutes;
