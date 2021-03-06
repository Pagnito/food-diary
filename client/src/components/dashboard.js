import React, { Component } from "react";
import {renderChart1} from './charts/chart1'
import {renderChart2} from './charts/chart2'
import axios from "axios";
import helpers from '../../util/fe-utils';

import "../styles/dashboard.css";


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      user: {},

    };
    this.chart1Rendered = false;
    this.chart2Rendered = false;
  }
  componentDidMount() {
    window.scroll(0,0)
    console.log(navigator)
    axios.get("/api/entryUpdates").then(res => {
      if(res){
        console.log('FROM NETWORK')
        this.setState({ data: res.data }, () => {
          if (this.chart1Rendered === false) {
             renderChart1(this.state.data.pattern3);
             renderChart2(this.state.data.pattern2);
             this.chart1Rendered=true,
             this.chart2Rendered=true;
          }
        });
      }
    }).catch(()=>{
      var that = this;
      if('indexedDB' in window){
          helpers.readData('patterns')
          .then((data)=>{
            console.log('FROM IDB');
            if(data.length>0){
              that.setState({
                data:data[0]
              }, ()=>{
              if (this.chart1Rendered === false) {
                  renderChart1(this.state.data.pattern3);
                  renderChart2(this.state.data.pattern2);
                  this.chart1Rendered=true,
                  this.chart2Rendered=true;
                }
              })
            }
          })
        }
    })
  }
  renderPattern1 = () => {
    console.log('RERENDERED')
    if (Object.keys(this.state.data).length > 0) {
      return this.state.data.pattern1.map((dataPiece, ind) => {
        let dataPieceSplit = dataPiece.split(',')
        return (
          <div key={ind} className="patternItem">
             {dataPieceSplit[1]}: {dataPieceSplit[0]}
          </div>
        );
      });
    }
  };
renderPatternTitles = () => {
  if (Object.keys(this.state.data).length > 0) {
    if(this.state.data.pattern1.length>0){
      return (
        <div>
          <span style={{color:'rgba(0,0,0,.6)'}}>You had this
          symptom above 7 on more than 5 occasions on the same day as eating this</span>
        </div>
      )
    }
  }
}
  renderDash = () => {
    if (Object.keys(this.state.user).length > 0) {
    } else {
    }
  };
  render() {

    return (
      <div className="dashboard">
        <span className="dashTitle" style={{fontSize:'40px', marginTop:'20px', fontFamily:'Kodchasan'}}>Data From Last 30 days</span>
        <div className="dashboardGrid">
          <div className="updates">
            <div style={{marginBottom:'15px', width:'100%',textAlign: 'center', fontSize: '20px'}}>Patterns</div>
            <div className="pattern1">
              {this.renderPatternTitles()}
              {this.renderPattern1()}</div>
          </div>
          <div id="chart1" />
          <div id="chart2"><div className="severityTitle">Symptom Severites in the Last 30 Days</div></div>
          <div id="chart3" />
        </div>
      </div>
    );
  }
}

export default Dashboard;
