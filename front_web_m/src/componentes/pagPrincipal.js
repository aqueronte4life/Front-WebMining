import React, { Component } from 'react';
import axios from 'axios';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {connect} from 'react-redux';
import * as actions from '../redux/actions';
import Grafico from './grafico';
import Grafico2 from './grafico2';
import Noticias from './noticias';
import TablaBarras from './tablaBarras';

am4core.useTheme(am4themes_animated);

class PagPrincipal extends Component{
  constructor(props){
    super(props);
    this.state={
      texto: '',
      noticias: [],
      datosG: []
    }
  }


  componentDidMount() {
    console.log(this.props.match.params.id)
    this.props.setNombre(this.props.match.params.id);
    console.log(this.props.nombreEmpresa.nombreEmpresa)
  }

  render(){
    return(
      <div>
        <div class="row">
          <div class="col-6 col-md-6 col-sm-4 col-xs-2">
            <Noticias />
            <Grafico />
          </div>
          <div class="col-6 col-md-6 col-sm-4 col-xs-2">
            <TablaBarras />
          </div>
        </div>
        {this.props.nombreEmpresa.nombreEmpresa}
      </div>
    )
  }

}

const mapStateToProps = state =>{
  return {
    nombreEmpresa: state.nombreEmpresa
  }
}

export default connect(mapStateToProps, actions)(PagPrincipal);
