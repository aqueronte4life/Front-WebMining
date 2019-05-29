import React, { Component } from 'react';
import axios from 'axios';
import { Line, Circle } from 'rc-progress';
import '../css/tablaBarra.css';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';

const Range = Slider.Range;
function log(value) {
  console.log(value); //eslint-disable-line
}
const style = { width: 400 };


// Create a list of day and month names.
var weekdays = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday",
    "Saturday"
];

var months = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];

// Append a suffix to dates.
// Example: 23 => 23rd, 1 => 1st.
function nth(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

function timestamp(str) {
    return new Date(str).getTime();
}

// Create a string representation of the date.
function formatDate(date) {
    return weekdays[date.getDay()] + ", " +
        date.getDate() + nth(date.getDate()) + " " +
        months[date.getMonth()] + " " +
        date.getFullYear();
}


class TablaBarras extends Component{
  constructor(props){
    super(props);
    this.state={
    	porcentaje: 20,
    	datos: [[[10, {"uno": 1, "dos": 2}],[20, {"tres": 3, "cuatro": 4}],[30, {}]], [[40, {"dos": 2}],[50, {}],[60, {}]], [[70, {"tres": 3}],[80, {"uno": 1, "cuatro": 4}],[90, {"dos": 2, "cuatro": 4}]], [[30, {"uno": 1}], [50, {"tres": 3}], [80, {}]]],
    	texto: '',
    	fechaInicio: '2017-01-01',
	    fechaFinal: '2017-12-31',
      min: 1413169200000,
      max: 1716960236606,
      min1: 1413169200000,
      max1: 1716960236606,
      /*popoverOpen0: false,
      popoverOpen1: false,
      popoverOpen2: false,
      popoverOpen3: false,
      popoverOpen4: false,
      popoverOpen5: false,
      popoverOpen6: false,
      popoverOpen7: false,
      popoverOpen8: false,
      popoverOpen9: false,
      popoverOpen10: false,
      popoverOpen11: false*/
      popoverOpen1: [[false,false,false], [false,false,false], [false,false,false], [false, false, false]],


    }
    this.cambio = this.cambio.bind(this);
    this.click = this.click.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount(){
    var año = new Date();
    var numAño = año.getTime()
    var añoAnt = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    var numAñoAnt = añoAnt.getTime()
    console.log(numAño);
    console.log(numAñoAnt);
    this.setState({
      min: numAñoAnt,
      min1: numAñoAnt,
      max: numAño,
      max1: numAño
    })
    var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/service_table_anterior/' + this.props.ruta
    console.log(link);
    axios.get(link)
    .then(res => {
        console.log(res.data)
        //this.setState({datos : res.data})

    })
    .catch(error => {

        console.log(error.response)
    });
  }

  cambio(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  click(event){
    event.preventDefault();
    const fechas = {
      fechaInicio: this.state.min1,
      fechaFinal: this.state.max1
    }
    this.props.setFechas(fechas)
    console.log(fechas);
    var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/service_table_fecha/'
    const datos = {
      empresa: this.props.ruta,
      fechaInicio: this.state.min1,
      fechaFinal: this.state.max1
    }
    console.log(datos);

    axios.post(link, datos)
    .then(res => {
      console.log(res.data)
      //[1,2,3]
      this.setState({datos : res.data})
    })
    .catch(error => {

        console.log(error.response)
    });
    //this.setState({noticias: [{title: 'Hola', description: 'hola2'}, {title: 'hola3', description: 'hola4'}]})
  }

  textoPop(obj){
    var keys = Object.keys(obj);

    const Texto = keys.map((label)=>{
      return(
        <div>
          {label}: {obj[label]}
        </div>
      )
    })
    return(
      <PopoverBody>
        {Texto}
      </PopoverBody>
    )

  }

  crearFilas(){
  	const Tabla = this.state.datos.map((dato, i)=>{
  		const Fila = dato.map((dat, j)=>{
  			if(dat[0] <50){
  				return(
  					<td>
            <div id = {"popoverOpen" + (i*3 + j)}>
            <Line class = "figuras" strokeWidth="2" strokeColor="red"  percent={dat[0]} /> {dat[0]}
            </div>
            <Popover placement="bottom" isOpen={this.state.popoverOpen1[i][j]} target={"popoverOpen" + (i*3 + j)} toggle={this.toggle}>
              <PopoverHeader>Fuentes</PopoverHeader>
              {this.textoPop(dat[1])}
            </Popover>
  					</td>)
	  		}
	  		else if(dat[0] < 70){
	  			return(
  					<td>
            <div id = {"popoverOpen" + (i*3 + j)}>
  					<Line class = "figuras" strokeWidth="2" strokeColor="yellow"  percent={dat[0]} /> {dat[0]}
            </div>
            <Popover placement="bottom" isOpen={this.state.popoverOpen1[i][j]} target={"popoverOpen" + (i*3 + j)} toggle={this.toggle}>
              <PopoverHeader>Fuentes</PopoverHeader>
              {this.textoPop(dat[1])}
            </Popover>
  					</td>)
	  		}
	  		else{
	  			return(
  					<td>
            <div id = {"popoverOpen" + (i*3 + j)}>
  					<Line class = "figuras" strokeWidth="2" strokeColor="green"  percent={dat[0]} /> {dat[0]}
            </div>
            <Popover placement="bottom" isOpen={this.state.popoverOpen1[i][j]} target={"popoverOpen" + (i*3 + j)} toggle={this.toggle}>
              <PopoverHeader>Fuentes</PopoverHeader>
              {this.textoPop(dat[1])}
            </Popover>
  					</td>)
	  		}
  		});
  		if(i == 1){
  			return(
  				 <tr>
  				 	<th scope="row">Medio Ambiente</th>
			      	{Fila}
			    </tr>
  				)
  		}
  		else if(i == 2){
  			return(
  				 <tr>
  				 	<th scope="row">Social Interno</th>
			      	{Fila}
			    </tr>
  				)
  		}
  		else if(i == 3){
  			return(
  				<tr>
  				 	<th scope="row">Social Externo</th>
			      	{Fila}
			    </tr>
  				)
  		}
  		else{
  			return(
  				<tr>
  				 	<th scope="row">Gobernanza</th>
			      	{Fila}
			    </tr>
  				)
  		}
  	})
  	return(
  		<table class="table table-striped">
			  <thead>
			    <tr>
			      <th style={style} scope="col">#</th>
			      <th style={style} scope="col">Redes Sociales</th>
			      <th style={style} scope="col">Web</th>
			      <th style={style} scope="col">Noticias</th>
			    </tr>
			  </thead>
			  <tbody>
			    {Tabla}
			  </tbody>
			</table>
  		)
  }

  onSliderChange(value){
    this.setState({
      min1: value[0],
      max1: value[1],
    })
  }

  imprimirFechas(){
    var fecha1 = new Date(this.state.min1)
    var fecha2 = new Date(this.state.max1)
    return(
      <div>
      {formatDate(fecha1)}
      <br/>
      <br/>
      {formatDate(fecha2)}
      </div>
      )
  }

  displayar(){

  }

  porfavor(){
    clearTimeout();
    document.getElementById("desv1").style.display = "block";
  }

  cosito(){
    document.getElementById("desv1").style.display = "none";
  }

  doTimeout(){
    var myVar;
    myVar = setTimeout(function(){ document.getElementById("desv1").style.display = "none"; }, 1500);
  }

  toggle(event) {
    console.log(event.target.id);
    var a = "";
    for (var i = 11; i < event.target.id.length; i++) {
      a = a+event.target.id[i];
    }
    console.log(a);
    var x = parseInt(a/3);
    var y = a - x*3
    console.log(x + " " + y);
    const nuev = this.state.popoverOpen1.slice() //copy the array
    nuev[x][y] = !this.state.popoverOpen1[x][y] //execute the manipulations
    this.setState({popoverOpen1: nuev}) //set the new state
    /*this.setState({
      popoverOpen1: !this.state.popoverOpen1
    });*/
  }

  render(){
  	return(
  		<div>
        <div style={style}>
          {this.imprimirFechas()}
          <Range  min={this.state.min} max={this.state.max} step={24 * 60 * 60 * 1000}
            onChange={this.onSliderChange} defaultValue={[this.state.min, this.state.max]}
          />
          <button class="btn btn-primary" onClick={this.click}>Filtrar</button>
        </div>
	  		{this.crearFilas()}


		  </div>
  		)
  }
}
const mapStateToProps = state => {
    return {
        nombreEmpresa: state.nombreEmpresa
    }
}

export default connect(mapStateToProps, actions)(TablaBarras);

/*
0-50
50-70
70-100*/
