import React, { Component } from 'react';
import axios from 'axios';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {connect} from 'react-redux';
import * as actions from '../redux/actions';

am4core.useTheme(am4themes_animated);

function getDates(startDate, endDate, tipo) {
  if(tipo == 0){
    endDate.setDate(endDate.getDate()+1)
  }
  else if(tipo == 1){
    endDate.setDate(endDate.getDate())
  }
  
  var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
  do {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  while (currentDate <= endDate);
  return dates;
};

class Grafico2 extends Component{
  constructor(props){
    super(props);
    this.state={
      data: [],
      data2: [],
      selec: ''
    }
    this.generarSelect = this.generarSelect.bind(this)
    this.onChangeS = this.onChangeS.bind(this)
    this.crearGrafico = this.crearGrafico.bind(this)
  }

  componentDidMount() {
    this.obtenerDatos()
    this.crearGrafico()


  }

  crearGrafico(){
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    /*var data = [];
    var price1 = 1000, price2 = 1200, price3 = 1500, price4 = 1100;
    var quantity = 30000;
    for (var i = 0; i < 2; i++) {
      price1 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
      data.push({ date1: new Date(2015, 0, i), y1: price1});
      console.log(data[0]);
    }
    for (var i = 0; i < 2; i++) {
      price2 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
      data.push({ date2: new Date(2016, 0, i), y2: price2 });
    }
    console.log(this.state.data)
    var algo = this.state.data
    chart.data = algo;
    //chart.data = data;
    console.log(data);
  */
  /*var link = 'https://deploy-back.herokuapp.com/graf1_service/' + this.props.nombreEmpresa.nombreEmpresa
  var data = []

    axios.get(link)
    .then(res => {
      var keys = Object.keys(res.data[0]);
      var todas = getDates(new Date(res.data[0][keys[1]]), new Date(res.data[res.data.length-1][keys[1]]), 0);

      var a = 0;
      var b = 0;
      while (a < todas.length){
        var firstDate;
        firstDate = new Date(res.data[b][keys[1]]);


        if(firstDate.getFullYear() == todas[a].getFullYear() && firstDate.getMonth() == todas[a].getMonth() && firstDate.getDate() == todas[a].getDate()){
          firstDate.setTime(firstDate.getTime() + 4*60*60*1000);
          data.push({
            date1: firstDate,
            y1: res.data[b][keys[8]],
            id: ' ~ '
          });
          a++;
          b++;
        }
        else{
          todas[a].setTime(todas[a].getTime() + 4*60*60*1000);
          data.push({
            date1: todas[a],
            y1: 0,
            id: ' ~ '
          });
          a++;
        }
      }
    })
    .catch(error => {

        console.log(error.response)
    });*/
    //console.log(data)
    /*var price1 = 1000, price2 = 1200, price3 = 1500, price4 = 1100;
    var quantity = 30000;
    for (var i = 0; i < 2; i++) {
      price1 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
      data.push({ date1: new Date(2015, 0, i), y1: price1});
      console.log(data[0]);
    }
    for (var i = 0; i < 2; i++) {
      price2 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
      data.push({ date2: new Date(2016, 0, i), y2: price2 });
    }*/
    var a = this.state.data.slice()
    var b = this.state.data2.slice()
    var c = a.concat(b)
    console.log(this.state.data)
    console.log(this.state.data2)

    chart.data = c

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.labels.template.fill = am4core.color("#e59165");

    var dateAxis2 = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis2.renderer.grid.template.location = 0;
    dateAxis2.renderer.labels.template.fill = am4core.color("#dfcc64");

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.labels.template.fill = am4core.color("#e59165");

    valueAxis.renderer.minWidth = 60;

    var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.tooltip.disabled = true;
    valueAxis2.renderer.grid.template.strokeDasharray = "2,3";
    valueAxis2.renderer.labels.template.fill = am4core.color("#dfcc64");
    valueAxis2.renderer.minWidth = 60;

    var series = chart.series.push(new am4charts.LineSeries());
    series.name = "RSS";
    series.dataFields.dateX = "date1";
    series.dataFields.valueY = "y1";
    series.fill = am4core.color("#e59165");
    series.stroke = am4core.color("#e59165");
    series.minBulletDistance = 20;
    //series.strokeWidth = 3;

    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.name = "RS";
    series2.dataFields.dateX = "date2";
    series2.dataFields.valueY = "y2";
    series2.yAxis = valueAxis2;
    series2.xAxis = dateAxis2;
    series2.tooltipText = "{valueY.value}";
    //Color de la burbuja
    series2.fill = am4core.color("#dfcc64");
    //Color de la linea
    series2.stroke = am4core.color("#dfcc64");
    series2.minBulletDistance = 20;
    //series2.strokeWidth = 3;




    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis2;
    var cursorPosition = {
      x: null,
      y: null
    };
    chart.cursor.events.on("cursorpositionchanged", function(ev) {
      var xAxis = ev.target.chart.xAxes.getIndex(0);
      var yAxis = ev.target.chart.yAxes.getIndex(0);
      cursorPosition.x = xAxis.positionToDate(xAxis.toAxisPosition(ev.target.xPosition));
      cursorPosition.y = yAxis.positionToValue(yAxis.toAxisPosition(ev.target.yPosition));
    });

    let range = dateAxis.axisRanges.create();
    range.date = new Date(2016, 0, 5);
    range.endCategory = new Date(2016, 0, 10);
    range.axisFill.fill = am4core.color("#396478");
    range.axisFill.fillOpacity = 0.3;

    chart.plotContainer.events.on("hit", function(ev) {
      console.log(cursorPosition);
    });

    var scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series2);
    chart.scrollbarX = scrollbarX;

    chart.legend = new am4charts.Legend();
    chart.legend.parent = chart.plotContainer;
    chart.legend.zIndex = 100;

    valueAxis2.renderer.grid.template.strokeOpacity = 0.07;
    dateAxis2.renderer.grid.template.strokeOpacity = 0.07;


    dateAxis.renderer.grid.template.strokeOpacity = 0.07;
    valueAxis.renderer.grid.template.strokeOpacity = 0.07;


    var bullet = series2.bullets.push(new am4charts.CircleBullet());
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
    

    /*for (var i = 3; i < 5; i++) {
      this.crearLinea(chart, i);
    }*/

    //series2.strokeWidth = 3;
    this.chart = chart;
  }

  crearLinea(chart, i){
    var dateAxis4 = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis4.renderer.grid.template.location = 0;


    var valueAxis4 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis4.tooltip.disabled = true;
    valueAxis4.renderer.grid.template.strokeDasharray = "2,3";
    valueAxis4.renderer.minWidth = 60;


    var series4 = chart.series.push(new am4charts.LineSeries());
    series4.name = "2017";
    var date = "date" + i;
    var price = "price" + i;
    series4.dataFields.dateX = date;
    series4.dataFields.valueY = price;
    series4.yAxis = valueAxis4;
    series4.xAxis = dateAxis4;
    series4.tooltipText = "{valueY.value}";
    //series2.strokeWidth = 3;

    this.chart = chart;
  }

  despliegue(chart, id, i){
    chart.openPopup("lot area, as well as map it to real values. Prerequisites If you haven't done so already, we strongly suggest you take a look at the article, which walks through every step and aspect of using this chart helper. We will also be relying on event handlers in this tutorial, so it might be a good idea to familiarize yourself with the concept by checking out.", "Hola" + i);
    //alert(id);
  }

  funcion(keys, data){

  }

  obtenerDatos(){
    var link = 'https://deploy-back.herokuapp.com/graf1_service/' + this.props.nombreEmpresa.nombreEmpresa
    var data = []

    axios.get(link)
    .then(res => {


      var keys = Object.keys(res.data[0]);


      var todas = getDates(new Date(res.data[0][keys[1]]), new Date(res.data[res.data.length-1][keys[1]]), 0);

      var a = 0;
      var b = 0;
      while (a < todas.length){
        var firstDate;
        firstDate = new Date(res.data[b][keys[1]]);


        if(firstDate.getFullYear() == todas[a].getFullYear() && firstDate.getMonth() == todas[a].getMonth() && firstDate.getDate() == todas[a].getDate()){
          firstDate.setTime(firstDate.getTime() + 4*60*60*1000);
          data.push({
            date1: firstDate,
            y1: res.data[b][keys[8]],
            id: ' ~ '
          });
          a++;
          b++;
        }
        else{
          todas[a].setTime(todas[a].getTime() + 4*60*60*1000);
          data.push({
            date1: todas[a],
            y1: 0,
            id: ' ~ '
          });
          a++;
        }
      }
      this.setState({data: data})
    })
    .then(result =>{
      var link = 'https://deploy-back.herokuapp.com/graf1_service_twitter/' + this.props.nombreEmpresa.nombreEmpresa
      var data1 = []
      axios.get(link)
      .then(res => {
        var keys = Object.keys(res.data[0]);
        var todas;
        todas = getDates(new Date(res.data[0][keys[1]]), new Date(res.data[res.data.length-1][keys[1]]), 1);
        var a = 0;
        var b = 0;
        console.log("tamano" + todas.length)
        while (a < todas.length){
          var firstDate;
          firstDate = new Date(res.data[b][keys[1]]);
          console.log(firstDate)
          console.log(todas[a])

          if(firstDate.getFullYear() == todas[a].getFullYear() && firstDate.getMonth() == todas[a].getMonth() && firstDate.getDate() == todas[a].getDate()){
            firstDate.setTime(firstDate.getTime() + 4*60*60*1000);
            data1.push({
              date2: firstDate,
              y2: res.data[b][keys[10]],
              id: ' ~ '
            });
            /*this.setState({
              data: [...this.state.data, {date2: firstDate,
              y2: res.data[b][keys[10]],
              id: ' ~ '}]
            })*/
            a++;
            b++;
            
          }
          else{
            todas[a].setTime(todas[a].getTime() + 4*60*60*1000);
            /*this.setState({
              data: [...this.state.data, {date2: todas[a],
              y2: 0,
              id: ' ~ '}]
            })*/
            data1.push({
              date2: todas[a],
              y2: 0,
              id: ' ~ '
            });
            a++;
          }
        }
        console.log(data1)
        this.setState({data2: data1})
        console.log(this.state.data2)
      })
      .catch(error => {

          console.log(error.response)
      });
    })
  .then(resultado =>(this.crearGrafico()))
    .catch(error => {

        console.log(error.response)
    });
  }

  generarSelect(){
    var array = ['2015', '2016', '2017'];
    const selections = array.map((empresa)=>{
      return(
        <option value={empresa}>{empresa}</option>
      )
    })
    return(
      <div>
      <select value={this.state.selec} onChange={this.onChangeS}>
        {selections}
      </select>
      </div>
    )
  }

  onChangeS(event){
    this.setState({selec: event.target.value});
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.nombreEmpresa != prevProps.nombreEmpresa){
      this.obtenerDatos()
    }
    if(this.state.data2 != prevState.data2){
      this.crearGrafico()
    }
    
  }

  render() {
    return (
      <div>
      {this.generarSelect()}
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
      </div>
    );
  }
}

const mapStateToProps = state =>{
  return {
    nombreEmpresa: state.nombreEmpresa
  }
}

export default connect(mapStateToProps, actions)(Grafico2);
