import { Route } from 'react-router-dom';
import Home from './components/Home';
import Block from './components/Block';
import Transaction from './components/Transaction';

// Define routes as an array of objects
const routes = [
  { path: '/', component: Home, exact: true },
  { path: '/block/:number', component: Block },
  { path: '/transaction/:hash', component: Transaction },
];

// Create a function that maps the routes to Route components
export function RenderRoutes() {
  return (
    <>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          component={route.component}
          exact={route.exact}
        />
      ))}
    </>
  );
}
