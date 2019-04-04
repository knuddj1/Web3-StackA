function displayData(URL){
    $.get(URL, function(response){
      var responseObj = JSON.parse(response)[0];
      update(responseObj.cell_data);
      update(responseObj.cell_data);
    }).fail(function(){
        console.log("ERROR");
    }).always(function(){
        console.log("DONE!");
    });
}

function update(data){
    var bBox = d3.select("#test");

    width = +bBox.attr("width");
    height = +bBox.attr("height");

    var c = bBox.selectAll("circle")
    .data(data);
    
    data = normalize(data);

    c.exit().remove();

    c.enter().append("circle");

    c.attr("r",10)
    .attr("transform",function(d, i){ return "translate(" +  d.payload +  "," + d.payload + ")"})
    .attr("fill", function(d, i){ return getRandomColor()});

    c.append("text").text(function(d,i){ return d[i].year})
}

function get_max(data){
  var max = 0;
  for (var i = 0; i < data.length; i++){
    if (data[i].payload > max){
      max = data[i].payload
    }
  }
  return max;
}

function normalize(data){
  var max = get_max(data);
  for (var i = 0; i < data.length; i++){
    data[i].payload = data[i].payload / max;
  }
  return data
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}