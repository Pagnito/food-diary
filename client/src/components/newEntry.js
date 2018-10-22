import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

/* eslint react/prop-types: 0 */
class NewEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newEntry: false,
      entry: {
        meals:[],
        symptoms:[]
      },
      entryNumber: "",
      symptom: "",
      startTime: "",
      severity: "",
      instant: "",
      delay: "",
      timeWindow: "",
      foodName: "",
      foodAmount: "",
      meal: {
        foods: [],
        foodAmounts: []
      },
      errors: {}
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.entryNumber !== prevProps.entryNumber){
        this.createEntryNumber();
    }
    if(this.props.entry !== prevProps.entry){
        this.setState({entry: this.props.entry})
        this.renderIfSameDay();
    }
    if(this.props.newEntry !== prevProps.newEntry){
        this.setState({newEntry:true})
     }
   }

  createEntryNumber = () => {
    this.setState({ entryNumber: this.props.entryNumber });
  };

  addSymptom = () => {
    let errors ={};
    const symptomObj = {
      entryNumber: this.state.entryNumber,
      symptom: this.state.symptom,
      startTime: this.state.startTime,
      severity: this.state.severity,
      delayedOrInstant: this.state.instant == "Yes" ? true : false,
      symptomDelay: this.state.delay,
      timeWindow: this.state.timeWindow,
    };
    if(symptomObj.severity>10 && symptomObj.severity<1){
      errors.severity='1-10'
    } else {
      errors={}
    }
    if(/\d?\d:\d\d/.test(symptomObj.startTime)===false){
      errors.startTime="0:00 format"
    } else{
      errors={}
    }
    if(/\d?\d?:?(\d\d)/.test(symptomObj.symptomDelay)===false){
      errors.symptomDelay="00 or 0:00 format"
    } else {
      errors={}
    }
    if(/\d?\d?:?(\d\d)/.test(symptomObj.timeWindow)===false){
      errors.timeWindow="00 or 0:00 format"
    } else {
      errors={}
    }
    this.setState({errors:errors})
    if(Object.keys(errors).length===0 && symptomObj.symptom.length>0){
      axios.post("/api/addSymptom", symptomObj).then(res=>{
        this.setState({entry:res.data})
      });
    }
  };
  renderFoodsInMeal = () => {
    return this.state.meal.foods.map((food, ind) => {
      return (
        <div className="foodItem" key={ind}>
          <div className="foodInNewEntry">{food}</div>
          <div className="amountInNewEntry">
            {this.state.meal.foodAmounts[ind]}
          </div>
        </div>
      );
    });
  };
  addFood = () => {
    let foods = this.state.meal.foods;
    let amounts = this.state.meal.foodAmounts;
    if(this.state.foodAmount<4 && this.state.foodAmount>0){
      amounts.push(this.state.foodAmount);
      foods.push(this.state.foodName);
      this.setState({errors:{}});
    } else {
      const errors = {};
      errors.foodAmounts='1-3';
      this.setState({errors:errors})
    }
    let newFood = {
      foods: foods,
      foodAmounts: amounts
    };
    this.setState({ meal: newFood }, () => {
      this.setState({
        foodName: "",
        foodAmount: ""
      });
    });
  };
  addMeal =()=>{
    const meal = {
      entryNumber: this.state.entryNumber,
      foodName: this.state.meal.foods,
      foodAmount: this.state.meal.foodAmounts
    }
    const emptyMeal =  {
      foods: [],
      foodAmounts: []
    }

      if(Object.keys(this.state.errors).length===0 && meal.foodName.length!==0){
      axios.post('/api/addMeal', meal).then(res=>{
        this.setState({entry: res.data}, ()=>{
          this.setState({meal:emptyMeal,
                         errors: {}})
        });
      })
    }
  }
  renderSymptoms = (symptoms) =>{
    if (moment(this.state.entry.date).format("MMM Do YY") == moment(Date.now()).format("MMM Do YY")) {
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
  }
  renderMeals = (meals) => {
    if (moment(this.state.entry.date).format("MMM Do YY") == moment(Date.now()).format("MMM Do YY")) {
      if(this.state.newEntry==false){
     return meals.map((meal, ind) => {
       if (meal.foodName) {
         const mealFoods = meal.foodName.split(",");
         const mealAmount = meal.foodAmount.split(",");
         return (
           <div key={ind} className="meal mealInNew">
             {mealFoods.map((food, ind) => {
               return (
                 <div className="mealFood" key={ind}>
                   <div
                     style={{
                       width: "80%",
                       borderRight: "2px solid black",
                       paddingRight: "5px",
                       marginRight: "15px"
                     }}>
                     {food}
                   </div>
                   {mealAmount[ind]}
                 </div>
               );
             })}
           </div>
         );
       }
     });
   }
   }
 }
  renderIfSameDay = () => {
    if(this.props.entry){
    if (moment(this.props.entry.date).format("MMM Do YY") == moment(Date.now()).format("MMM Do YY")) {
      document.getElementById("newEntry").classList.add("dropDown");

    }
  };
}
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <div id="newEntry" className="newEntry">
        Entry Number:<input
          required
          className="inputFieldInd"
          onChange={this.onChange}
          value={this.state.entryNumber}
          name="entryNumber"
        />
        <div className="mealInputsSection">

          Meals:<span style={{ marginLeft: "10px" }}>
            1=Little 2=Average 3=Alot
          </span>
          <i onClick={this.addMeal} className="fas lilCircle2 fa-plus-circle" />
          <div className="mealsList">
          <div className="mealInputsWrap">
            <div className="mealInputs">
              <div className="mealFieldTitle mealFieldTitle1">
                Food Name
                <input
                  className="inputField mealInput1"
                  onChange={this.onChange}
                  value={this.state.foodName}
                  name="foodName"

                />
              </div>
              <div className="mealFieldTitle">
                Amount
                <input
                  className="inputField mealInput2"
                  onChange={this.onChange}
                  value={this.state.foodAmount}
                  name="foodAmount"
                  placeholder={this.state.errors.foodAmounts}
                />
              </div>
              <i
                onClick={this.addFood}
                className="fas lilCircle fa-plus-circle"
              />
            </div>
            {this.renderFoodsInMeal()}
          </div>
          {this.renderMeals(this.state.entry.meals)}
        </div>
        </div>
        <div className="symptomInputSection">
          Symptoms:<span style={{ marginLeft: "10px" }}>Severity 1-10</span>
          <i onClick={this.addSymptom} className="fas lilCircle2 fa-plus-circle" />
        <div className="symptomInputsWrap">
          <div className="symptomInputs">
            <div className="inputWrapper">
              <div className="symFieldTitle">Symptom:</div>
              <input
                className="inputField inputField-900"
                onChange={this.onChange}
                value={this.state.symptom}
                name="symptom"
              />
            </div>
            <div className="inputWrapper">
              <div className="symFieldTitle">Start Time:</div>
              <input
                className="inputField inputField-900"
                onChange={this.onChange}
                value={this.state.startTime}
                name="startTime"
                placeholder={this.state.errors.startTime}
              />
            </div>
            <div className="inputWrapper">
              <div className="symFieldTitle">Severity:</div>
              <input
                className="inputField inputField-900"
                onChange={this.onChange}
                value={this.state.severity}
                name="severity"
                placeholder={this.state.errors.severity}
              />
            </div>
            <div className="inputWrapper">
              <div className="symFieldTitle">Is it Instant:</div>
              <input
                className="inputField inputField-900"
                onChange={this.onChange}
                value={this.state.instant}
                name="instant"
              />
            </div>
            <div className="inputWrapper">
              <div className="symFieldTitle">Delay:</div>
              <input
                className="inputField inputField-900"
                onChange={this.onChange}
                value={this.state.delay}
                name="delay"
                placeholder={this.state.errors.symptomDelay}
              />
            </div>
            <div className="inputWrapper">
              <div className="symFieldTitle">Time Window:</div>
              <input
                className="inputField inputField-900"
                onChange={this.onChange}
                value={this.state.timeWindow}
                name="timeWindow"
                placeholder={this.state.errors.timeWindow}
              />
            </div>
          </div>
          {this.renderSymptoms(this.state.entry.symptoms)}
        </div>
        </div>
        <div className="submitWrapper">

        </div>
      </div>
    );
  }
}

export default NewEntry;
