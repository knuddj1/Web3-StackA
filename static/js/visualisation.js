function displayData(URL){
    $.get(URL, function(response){
      var responseObj = JSON.parse(response)[0];
      update(responseObj.cell_data);
    }).fail(function(){
        console.log("ERROR");
    }).always(function(){
        console.log("DONE!");
    });
}

function update(data){
    root = d3.select("#test")

    width = +root.attr("width");
    height = +root.attr("height");

    var g = root.selectAll("g")
    .data(data);
    
    data = normalize(data);

    var en = g.enter().append("g")
      .attr("transform",function(d){
      return "translate(" +  d.payload * width +  "," + Math.random() * height + ")"
    });

    var circle = en.append("circle")
        .attr("r",10)
        .attr("fill", function(d){
          return getRandomColor()}
        );

    en.append("text").text(function(d){ return d.year})
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