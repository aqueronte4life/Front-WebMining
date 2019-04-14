import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import Noticias from './componentes/noticias';
import TablaBarras from  './componentes/tablaBarras';

const AppRoutes = ({store}) =>
  <Provider store = {store}>
    <App>
      <Switch>
        <Route exact path="/" component={Noticias} />
        <Route path="/abc" component={TablaBarras} />
      </Switch>
    </App>
  </Provider>;

export default AppRoutes;


