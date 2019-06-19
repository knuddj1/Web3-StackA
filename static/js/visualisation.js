var BASE_DATA_URL = '/get_dataset'
var dataset1 = null;
var dataset2 = null;
var dname1 = null;
var dname2 = null;

function getSelectboxVal(selectBoxName){
  var sb = document.getElementById(selectBoxName);
  var val = sb.options[sb.selectedIndex].value;
  return val;
}

function listDatasets(){
  var url = "/data_list";
  var datasetList;
  $.get(url, function(response){
    datasetList = JSON.parse(response);

    var selectboxes = []
    selectboxes.push(document.getElementById('dataset-selectbox'));
    selectboxes.push(document.getElementById('dataset-selectbox2'));
    datasetList.forEach(elem => {
      selectboxes.forEach(sbox => {
        opt = document.createElement('option');
        opt.value = elem;
        opt.innerHTML = elem;
        sbox.appendChild(opt);
      });
    });

    listYears();

  }).fail(function(){
      console.log("ERROR");
  })
}

function getSameYears(d1, d2) {
  var ret = [];
  for(var i in d1) {  
    for(var j in d2) { 
      if(d1[i].year == d2[j].year){
        ret.push(d1[i].year);
        break;
      }
    }
  }
  return ret;
};

function listYears(){
  dname1 = getSelectboxVal('dataset-selectbox');
  dname2 = getSelectboxVal('dataset-selectbox2');
  var url1 = BASE_DATA_URL + '/' + dname1;
  var url2 = BASE_DATA_URL + '/' + dname2;

  $.get(url1, function(response){
    dataset1 = JSON.parse(response)[0].years;
     
    $.get(url2, function(response){
      dataset2 = JSON.parse(response)[0].years;
      years = getSameYears(dataset1, dataset2);
      
      minYear = Math.min.apply(Math, years);
      maxYear = Math.max.apply(Math, years);
      
      var slider = document.getElementById("years-slider");
      slider.min = minYear;
      slider.max = maxYear;
      slider.value = minYear;
    }).fail(function(){
      console.log("ERROR fetching second dataset failed");
    });

  }).fail(function(){
    console.log("ERROR fetching first dataset failed");
  });
}

function combineSets(d1, d2){
  var combined = [];
  for(var i in d1) {  
    for(var j in d2) { 
      if(d1[i].country_name == d2[j].country_name){
        combined.push({'country_name': d1[i].country_name, 'payload1': d1[i].payload, 'payload2': d2[j].payload});
        break;
      }
    }
  }
  return combined;
}

  function findYear(arr, year){
  return arr.find(function(elem){
    return elem.year == year;
  });
} 

function displayData(){
  var year = document.getElementById("years-slider").value;
  d1 = findYear(dataset1, year);
  d2 = findYear(dataset2, year);
  data = combineSets(d1.countries, d2.countries);
  createPlot(data, dname1, dname2);
}

function createPlot(data, dname1, dname2){
  var margin = {top: 20, right: 20, bottom: 30, left: 40};
  var  width = 960 - margin.left - margin.right;
  var  height = 500 - margin.top - margin.bottom;

  // setup x 
  var xValue = function(d) { return d.payload1;} // data -> value
  var xScale = d3.scaleLinear().range([0, width]); // value -> display
  var xMap = function(d) { return xScale(xValue(d));} // data -> display
  var xAxis = d3.axisBottom().scale(xScale);

  // setup y
  var yValue = function(d) {return d.payload2;} // data -> value
  var yScale = d3.scaleLinear().range([height, 0]);
  var yMap = function(d) { return yScale(yValue(d));}
  var yAxis =  d3.axisLeft().scale(yScale);


  // add the graph canvas to the body of the webpage
  var svg = d3.select("#svg-canvas");
  svg.selectAll("*").remove();

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .attr("fill", "#faeb2c")
      .style("font-size","20px")
      .text(dname1);

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .attr("fill", "#faeb2c")
      .style("font-size","20px")
      .text(dname2);
  
  // draw dots
  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .attr("cx", xMap)
    .attr("cy", yMap)
    .style("fill", "#E23B5E") 
    .on("mouseover", function(d) {
        tooltip.transition()
              .duration(200)
              .style("opacity", .9);
        tooltip.html(d.country_name + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
              .style("left", (d3.event.pageX + 5) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
    })
      .on("mouseout", function(d) {
          tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
      });

}