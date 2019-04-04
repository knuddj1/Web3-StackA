function displayData(URL){
    $.get(URL, function(response){
      var responseObj = JSON.parse(response);
      console.log(response);
      console.log(responseObj);
    }).fail(function(){
        console.log("ERROR");
    }).always(function(){
        console.log("DONE!");
    });
}

function prepare_data(data){

}

function update(data){
    var bBox = d3.select("svg");
    width = +bBox.attr("width");
    height = +bBox.attr("height");
    data = []
    for(var i = 0; i < 20; i ++){
        data[i] = getRandomInt(1, width)
    }
    var c = bBox.selectAll("circle")
    .data(data);
    c.exit().remove();
    c.enter().append("circle");
    c.attr("r",10)
    .attr("transform",function(d,i){ return "translate(" +  getRandomInt(1, width) + "," +  getRandomInt(1, height) + ")"})
}
