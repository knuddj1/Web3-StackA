function listCountries(){
  var URL = "/countries_list"
  var responseObj;
  var countries_lst = [];
  $.get(URL, function(response){
    responseObj = JSON.parse(response);
  }).fail(function(){
      console.log("ERROR");
  }).always(function(){
    responseObj.forEach(elem => {
      countries_lst.push(elem["country_name"]);
    });

    var selectbox = document.getElementById('countries-selectbox');
    countries_lst.forEach(elem => {
    elem = "/" + elem;
    opt = document.createElement('option');
    opt.value = elem;
    opt.innerHTML = elem;
    selectbox.appendChild(opt);
    });
  });
}
  
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
  });
}


function displayData(){
    URL = "/country"

    var e = document.getElementById("countries-selectbox");
    var country = e.options[e.selectedIndex].value;

    if(country != "All"){URL = URL + country;}

    $.get(URL, function(response){
      var responseObj = JSON.parse(response)[0];
      console.log(responseObj);
      update(responseObj["cell_data"]);
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

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}