import * as d3 from "d3";
export function renderChart2(data) {
  let chart2 = {
    width: "100%",
    height: 150,
    padding: 20,
    margin: 20
  };
  let colors = [
    "#20EA76",
    "#1ED76D",
    "#6CD71E",
    "#B5D71E",
    "#EEE11B",
    "#EECE1B",
    "#EE9E1B",
    "#EE651B",
    "#EE4E1B",
    "#FA4202"
  ];
  let svg = d3
    .select("#chart2")
    .append("svg")
    .attr("width", chart2.width)
    .attr("height", chart2.height)


  let g = svg.append('g').attr('transform', `translate(5,0)`);
    g.selectAll('rect')
     .data(data)
     .enter()
     .append('rect')
     .attr('fill', (d)=>{return colors[d-1]})
     .attr('width', `${97/6}%`)
     .attr('height', 29)
     .attr('y', (d, i)=>{return (i>5) ? 30 : i>12 ? 60 : i>18 ? 90 : i>24 ? 120 : 0 })
     .attr('x', (d,i)=>{
       return (i>5 && i <12) ? `${(i-6)*(99/6)}%`:
         (i>11 && i<18) ? `${(i-12)*(99/6)}%`:
         (i>17 && i<24) ? `${(i-18)*(99/6)}%`:
         (i>23 && i<30) ? `${(i-24)*(99/6)}%` :
         `${(i)*(99/6)}%`
      })
     .attr('stroke', (d,i)=>{
       return i==data.length-1 ? '#3187CE' : 'none'
     })
     .attr('stroke-width', 3)
     //.attr('y', (d,i)=>{return i>5 ? i*35 : 5})


}
