import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import {createStore} from 'redux';
import Reducers from './redux/reducers';
//ReactDOM.render(<App />, document.getElementById('root'));

let store = createStore(Reducers);
render(
    <Router>
      <AppRoutes store={store}/>
    </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
