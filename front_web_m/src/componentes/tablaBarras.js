import React, { Component } from 'react';
import axios from 'axios';
import { Line, Circle } from 'rc-progress';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
const Range = Slider.Range;
function log(value) {
  console.log(value); //eslint-disable-line
}
const style = { width: 400, margin: 50 };


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
    	datos: [[10,20,30], [40,50,60], [70,80,90], [30, 50, 80]],
    	texto: '',
    	fechaInicio: '2017-01-01',
	    fechaFinal: '2017-12-31',
      min: 1413169200000,
      max: 1416798000000,
      min1: 1413169200000,
      max1: 1416798000000

    }
    this.cambio = this.cambio.bind(this);
    this.click = this.click.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
  }

  obtenerDatos(){

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
    console.log(this.state.texto);
    var link = 'http://localhost:3001/service_table/' + this.state.texto
    axios.get(link)
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

  crearFilas(){
  	const Tabla = this.state.datos.map((dato, i)=>{
  		const Fila = dato.map((num)=>{
  			if(num <50){
  				return(
  					<td>
  					<Line strokeWidth="2" strokeColor="red"  percent={num} /> {num}
  					</td>)
	  		}
	  		else if(num < 70){
	  			return(
  					<td>
  					<Line strokeWidth="2" strokeColor="yellow"  percent={num} /> {num}
  					</td>)
	  		}
	  		else{
	  			return(
  					<td>
  					<Line strokeWidth="2" strokeColor="green"  percent={num} /> {num}
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

  onClickFechas(){
    const fechas = {
      empresa: this.state.texto,
      fechaInicio: this.state.fechaInicio,
      fechaTermino: this.state.fechaFinal
    }
    var link = 'http://localhost:3001/obtenerFechas/';
    axios.post(link, fechas)
    .then(res => {
      console.log(res.data);
      this.setState({datos: res.data})
    })
    .catch(error => {

        console.log(error.response)
    });
  }

  onSliderChange(value){
    log(value);
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
      {fecha1.toString()}
      <br/>
      <br/>
      {fecha2.toString()}
      </div>
      )
  }



  render(){
  	return(
  		<div>
  			<label>Nombre Empresa: </label>
       		<input type = "text" name = "texto" onChange = {this.cambio}/>
       		<button class="btn btn-primary" onClick = {this.click}>Buscar</button>
	  		{this.crearFilas()}
	  		<br/>
	        Fecha Inicio
	        <input name="fechaInicio" value = {this.state.fechaInicio} onChange={this.cambio} type="date"/>
	        <br/>
	        Fecha Final
	        <input name="fechaFinal" value = {this.state.fechaFinal} onChange={this.cambio} type="date"/>
	        <button class="btn btn-primary" onClick={this.onClickFechas}>Buscar</button>
          <div>

         <div style={style}>
        
        <br /><br />
        <Range  min={this.state.min} max={this.state.max} step={24 * 60 * 60 * 1000}
          onChange={this.onSliderChange}
        />
        {this.imprimirFechas()}
        </div>
      </div>
		</div>
  		)
  }
}

export default TablaBarras;

/*
0-50
50-70
70-100*/