import React, { Component } from 'react';
import axios from 'axios';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import '../css/titulo.css'

am4core.useTheme(am4themes_animated);

function generateChartData() {
    var chartData = [];
    var firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 1000);
    var visits = 1200;
    for (var i = 0; i < 500; i++) {
        // we create date objects here. In your data, you can have date strings
        // and then set format of your dates using chart.dataDateFormat property,
        // however when possible, use date objects, as this will speed up chart rendering.
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);

        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

        chartData.push({
            date: newDate,
            y: visits
        });
    }
    return chartData;
}

function getDates(startDate, endDate, tipo) {
    if (tipo == 0) {
        endDate.setDate(endDate.getDate() )
    } else if (tipo == 1) {
        endDate.setDate(endDate.getDate() +1)
    }

    var dates = [],
        currentDate = startDate,
        addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    return dates;
};

class Grafico extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tipo: 'RSS',
            chart: null,
            dateAxis: [],
            posiciones: {},
            posicionX: 0,
            fechaInicio: '2017-01-01',
            fechaFinal: '2017-12-31',
            hitos: [],
            noticias: []
        }
        this.onChangeS = this.onChangeS.bind(this)
        this.crearHito = this.crearHito.bind(this);
        this.insertarHito = this.insertarHito.bind(this);
        this.dejarDeMarcar = this.dejarDeMarcar.bind(this);
        this.obtenerDatos = this.obtenerDatos.bind(this);
        this.fechas = this.fechas.bind(this);
        this.onClickFechas = this.onClickFechas.bind(this);
    }

    despliegue(chart, id, i) {
        console.log(id);
        var titulo = '';
        var cuerpo = '';
        var j = 0;
        for (var i = 0; i < id.length; i++) {
            if (id[i] == '~') {
                j = 1;
            } else {
                if (j == 0) {
                    titulo = titulo + id[i];
                } else {
                    cuerpo = cuerpo + id[i]
                }

            }
        }
        chart.openPopup(cuerpo, titulo);
        //alert(id);
    }

    crearGrafico() {
        let chart = am4core.create("chartdiv2", am4charts.XYChart);

        chart.data = this.state.data;
        chart.responsive.enabled = true;
        /*var asd = generateChartData()
        console.log(asd);
        chart.data = asd;*/
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;
        this.setState({ dateAxis: dateAxis })

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "y";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2;
        series.minBulletDistance = 10;
        series.tooltipText = "{valueY}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 0.5;
        series.tooltip.label.padding(12, 12, 12, 12);
        series.minBulletDistance = 20;

        // Add scrollbar
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        for (var i = 0; i < this.state.hitos.length; i++) {
            let range = dateAxis.axisRanges.create();
            range.date = new Date(this.state.hitos[i].fecha);
            range.endDate = new Date(this.state.hitos[i].fecha);
            range.axisFill.fill = am4core.color("#396478");
            range.axisFill.fillOpacity = 1;
            range.grid.strokeWidth = 5;
        }

        let label = chart.createChild(am4core.Label);
        label.text = "Fecha";
        label.align = "center";
        label.fontWeight = 600;

        let topContainer = chart.chartContainer.createChild(am4core.Container);
        topContainer.layout = "absolute";
        topContainer.toBack();
        topContainer.paddingBottom = 15;
        topContainer.width = am4core.percent(100);

        let axisTitle = topContainer.createChild(am4core.Label);
        axisTitle.text = "Valor";
        axisTitle.fontWeight = 600;
        axisTitle.align = "left";
        axisTitle.paddingLeft = 4;
        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;



        var cursorPosition = {
            x: null,
            y: null
        };

        chart.cursor.events.on("cursorpositionchanged", function(ev) {
            var xAxis = ev.target.chart.xAxes.getIndex(0);
            var yAxis = ev.target.chart.yAxes.getIndex(0);
            this.setState({ posicionX: xAxis.positionToDate(xAxis.toAxisPosition(ev.target.xPosition)) })
            this.setState({ posicionY: yAxis.positionToValue(yAxis.toAxisPosition(ev.target.yPosition)) })
        }.bind(this));

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        bullet.propertyFields.id = "id";
        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;
        bullet.events.on("hit", function(ev) {
            this.despliegue(chart, ev.target.id)
                //console.log("clicked on ", ev.target.id);
                //chart.openPopup("OK. Now I'm serious.", "Hola");
        }, this);

        chart.plotContainer.events.off("hit", this.crearHito, this);
        this.setState({ chart: chart })
    }

    crearHito() {
        let range = this.state.dateAxis.axisRanges.create();
        range.date = this.state.posicionX;
        range.endDate = this.state.posicionX;
        range.axisFill.fill = am4core.color("#396478");
        range.axisFill.fillOpacity = 1;
        range.grid.strokeWidth = 5;
        console.log(this.state.posicionX);

        const hito = {
            empresa: this.props.ruta,
            fecha: this.state.posicionX,
            fuente: this.state.tipo
        }
        var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/subir_hito/';
        axios.post(link, hito)
            .then(res => {
                console.log(res.data);
            })
            .catch(error => {

                console.log(error.response)
            });
    }


    componentDidMount() {
        this.obtenerDatos();
        this.crearGrafico();
    }

    insertarHito() {
        this.state.chart.plotContainer.events.on("hit", this.crearHito, this);
        console.log(this.state.chart.scrollbarX.getPixelX());
    }

    dejarDeMarcar() {
        this.state.chart.plotContainer.events.off("hit", this.crearHito, this);
    }

    onChangeS(event) {
        this.setState({ tipo: event.target.value });
    }

    obtenerDatos() {
        console.log(this.props);
        console.log(this.state.tipo)
        if (this.state.tipo == 'RSS') {
            var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/graf1_service/' + this.props.ruta
            console.log(link)
            axios.get(link)
                .then(res => {
                    console.log(res.data)
                    var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/getHito/' + this.props.ruta + '/' + this.state.tipo;


                    this.setState({ datosG: res.data })

                    var keys = Object.keys(res.data[0]);

                    var todas = getDates(new Date(res.data[0][keys[2]]), new Date(res.data[res.data.length - 1][keys[2]]), 0);
                    var data = [];
                    var a = 0;
                    var b = 0;
                    console.log(res.data[b][keys[3]])
                    while (a < todas.length) {
                        var firstDate;
                        firstDate = new Date(res.data[b][keys[2]]);

                        if (firstDate.getFullYear() == todas[a].getFullYear() && firstDate.getMonth() == todas[a].getMonth() && firstDate.getDate() == todas[a].getDate()) {
                            firstDate.setTime(firstDate.getTime() + 4 * 60 * 60 * 1000);
                            data.push({
                                date: firstDate,
                                y: res.data[b][keys[7]],
                                id: res.data[b][keys[3]].title + '~' + res.data[b][keys[3]].description
                            });

                            a++;
                            b++;
                        } else {
                            todas[a].setTime(todas[a].getTime() + 4 * 60 * 60 * 1000);
                            data.push({
                                date: todas[a],
                                y: 0,
                                id: ' ~ '
                            });
                            a++;
                        }
                    }
                    console.log("defedef")
                    var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/getHito/' + this.props.ruta;
                    /*axios.get(link)
                        .then(res => {
                            console.log(res.data)
                            this.setState({ data: data })

                            this.setState({ hitos: res.data })
                        })
                        .catch(error => {

                            console.log(error.response)
                        });*/


                    this.setState({ data: data })
                })
                .catch(error => {

                    console.log(error.response)
                });
        } else if (this.state.tipo == 'RS') {
            var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/graf1_service_twitter/' + this.props.ruta

            axios.get(link)
                .then(res => {
                    var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/getHito/' + this.props.ruta;
                    this.setState({ datosG: res.data })

                    var keys = Object.keys(res.data[0]);

                    var todas = getDates(new Date(res.data[0][keys[1]]), new Date(res.data[res.data.length - 1][keys[1]]), 1);
                    var data = [];
                    var a = 0;
                    var b = 0;
                    while (a < todas.length) {
                        var firstDate;
                        firstDate = new Date(res.data[b][keys[1]]);

                        if (firstDate.getFullYear() == todas[a].getFullYear() && firstDate.getMonth() == todas[a].getMonth() && firstDate.getDate() == todas[a].getDate()) {
                            firstDate.setTime(firstDate.getTime() + 4 * 60 * 60 * 1000);
                            data.push({
                                date: firstDate,
                                y: res.data[b][keys[10]]
                            });
                            a++;
                            b++;

                        } else {
                            todas[a].setTime(todas[a].getTime() + 4 * 60 * 60 * 1000);
                            data.push({
                                date: todas[a],
                                y: 0
                            });
                            a++;
                        }
                    }

                    /*var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/getHito/' + this.props.nombreEmpresa.nombreEmpresa;
                    axios.get(link)
                    .then(res => {
                      console.log(res.data)
                      this.setState({data: data})
                      this.setState({hitos : res.data})
                    })
                    .catch(error => {
                        console.log(error.response)
                    });*/


                    this.setState({ data: data })
                })
                .catch(error => {

                    console.log(error.response)
                });
        } else if (this.state.tipo == 'TP') {
            //aca cambiar endpoint
            var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/graf1_service_google/' + this.props.ruta

            axios.get(link)
                .then(res => {
                    var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/getHito/' + this.props.ruta;

                    this.setState({ datosG: res.data })

                    var keys = Object.keys(res.data[0]);


                    var todas = getDates(new Date(res.data[0][keys[1]]), new Date(res.data[res.data.length - 1][keys[1]]), 1);
                    var data = [];
                    var a = 0;
                    var b = 0;
                    while (a < todas.length) {
                        var firstDate;
                        firstDate = new Date(res.data[b][keys[1]]);
                        if (firstDate.getFullYear() == todas[a].getFullYear() && firstDate.getMonth() == todas[a].getMonth() && firstDate.getDate() == todas[a].getDate()) {
                            firstDate.setTime(firstDate.getTime() + 4 * 60 * 60 * 1000);
                            data.push({
                                date: firstDate,
                                //cambiar []
                                y: res.data[b][keys[10]]
                            });
                            a++;
                            b++;

                        } else {
                            todas[a].setTime(todas[a].getTime() + 4 * 60 * 60 * 1000);
                            data.push({
                                date: todas[a],
                                y: 0
                            });
                            a++;
                        }
                    }

                    /*var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/getHito/' + this.props.nombreEmpresa.nombreEmpresa;
                    axios.get(link)
                    .then(res => {
                      console.log(res.data)
                      this.setState({data: data})
                      this.setState({hitos : res.data})
                    })
                    .catch(error => {
                        console.log(error.response)
                    });*/


                    this.setState({ data: data })
                })
                .catch(error => {

                    console.log(error.response)
                });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.nombreEmpresa != prevProps.nombreEmpresa) {
            this.obtenerDatos()
        }
        if (this.state.data != prevState.data) {
            this.crearGrafico()
        }
        if (this.state.hitos != prevState.hitos) {
            this.crearGrafico()
        }
        if (this.state.tipo != prevState.tipo) {
            this.obtenerDatos()
        }

    }

    fechas(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    mostrar() {
        var noticias = this.state.noticias.map((noticia) => {
            return (
              <div class = "card" >
                <h5 class = "card-header" > { noticia.title } < /h5>
                <div class = "card-body" >
                  <p class = "card-text" > { noticia.description } < /p>
                </div>
              </div>
            );
        })
        return (
          <div > { noticias } < /div>
        )
    }

    onClickFechas() {
        const fechas = {
            empresa: this.props.ruta,
            fechaInicio: this.state.fechaInicio,
            fechaTermino: this.state.fechaFinal
        }
        var link = 'http://back-webmining-dev.us-east-2.elasticbeanstalk.com/obtenerFechas/';
        axios.post(link, fechas)
            .then(res => {
                console.log(res.data);
                this.setState({ noticias: res.data })
            })
            .catch(error => {

                console.log(error.response)
            });
    }

    render() {
        return (
            <div class="vistaG">
              <select value = { this.state.selec } onChange = { this.onChangeS } >
                <option value = "RSS" > RSS < /option>
                <option value = "RS" > Red Social < /option>
                <option value = "TP" > Top Query < /option>
              </select>
              <h4 className = "titulo" >
                Repeticiones por fecha
              </h4>
              <div class="graf">
              <div id = "chartdiv2" style = {{ width: "1150px", height: "500px" } } >
              </div>
              </div>
              <button class = "btn btn-primary" onClick = { this.insertarHito }> Marcar Hitos </button>
              <button class = "btn btn-primary" onClick = { this.dejarDeMarcar }>
                Dejar de Marcar Hitos
              </button>
              <br/>
              Fecha Inicio
              <input name = "fechaInicio" value = { this.state.fechaInicio } onChange = { this.fechas } type = "date" / >
              <br/>
              Fecha Final
              <input name = "fechaFinal" value = { this.state.fechaFinal } onChange = { this.fechas } type = "date" / >
              <button class = "btn btn-primary" onClick = { this.onClickFechas } >
                Buscar
              </button>
              { this.mostrar() }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        nombreEmpresa: state.nombreEmpresa
    }
}

export default connect(mapStateToProps, actions)(Grafico);
