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
      opt.value = '/' + elem;
      opt.innerHTML = elem;
      selectbox.appendChild(opt);
    });
    listYears();
  });
}

function listYears(){
  var URL = "/get_dataset"
  var e = document.getElementById("dataset-selectbox");
  var dataset = e.options[e.selectedIndex].value; 
  URL = URL + dataset;
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
    var dataset = e.options[e.selectedIndex].value; 
    URL = URL + dataset;

    var e = document.getElementById('years-selectbox');
    var year = e.options[e.selectedIndex].value; 
    
    $.get(URL, function(response){
      responseObj = JSON.parse(response)[0].years;
      var data = responseObj.find(function(elem){
        return elem.year == year;
      });
      console.log(data);
    }).fail(function(){
        console.log("ERROR");
    }).always(function(){
        console.log("DONE!");
    });
}