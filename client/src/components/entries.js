import React, { Component } from 'react';
import NewEntry from './newEntry'
import axios from 'axios';
import moment from 'moment';
import helpers from '../../util/fe-utils'
import '../styles/entries.css'

class Entries extends Component {
  constructor(props){
    super(props);
    this.state={
      entries:[],
      entryNumber: 0,
      newEntry: false,
    }
  }

  componentDidMount(){

    window.scroll(0,0)
    this.mounted = true;
    var that = this;
    if('indexedDB' in window){
        helpers.readData('days')
        .then((days)=>{
            const rev = days.sort((a,b)=>{ return b.entryNumber-a.entryNumber});
            that.setState({
              entries:rev
            })
              this.setState({entryNumber:rev[0].entryNumber })
        })
      }
      axios.get('/api/getDays').then(days=>{
        if(this.mounted===true){
          const rev = days.data.sort((a,b)=>{ return b.entryNumber-a.entryNumber});
          this.setState({entries: rev})
          //console.log(days.data)
          this.setState({entryNumber:rev.length > 0 ? rev[0].entryNumber : 0 })
        }
      })
    }

  componentWillUnmount(){
    this.mounted=false;
  }

  addEntry=()=>{
    if('serviceWorker' in navigator && 'SyncManager' in window){
        navigator.serviceWorker.ready
        .then((sw)=>{
          document.getElementById('newEntry').classList.add('dropDown');
          const dayObj = {
            entryNumber: this.state.entries.length > 0 ? this.state.entries[0].entryNumber+1 : 1,
            newEntry: true
          }
          this.setState({entryNumber:this.state.entries.length > 0 ? this.state.entries[0].entryNumber+1 : 1 })
          helpers.writeData('syncedDays', dayObj)
          .then(()=>{
            sw.sync.register('sync-day-post')
          })
        })
    } else {
      document.getElementById('newEntry').classList.add('dropDown');
      const dayObj = {
        entryNumber: this.state.entries.length > 0 ? this.state.entries[0].entryNumber+1 : 1,
        newEntry: true
      }
      this.setState({entryNumber:this.state.entries.length > 0 ? this.state.entries[0].entryNumber+1 : 1 })
      axios.post('/api/addDay', dayObj)
    }
  }
  renderDayEntries=()=>{

    function renderSymptoms(symptoms){
      if(symptoms.length>0){
        return symptoms.map((symptom,ind)=>{
          if(symptom.symptom){
            const delayedOrInstant = symptom.delayedOrInstant==true ? 'Yes' : 'No';
            return (
              <div key={ind} className="symptom">
                <div className="symField"><div className="symFieldTitle">Symptom:</div> {symptom.symptom}</div>
                <div className="symField"><div className="symFieldTitle">Start Time:</div> {symptom.startTime}</div>
                <div className="symField"><div className="symFieldTitle">Severity:</div> {symptom.severity}</div>
                <div className="symField"><div className="symFieldTitle">Instant?:</div>{delayedOrInstant}</div>
                <div className="symField"><div className="symFieldTitle">Delay:</div>{symptom.symptomDelay}</div>
                <div className="symField"><div className="symFieldTitle">Time Window:</div>{symptom.timeWindow}</div>
              </div>
            )
          }
        })
      }
    }
    function renderMeals(meals){
      if(meals.length>0){
        return meals.map((meal,ind)=>{
            if(meal.foodName){
              const mealFoods = meal.foodName.split(',');
              const mealAmount = meal.foodAmount.split(',');
                  return (
              <div key={ind} className="meal">
                {mealFoods.map((food,ind)=> {
                  return <div className="mealFood" key={ind}><div style={{width:'80%', borderRight:'2px solid black', paddingRight:'5px', marginRight:'15px'}}>{food}</div> {mealAmount[ind]}</div>
                })}
              </div>
            )
          }
        })
      }
    }
    return this.state.entries.map((day,ind)=>{
      return (
        <div className="dayEntry" key={ind}>
          <div className="entryInfo">
            <div className="entryNumber">Entry Number: {day.entryNumber} </div>
            <div className="entryDate">{moment(day.date).format("MMM Do YY")} </div>
         </div>
          <div className="entryDataWrap">
            <div className='mealsTitle'>Meals: <span style={{marginLeft:'10px'}}>1=Little 2=Average 3=Alot</span><div className="mealsWrap">{renderMeals(day.meals)}</div></div>
            <div className="symptomTitle">Symptoms: <span style={{marginLeft:'10px'}}>Severity 1-10</span><div className="symptomsWrap">{renderSymptoms(day.symptoms)}</div></div>
          </div>
        </div>
      )
    })
  }
  render() {
    return (
      <div className="entries">
          <div className="dailyEntriesTitle">Daily Entries<i onClick={this.addEntry} className="fas fa-plus-circle"></i></div>
            <div className="entriesWrap">
              <NewEntry newEntry={this.state.newEntry} entryNumber={this.state.entryNumber} entry={this.state.entries[0]}/>
              {this.renderDayEntries()}
         </div>
      </div>
    );
  }
}



export default Entries;
