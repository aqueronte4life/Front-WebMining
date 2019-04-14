import React, { Component } from 'react';
import logo from './logo.svg';
import Noticias from './componentes/noticias';
import Grafico from './componentes/grafico';
import Grafico2 from './componentes/grafico2';
import TablaBarra from './componentes/tablaBarras';
import './App.css';

import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {createStore} from 'redux'
// Components

import Content from './componentes/Layout/Content';

class App extends Component {
  constructor (props) {
    super(props);
  }

  static propTypes = {
    children: PropTypes.object.isRequired
  };
  render() {
    const { children } = this.props;
    return(
      <div>
        <Content body={children} />
      </div>
    )
  }
}

export default App;


/*return (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);*/
