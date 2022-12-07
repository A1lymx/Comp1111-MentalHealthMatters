/**
* This function is for Searching 
*/
function goSearch() {
    document.forms[0].target = "_blank";
    document.forms[0].submit();
}

/**
 * This function is for approaching gender data csv
 * @param {object} data - dataset
*/
async function getData() {
    const path = "/archive/Student_Mental_Health.csv"
    var data = d3.csv(path)
    return data
}


/** 
 * This function is for counting each mental condition for each gender
 * @param {object} data - dataset
 * @param {string} gender - either 'Male' or 'Female'
 * @param {object} result - initiate a new object to store the result
 * @param {string} Mental_Condition - 0, 1 or 2, each representing a mental condition
 */
function getMentalConditionByGender(gender, data) {
    result = {}
    for (const element of data) {
        if (element['Choose your gender'] === gender) {
            if (element['Mental_Condition'] in result) {
                result[element['Mental_Condition']] += 1
            } else {
                result[element['Mental_Condition']] = 0
            }
        }
    }
    return result
}
/**
 * This function is for drawing the pie chart
 * @param {object} data - dataset
 * @param {string} id - to represent different filter 
 */
function drawPieChart(data, id) {
    console.log("in draw pie chart. ", data);
    // set the dimensions and margins of the graph
    var width = 450
    height = 450
    margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select(id)
        .append("svg")
        .attr("viewBox", `0 0 450 450`)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // set the color scale
    var color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c']);

    // A function that create / update the plot for a given variable:
    function update(data) {
        // Compute the position of each group on the pie:
        var pie = d3.pie()
            .value(function (d) { return d.value; })
            .sort(function (a, b) { return d3.ascending(a.key, b.key); }) // This make sure that group order remains the same in the pie chart
        var data_ready = pie(d3.entries(data))

        // map to data
        var u = svg.selectAll("path")
            .data(data_ready)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        u
            .enter()
            .append('path')
            .merge(u)
            .transition()
            .duration(1000)
            .attr('d', d3.arc()
                .innerRadius(radius - 80)
                .outerRadius(radius)
            )
            .attr('fill', function (d) { return (color(d.data.key)) })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 1)

    }

    // Initialize the plot with the first dataset
    update(data)
}
/**
 * This function is for combining id with different filter
 * @param {string} gender - either male or female
 * @param {string} id - to represent different filter
 */
function selectGender(gender, id) {
    getData().then(
        function (data) {
            var result = getMentalConditionByGender(gender, data);
            drawPieChart(result, id);
        }
    )
}

selectGender(gender = 'Male', id = "#my_dataviz1")
selectGender(gender = 'Female', id = "#my_dataviz2")




