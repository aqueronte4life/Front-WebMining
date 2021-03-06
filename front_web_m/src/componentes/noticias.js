import React, { Component } from 'react';
import axios from 'axios';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import Grafico from './grafico';
import Grafico2 from './grafico2';
import '../css/noticias.css'

am4core.useTheme(am4themes_animated);

class Noticias extends Component {
    constructor(props) {
        super(props);
        this.state = {
            texto: '',
            noticias: [],
            datosG: []
        }
        this.cambio = this.cambio.bind(this);
        this.click = this.click.bind(this);
        this.mostrar = this.mostrar.bind(this);
        this.onClickFechas = this.onClickFechas.bind(this)
    }

    cambio(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    click() {
        var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/noticia/' + this.props.ruta
        axios.get(link)
            .then(res => {
                console.log(res.data)

                this.setState({ noticias: res.data })
            })
            .catch(error => {

                console.log(error.response)
            });
        //console.log(this.props.nombreEmpresa);
        //this.setState({noticias: [{title: 'Hola', description: 'hola2'}, {title: 'hola3', description: 'hola4'}, {title: 'hola3', description: 'hola4'}, {title: 'hola3', description: 'hola4'}, {title: 'hola3', description: 'hola4'}, {title: 'hola3', description: 'hola4'}, {title: 'hola3', description: 'hola4'}] })
    }

    mostrar() {
        var noticias = this.state.noticias.map((noticia) => {
            return (
              <div class = "card">
                <h5 class = "card-header">
                  { noticia.noticia.title }
                </h5>
                <div class = "card-body" >
                  <p class = "card-text" >
                    { noticia.noticia.description }
                  </p>
                </div>
              </div>
            );
            /*return (
              <div class = "card">
                <h5 class = "card-header">
                  { noticia.title }
                </h5>
                <div class = "card-body" >
                  <p class = "card-text" >
                    { noticia.description }
                  </p>
                </div>
              </div>
            );*/
        })
        return ( <
            div > { noticias } < /div>
        )
    }

    onChangeS(event) {
        this.setState({ tipo: event.target.value });
    }
    componentDidMount(){
        this.click()
        var btns = document.getElementsByClassName("btn btn-outline-primary");
        for (var i = 0; i < btns.length; i++) {
          btns[i].addEventListener("click", function() {
          var current = document.getElementsByClassName("active");
          current[0].className = current[0].className.replace(" active", "");
          this.className += " active";
          });
        }
    }

    removerCSS(){
      var btns = document.getElementsByClassName("btn btn-outline-primary btn-lg");
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
        });
      }
    }

    componentDidUpdate(prevProps, prevState){
      console.log(this.props.fechas);
      if(this.props.fechas != prevProps.fechas){
        console.log("WIIIIII");
        this.onClickFechas()
      }
    }

    onClickFechas() {
      console.log(this.props);
        const fechas = {
            empresa: this.props.ruta,
            fechaInicio: this.props.fechas.fechaInicio,
            fechaTermino: this.props.fechas.fechaFinal
        }
        console.log(fechas);
        var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/obtenerFechas/';
        axios.post(link, fechas)
        .then(res => {
            console.log(res.data);
            this.setState({noticias: res.data})
        })
        .catch(error => {

            console.log(error.response)
        });
    }

    render() {
        return (
          <div >
            <div class="botones btn-group">
              <button class="btn btn-outline-primary unBoton active">E</button>
              <button class="btn btn-outline-primary unBoton">SI</button>
              <button class="btn btn-outline-primary unBoton">SE</button>
              <button class="btn btn-outline-primary unBoton">G</button>
            </div>
            <div class ="tamano3">
              { this.mostrar() } { /*<Grafico/>*/ } { /*<Grafico2/>*/ }
            </div>
          </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        nombreEmpresa: state.nombreEmpresa,
        fechas: state.fechas
    }
}


export default connect(mapStateToProps, actions)(Noticias);
