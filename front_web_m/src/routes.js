import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import Noticias from './componentes/noticias';
import TablaBarras from  './componentes/tablaBarras';
import PagPrincipal from './componentes/pagPrincipal';

const AppRoutes = ({store}) =>
  <Provider store = {store}>
    <App>
      <Switch>
        <Route exact path="/" component={Noticias} />
        <Route path="/abc" component={TablaBarras} />
        <Route path="/def/:id" component={PagPrincipal} />
      </Switch>
    </App>
  </Provider>;

export default AppRoutes;
