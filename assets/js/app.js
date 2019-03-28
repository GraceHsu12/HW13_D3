// obtain data arrays

var stateAbbr = [];
var healthCare = [];
var income = [];
var obesity = [];
var smokes = [];
var poverty = [];

d3.csv('assets/data/data.csv').then(function(data){
    data.forEach(function(d){
        stateAbbr.push(d.abbr);
        healthCare.push(+d.healthcare);
        income.push(+d.income);
        obesity.push(+d.obesity);
        smokes.push(+d.smokes);
        poverty.push(+d.poverty);
    });


    var currentData = [];
    for(i=0; i<51; i++) {
        var new_x = poverty[i];
        var new_y = healthCare[i];
        var labels = stateAbbr[i];
        currentData.push([new_x, new_y, labels]);
    }

    console.log(currentData);

    // Create chart dimensions
    var chart_width = 600;
    var chart_height = 500;
    var padding = 50;
    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 50
    };

    // Create SVG element
    var svg = d3.select('#scatter')
        .append('svg')
        .attr('width', chart_width + margin.left + margin.right)
        .attr('height', chart_height + margin.top + margin.bottom);

    // Create chart Group
    var chartGroup = svg.append('g')
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create scales
    var x_scale = d3.scaleLinear()
        .domain([d3.min(currentData, function(d){
            return d[0] - 2;
        }),
        d3.max(currentData, function(d){
            return d[0] + 2;
        })])
        .range([padding, chart_width-padding*2]);

    var y_scale = d3.scaleLinear()
        .domain([0, d3.max(currentData, function(d){
            return d[1];
        })])
        .range([chart_height - padding, padding]);

    // Create Axes
    var x_axis = d3.axisBottom(x_scale);
    var y_axis = d3.axisLeft(y_scale);

    
    // add axes to the page
    chartGroup.append('g')
        .attr('class', 'x-axis')
        // move axis to bottom
        .attr('transform', 
            'translate(0,' + (chart_height - padding) + ')')
        .call(x_axis);

    chartGroup.append('g')
        .attr('class', 'y-axis')
        .attr('transform',
            'translate(' + padding + ',0)')
        .call(y_axis);



    // Create circles
    chartGroup.selectAll('circle')
        .data(currentData)
        .enter()
        .append('circle')
        .attr('cx', function(d){
            return x_scale(d[0]);
        })
        .attr('cy', function(d){
            return y_scale(d[1] + 0.25);
        })
        .attr('r', 10)
        .attr('fill', 'red');

    // Create labels
    chartGroup.selectAll('.label')
        .data(currentData)
        .enter()
        .append('text')
        .classed('label', true)
        .text(function(d){
            return d[2];
        })
        .attr('x', function(d){
            return x_scale(d[0]);
        })
        .attr('y', function(d){
            return y_scale(d[1]);
        })
        .attr('font-size', 10)
        .attr('text-anchor', 'middle');

    // Create Axis labels
    chartGroup.append("text")
        // .attr("transform", "translate(" + (chart_width / 2) + " ," + (chart_height - margin.top) + ")")
        .attr('x', chart_width/2)
        .attr('y', 0 + chart_height)
        .style("text-anchor", "middle")
        .classed('x_label', true)
        .text("In Poverty (%)");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr('x', 0-(chart_height / 2))
        .attr('y', 0-margin.right)
        .attr('dy', '1em')
        .style("text-anchor", "middle")
        .classed('y_label', true)
        .text("Lacks Healthcare (%)");

});
