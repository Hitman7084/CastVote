import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Jumper from './pages/Jumper';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
import Register from './pages/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Jumper />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  }
]);

function App() {
  return (<RouterProvider router={router} />);
}

export default App;
