function barChart(keyword) {
    var element1 = document.getElementById("symptomBtn");
    var element2 = document.getElementById("diseaseBtn");
    var element3 = document.getElementById("medicineBtn");
    element1.onclick = function () {
        myfunc(keyword, 'likelySymptoms', 'symptom');
    };
    element2.onclick = function () {
        myfunc(keyword, 'likelyDiseases', 'disease');
    };
    element3.onclick = function () {
        myfunc(keyword, 'likelyMedicines', 'medicine');
    };

    var width = 530;
    var height = 220;
    var margin = {top: 20, bottom: 70, left: 28, right: 20};

    var svg = d3.select('#barChart')
        //.append('svg')
        .attr('height', height)
        .attr('width', width)
        //.append("g")
        .attr('transform', 'translate(0,20)');

    myfunc(keyword, 'likelySymptoms', 'symptom');

    function myfunc(sym, top, sdm) {

        svg.selectAll("*").remove();

        // var svg = d3.select("#barChart").attr("width", width).attr("height", height);

        /*var svg = d3.select("#barChart"),
            margin = {
                top: 20,
                right: 20,
                bottom: 80,
                left: 50
            },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        */

        d3.json("processedData/data.json").then(function (data) {

            data = data[sym][top];
            if (data.length > 10) {
                data = data.slice(0, 10);
            }

            var xScale = d3.scaleBand()
                .rangeRound([0, width-margin.right])
                .padding(0.1).domain(data.map(function (d) {
                    return d[sdm];
                }));

            var yScale = d3.scaleLinear()
                .rangeRound([height, margin.bottom]).domain([0, d3.max(data, function (d) {
                    return Number(d.value );
                })]);

            var yAxis = d3.axisLeft().scale(yScale).ticks(5);

            //var xAxis = d3.axisBottom();

            /*svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale))
                .attr("font-family", "Georgia", "serif")
                .style("font-size", "12px");
            */

            svg.append("g")
                .attr("transform", "translate("+ margin.left + "," + (height - margin.bottom) + ")")
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .attr("text-anchor", "middle")
                .style("font-size", "10px")
                .attr("font-family", "serif")
                .style("fill", "black")
                .attr("transform", "rotate(-90)translate(-30,-15)");

            //console.log(Math.PI);

            svg.append("g")
                .attr("transform", "translate(" + margin.left + ","+ (0 - margin.bottom) +")")
                .attr("class", "axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -20)
                .attr("y", 2)
                .attr("dy", "15px")
                .style("text-anchor", "end")
                .style("font-size", "10px")
                .attr("font-family", "serif")
                .style("fill", "black")
                .text("Frequency");

            /*svg.append("g")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Freq"); */

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    // console.log(d.disease)
                    return (xScale(d[sdm])+margin.left);
                })
                .attr("y", function (d) {
                    // console.log(d.value)
                    return (yScale(Number(d.value))-margin.bottom);
                })
                .attr("width", xScale.bandwidth())
                .attr("height", function (d) {
                    return height - yScale(Number(d.value));
                })
                .append("text")
                .attr("class", "label")
                .style("font-size", "10px")
                .attr("font-family", "serif")
                .style("fill", "black")
                .attr("y", function (d) {
                    return yScale(d.value);
                })
                .attr("x", function (d) {
                    return xScale(d[sdm]) + 3;
                })
                .text(function (d) {
                    return d[sdm];
                });
        });

    }
}
