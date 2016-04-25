$(document).ready(function() {
  // data variables
  var dataURL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  var	parseDate = d3.time.format("%Y-%m-%d").parse;
  var xColumn = "date";
  var yColumn = "gdp";

  // display variables
  var margin = {top: 10,
        right: 10,
        bottom: 40,
        left: 75},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // render data to svg box
  function render(d){
    // tool tip
    var tip = d3.tip()
    .attr('class', 'tooltip-custom')
    .offset([-10, 0])
    .html(function(d) {
      var year = d[xColumn].getFullYear();
      var month = d[xColumn].getMonth();
      if (month == 0) month = "Jan";
      if (month == 3) month = "Apr";
      if (month == 6) month = "Jul";
      if (month == 9) month = "Oct";
      return "<div>GDP: <strong><span style='color:red'>$" + d[yColumn] + " B</span></strong></div><div><span>"+month+" "+year+"</span></div>";
    })

    // Make bars fill the graph
    var barWidth = Math.ceil(width / d.length);

    // Make scale
    var minDate = new Date(d[0].date);
    var maxDate = new Date(d[d.length-1].date);
    var xScale = d3.time.scale().range([0, width]).domain([minDate, maxDate]);
    var yScale = d3.scale.linear().range([height, 0]).domain([0, d3.max(d, function(d) {return d[yColumn] })]);

    // Make axes
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(d3.time.years, 5);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);

    // Initilize the chart size
     var chart = d3.select(".chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add axes
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    chart.append("g")
      .attr("class","x axis")
      .append("text")                // text label for the x axis
      .attr("transform",
          "translate(" + (width/2) + " ," +
                         (height+margin.bottom-1) + ")")
      .style("text-anchor", "middle")
      .text("Year");

    chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    chart.append("g")
      .attr("class", "y axis")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0-margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Billion US Dollars");

    // add tip
    chart.call(tip);

    // bind data
    var bars = chart.selectAll(".bar")
      .data(d);

    // on enter
    bars.enter().append("rect")

    // on update
    bars
      .attr("class", "bar")
      .attr("x", function(d) {return xScale(d[xColumn]);})
      .attr("y", function(d) {return yScale(d[yColumn]);})
      .attr("height", function(d) {return height - yScale(d[yColumn]);})
      .attr("width", barWidth)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  };

  function display(details){
    $('#details').append(details)
  }

  // get and format data
  d3.json(dataURL, function(json) {
    var d = [];
    json.data.forEach(function(entry,i){
      var thisEntry ={
        date: parseDate(entry[0]),
        gdp: entry[1]
      }
      d.push(thisEntry);
    });

    display(json.description);
    render(d);
  });


});
