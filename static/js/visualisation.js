function listDatasets(){
  var URL = "/data_list"
  var datasetList;
  $.get(URL, function(response){
    datasetList = JSON.parse(response);
  }).fail(function(){
      console.log("ERROR");
  }).always(function(){
    var selectbox = document.getElementById('dataset-selectbox');
    datasetList.forEach(elem => {
      opt = document.createElement('option');
      opt.value = elem;
      opt.innerHTML = elem;
      selectbox.appendChild(opt);
    });
    listYears();
  });
}

function listYears(){
  var URL = "/get_dataset"
  var e = document.getElementById("dataset-selectbox");
  var dname = e.options[e.selectedIndex].value; 
  URL = URL + "/" + dname;
  var responseObj = null;

  $.get(URL, function(response){
    responseObj = JSON.parse(response)[0].years;
  }).fail(function(){
    console.log("ERROR updating years listbox");
  }).always(function(){
    var selectbox = document.getElementById('years-selectbox');
    while (selectbox.length > 0) {
      selectbox.remove(selectbox.length-1);
    }
    responseObj.forEach(elem => {
      elem = elem["year"]
      opt = document.createElement('option');
      opt.value = elem;
      opt.innerHTML = elem;
      selectbox.appendChild(opt);
    });
  });
}

function displayData(){
    var URL = "/get_dataset"
    var e = document.getElementById("dataset-selectbox");
    var dname = e.options[e.selectedIndex].value; 
    URL = URL + "/" + dname;

    var e = document.getElementById('years-selectbox');
    var year = e.options[e.selectedIndex].value; 
    
    $.get(URL, function(response){
      responseObj = JSON.parse(response)[0].years;
      var data = responseObj.find(function(elem){
        return elem.year == year;
      });
      createPlot(data, dname);
    }).fail(function(){
        console.log("ERROR");
    }).always(function(){
        console.log("DONE!");
    });
}

function createPlot(data, dname){
  console.log(dname);
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  /* 
  * value accessor - returns the value to encode for a given data object.
  * scale - maps value to a visual display encoding, such as a pixel position.
  * map function - maps from data value to display value
  * axis - sets up axis
  */ 

  // setup x 
  var xValue = function(d) { return d.payload;} // data -> value
  var xScale = d3.scaleLinear().range([0, width]); // value -> display
  var xMap = function(d) { return xScale(xValue(d));} // data -> display
  var xAxis = d3.axisBottom(xScale);

  // setup y
  var yValue = function(d) { return d.payload;} // data -> value
  var yScale = d3.scaleLinear().range([height, 0]);
  var yMap = function(d) { return yScale(yValue(d));}
  var yAxis =  d3.axisLeft(yScale);


  // add the graph canvas to the body of the webpage
  var svg = d3.select("#svg-canvas");
  svg.selectAll("*").remove();

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // change string (from CSV) into number format
    data.countries.forEach(function(d) {
      d.payload = +d.payload;
    });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data.countries, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data.countries, yValue)-1, d3.max(data, yValue)+1]);

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
      .text(dname);

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
      .text(dname);

  // draw dots
  svg.selectAll(".dot")
      .data(data.countries)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", "#E23B5E") 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.country_name + "<br/> (" + xValue(d) 
	        + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

}