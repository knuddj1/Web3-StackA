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
    d3.selectAll("#test > *").remove();
    root = d3.select("#test")

    width = +root.attr("width");
    height = +root.attr("height");

    var g = root.selectAll("g")
    .data(data);
    
    data = normalize(data);

    g.exit().remove();

    var en = g.enter().append("g")
      .attr("transform",function(d){
      return "translate(" +  d.payload * width +  "," + d.year * height + ")"
    });

    var circle = en.append("circle")
        .attr("r",10)
        .attr("fill", function(d){
          return getRandomColor()}
        );

    en.append("text").text(function(d){ return d.year})
}

function get_max(data){
  var max_pay = 0;
  var max_year = 0
  for (var i = 0; i < data.length; i++){
    if (data[i].payload > max_pay){
      max_pay = data[i].payload
    }
    if (data[i].year > max_year){
      max_year = data[i].year
    }
  }
  return max_pay, max_year;
}

function normalize(data){
  var max_pay, max_year = get_max(data);
  console.log(max_pay, max_year)
  for (var i = 0; i < data.length; i++){
    data[i].payload = data[i].payload / max_pay;
    data[i].year = data[i].year / max_year;
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