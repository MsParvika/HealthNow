function showChart(queryKey) {

    var width = 500;
    var height = 470;
    var color = d3.scaleOrdinal().domain([0, 1]).range(['#ffb36d', '#6D8DF6']);//(d3.schemePastel1);


    if (!queryKey) {
        queryKey = "Symptom";
    }

    var toolTip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "white")
        .style("padding", "9px")
        .style("background-color", "rgba(0, 0, 0, 0.75)")
        .style("border-radius", "6px")
        .style("font", "10px Georgia")
        .text("tooltip");


    var svg = d3.select("#network").attr("width", width).attr("height", height);

    svg.selectAll("*").remove();

    /*
    svg.call(
        d3.zoom()
            .scaleExtent([.1, 4])
            .on("zoom", function () {
                container.attr("transform", d3.event.transform);
            })
    );*/


    d3.json("processedData/node.json").then(function (graph) {

        var scaleForRadius = d3.scaleSqrt().domain([0, 150]).range([0, 50]);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force('charge', d3.forceManyBody()
                .strength(-4000)
                .theta(0.8)
                .distanceMax(700)
            )
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force('anti_collide', d3.forceCollide(function (d) {
                return scaleForRadius(d.freq) + 20
            }));
        ;

        function run(graph) {

            graph.links.forEach(function (d) {
            });

            var link = svg.append("g")
                .style("stroke", "#50559E")
                .style("stroke-width", 1.5)
                .selectAll("line")
                .data(graph.links)
                .enter().append("line");

            var node = svg.append("g")
                    .style("stroke", "#50559E")
                    .style("stroke-width", 1.5)
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(graph.nodes)
                    .enter().append("circle")
                    .attr("r", function (d) {
                        return d.freq;
                    })
                    .attr("fill", function (d) {
                        return color(d.group);
                    })
                    .on("click", function (d) {
                        toolTip.style("visibility", "hidden");
                        showChart(d.id);
                        show_time_series(d.id);
                        barChart(d.id);
                        add(d.id);
                        add_details(d.id);
                    })
                /*.on('mouseover', function (d) {
                    toolTip.text(d.id);
                    toolTip.style("visibility", "visible");
                })
                .on("mousemove", function (d) {
                    toolTip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", function (d) {
                    toolTip.style("visibility", "hidden");
                })*/;


            //node.on("click", run(d));
            // node.on("click", showChart(d.id));

            node.call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


            var label = svg.append("g")
                .attr("class", "labels")
                .selectAll("text")
                .data(graph.nodes)
                .enter().append("text")
                .attr("class", "label")
                .text(function (d) {
                    return d.id;
                })
                .on("click", function (d) {
                    toolTip.style("visibility", "hidden");
                    showChart(d.id);
                    show_time_series(d.id);
                    barChart(d.id);
                    add(d.id);
                    add_details(d.id);
                })
                .on("mouseover", function (d) {
                    d3.select(this).style("opacity", 0);
                    toolTip.text(d.id);
                    toolTip.style("visibility", "visible");
                    //d3.select(this).remove();
                })
                .on("mousemove", function (d) {
                    d3.select(this).style("opacity", 0);
                    toolTip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", function (d) {
                    /*d3.select(this).append("text")
                        .attr("class", "label")
                        .text(function (d) {
                            return d.id;
                        }); */
                    toolTip.style("visibility", "hidden");
                    d3.select(this).style("opacity", 1);
                });


            simulation
                .nodes(graph.nodes)
                .on("tick", ticked);

            simulation.force("link")
                .links(graph.links);

            function ticked() {
                link
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                node
                    .attr("r", function (d) {
                        return d.freq;
                    })
                    .attr("fill", function (d) {
                        return color(d.group);
                    })
                    .style("stroke", "#424242")
                    .style("stroke-width", "1px")
                    .attr("cx", function (d) {
                        return d.x + 5;
                    })
                    .attr("cy", function (d) {
                        return d.y - 3;
                    });

                label
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
                    .style("text-anchor", "middle")
                    .style("font-size", "12px").style("fill", "#333");

            }
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
        }

        function dragged(d) {
            d.fx = d3.event.x
            d.fy = d3.event.y
        }

        function dragended(d) {
            d.fx = d3.event.x
            d.fy = d3.event.y
            if (!d3.event.active) simulation.alphaTarget(0);
        }


        run(graph[queryKey])

    })


}