var width = 500;
var height = 500;
var color = d3.scaleOrdinal(d3.schemeCategory10);
function showChart(queryKey) {

    if(!queryKey){
        queryKey = "thicken"
    }

    d3.json("dataPreprocessing/node.json").then(function (graph) {

        var svg = d3.select("#network").attr("width", width).attr("height", height);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force('charge', d3.forceManyBody()
                .strength(-200)
                .theta(0.8)
                .distanceMax(150)
            )
            .force("center", d3.forceCenter(width / 2, height / 2));


        function run(graph) {

            graph.links.forEach(function (d) {
            });

            var link = svg.append("g")
                .style("stroke", "#aaa")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line");

            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("r", 2)
                .attr("fill", function (d) {
                    return color(d.group);
                })
                .call(d3.drag()
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
                    .attr("r", 16)
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
                    .style("font-size", "10px").style("fill", "#333");
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