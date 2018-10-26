function getPatterns(data){
  const allPatterns = {};
  function foodsEatenLowToHigh(entries){
    let foodsObj = {};
    entries.map(entry=>{
      entry.meals.map(meal=>{
        if(meal.foodName){
          let foodAmount = meal.foodAmount.split(',');
          meal.foodName.split(',').map((foodItem,ind)=>{
            if(foodsObj.hasOwnProperty(foodItem)){
              foodsObj[foodItem]+=Number(foodAmount[ind])
            } else {
              foodsObj[foodItem] =  Number(foodAmount[ind])

            }
          })
        }
      })
    })
    let chartReady = {};
    let foods = [];
    let amounts = [];
    let sortable = [];
    for(let p in foodsObj){
      sortable.push([p, Number(foodsObj[p])])
    }
    let sorted = sortable.sort((a,b)=>{
      return a[1]-b[1];
    })
    let sortedFoodsObj = {};

    sorted.forEach(item=>{
      let food = item[0]

      sortedFoodsObj[food] = item[1]
    })

    for(let k in sortedFoodsObj){

        if(sortedFoodsObj[k] > 2){
          amounts.push(sortedFoodsObj[k]);
          foods.push(k);
        }
    }

    chartReady.amounts = amounts;
    chartReady.foods = foods
   return chartReady;
  }
  function symptomsInMonth(entries){
    let dayCounter = 1;
    let severity = 1;
    let severities = [];
    let last30 = entries.slice(-30);
    last30.map(entry=>{
      entry.symptoms.map(symptom=>{
        if(symptom.severity>severity){
            severity=symptom.severity;
        }
      })
        severities.push(severity);
        severity=1;
      dayCounter+=1;
    })
    return severities;
  }

  function findPattern1(entries){
    const symptomRedZone=7;
    const matchThreshold=5;
    const dayObj = {};
    entries.map((entry,ind)=>{

      dayObj[ind]={};
      dayObj[ind].foods = [];
      dayObj[ind].symptoms = [];
      let foods = [];
      let symptoms = [];
      entry.meals.map(meal=>{
        if(meal.foodName){
            foods.push(meal.foodName.split(','));
            dayObj[ind].foods = foods;
          }
        })

      entry.symptoms.map(symptom=>{
        if(symptom.symptom){
          symptoms.push(symptom.symptom);
              dayObj[ind].symptoms = symptoms;
            }
        });
      })


      let days = {};
      let pairs = [];
      let i = 0;
      let j = 0;
      let filteredPairs = [];
      let filteredSyms = [];
      let forErySymptom = {};
      for(let key in dayObj){
        if(dayObj[key].symptoms.length>0){
          if(i===0){
            filteredSyms = dayObj[key].symptoms.filter((sym,ind,self)=>{
              return self.indexOf(sym)===ind;
            })
            dayObj[key].symptoms = filteredSyms
          }
          pairs=[];
           dayObj[key].symptoms.map(symptom=>{

           dayObj[key].foods.map(meal=>{

            meal.map(foodItem=>{
             pairs.push([foodItem,symptom])
            })
          });
        })

          days[i]=pairs;
          i++;
        }
     }

      //console.log(days)
      for(let key2 in days){
        filteredPairs = [];
         days[key2].forEach((pair2,ind)=>{
           pair2 = pair2.toString();
           if(filteredPairs.indexOf(pair2)<0){
             filteredPairs.push(pair2)
           };
         });
         days[key2] = filteredPairs.map(thisPair=>{return thisPair.split(',')});
         j++
      }
      let allPairs = [];
      for(let key3 in days){
        days[key3].map(pairs=>{
          allPairs.push(pairs.toString())
        })
      }
      //console.log(days)

        let patterns = [];
        allPairs.sort().forEach((pair,ind)=>{
        if(allPairs[ind-1]===pair){
          patterns.push(pair)
        }
       })
        //console.log(allPairs)
        //console.log('this is patterns', patterns)

      return patterns;

  }
  foodsEatenLowToHigh(data)
  return {
    pattern1:findPattern1(data),
    pattern2:symptomsInMonth(data),
    pattern3:foodsEatenLowToHigh(data)
  }
}
module.exports.getPatterns = getPatterns;
