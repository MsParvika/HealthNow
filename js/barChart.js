function barChart(keyword) {
    var element1 = document.getElementById("symptomBtn");
    var element2 = document.getElementById("diseaseBtn");
    var element3 = document.getElementById("medicineBtn");
    element1.style.background = '#117a8b';
    element2.style.background = '#6B6FC8';
    element3.style.background = '#6B6FC8';

    element1.onclick = function () {
        element1.style.background = '#117a8b';
        element2.style.background = '#6B6FC8';
        element3.style.background = '#6B6FC8';
        myfunc(keyword, 'likelySymptoms', 'symptom');
    };
    element2.onclick = function () {
        element2.style.background = '#117a8b';
        element1.style.background = '#6B6FC8';
        element3.style.background = '#6B6FC8';
        myfunc(keyword, 'likelyDiseases', 'disease');
    };
    element3.onclick = function () {
        element3.style.background = '#117a8b';
        element2.style.background = '#6B6FC8';
        element1.style.background = '#6B6FC8';
        myfunc(keyword, 'likelyMedicines', 'medicine');
    };

    var width = 530;
    var height = 300;
    var margin = {top: 20, bottom: 70, left: 40, right: 20};

    var svg = d3.select('#barChart')
        //.append('svg')
        .attr('height', height)
        .attr('width', width)
        //.append("g")
        .attr('transform', 'translate(0,20)');

    myfunc(keyword, 'likelySymptoms', 'symptom');

    function myfunc(sym, top, sdm) {

        svg.selectAll("*").remove();

        d3.json("processedData/data.json").then(function (data) {

            data = data[sym][top];
            if (data.length > 10) {
                data = data.slice(0, 10);
            }

            //var tooltip = d3.select("#barChart").append("svg").attr("class", "toolTip");

            var xScale = d3.scaleBand()
                .rangeRound([0, width-margin.left])
                .padding(0.1).domain(data.map(function (d) {
                    return d[sdm];
                }));

            var yScale = d3.scaleLinear()
                .rangeRound([height, margin.bottom+10]).domain([0, d3.max(data, function (d) {
                    return Number(d.value*1.3);
                })]);

            var yAxis = d3.axisLeft().scale(yScale).ticks(5);

            svg.append("g")
                .attr("transform", "translate("+ margin.left + "," + (height - margin.bottom) + ")")
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .attr("text-anchor", "middle")
                .style("font-size", "10px")
                .attr("font-family", "serif")
                .style("fill", "black")
                .attr("transform", "rotate(-45)translate(-30,-15)");

            svg.append("g")
                .attr("transform", "translate(" + margin.left + ","+ (0 - margin.bottom) +")")
                .attr("class", "axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "translate(30,60)")
                .attr("x", -20)
                .attr("y", 2)
                .attr("dy", "15px")
                .style("text-anchor", "end")
                .style("font-size", "10px")
                .attr("font-family", "serif")
                .style("fill", "black")
                .text("Freq");

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return (xScale(d[sdm])+margin.left);
                })
                .attr("y", function (d) {
                    return (yScale(Number(d.value))-margin.bottom);
                })
                .attr("width", xScale.bandwidth())
                .attr("height", function (d) {
                    return height - yScale(Number(d.value));
                });
        });

    }
}
