// var data = [1,2,3,4,5]
// var canvas = d3.select("#visualisation")

// var circle = svg.selectAll("circle")
//   .data(data);

// circle.exit().remove();

// circle.enter().append("circle")
//     .attr("r", 2.5)
//   .merge(circle)
//     .attr("cx", function(d) { return d.x; })
//     .attr("cy", function(d) { return d.y; });


function displayData(URL){
    $.get(URL, function(response){
        console.log(response)
    }).fail(function(){
        console.log("ERROR");
    }).always(function(){
        console.log("DONE!");
    });
}