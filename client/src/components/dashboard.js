import React, { Component } from "react";
import {renderChart1} from './charts/chart1'
import {renderChart2} from './charts/chart2'
import axios from "axios";
import "../styles/dashboard.css";


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      user: {},
      chart1Rendered:false
    };
  }
  componentDidMount() {
    axios.get("/api/entryUpdates").then(res => {
      this.setState({ data: res.data }, () => {
        //console.log(res.data);
        if (this.state.chart1Rendered === false) {
           renderChart1(this.state.data.pattern3);
           renderChart2(this.state.data.pattern2);
           this.setState({chart1Rendered:true});
        }
      });
    });
  }
  renderPattern1 = () => {
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
              <span style={{color:'rgba(0,0,0,.6)'}}>You had this
              symptom on more than 5 occasions on the same day as eating this</span>
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
