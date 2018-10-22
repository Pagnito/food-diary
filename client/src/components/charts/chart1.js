import * as d3 from "d3";
export function renderChart1(data) {
  let chart1 = {
    height: 200,
    width: 200
  };

  let colors = [
    "#97ce31",
    "#14680e",
    "#f4d942",
    "#3187ce",
    "#9b37e8",
    "#cc3c2e",
    "#e0a118",
    "#936f14",
    "#9b1494",
    "#2dc6cc",
    '#757737',
    '#774e37',
    '#e05608',
    '#210763',
    '#324e4a',
    '#ebbcfc',
    '#f9eafe',
    '#a33260'
  ];
  let radius = chart1.height / 2;
  let svg = d3.select("#chart1").append("svg");
  svg.attr("height", chart1.height).attr("width", chart1.width)
  //.style("border", "1px solid red");
  let g = svg
    .append("g")
    .attr("transform", `translate(${radius},${chart1.height / 2})`);
  let pie = d3
    .pie()
    .sort(null)
    .value(d => d);
  let arc = d3
    .arc()
    .innerRadius(radius * 0.8)
    .outerRadius(radius * 0.4);


  g.selectAll("path")
    .data(pie(data.amounts))
    .enter()
    .append("path")
    .attr("stroke", "white")
    .attr("d", arc)
    .attr("fill", (d, i) => {
      return colors[i];
    });


    let chart = d3.select('#chart1');
    chart.append('div').attr('class', 'labels');
    let html = ``;
      data.foods.forEach((food,ind)=>{
        html += `<div class="label">
                    <div style="background:${colors[ind]}" class="colorBox"></div>
                    <div class="foodName">${food}</div>
                 </div>`
      })
      document.querySelector('.labels').innerHTML = html;


}
