function show_time_series(inp) {

    readTextFile("processedData/data.json", function(text){
        var data = JSON.parse(text);
        var data_inp = data[inp];
        var time_series_data = data_inp.monthsOfPrevalance;
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var values = find_vals(time_series_data, months);

        var plot_data = [
            {
                x: months,
                y: values,
                mode: 'lines+markers',
                type: 'scatter',
                name: inp,
                line: {
                    color: '#17BECF',
                    width: 3
                },
                marker: {
                    size: 5
                },
                connectgaps: true
            }
        ];

        related_keywords = data_inp.top10Symptoms;

        for (var ind in related_keywords)
        {
            var related_keyword = related_keywords[ind];
            //console.log(related_keyword);

            if (related_keyword in data)
            {
                var data_input = data[related_keyword];
                var time_series_data = data_input.monthsOfPrevalance;
                var related_key_word_values = find_vals(time_series_data, months);

                var data1 = {
                    x: months,
                    y: related_key_word_values,
                    mode: 'lines+markers',
                    type: 'scatter',
                    name: related_keyword,
                    line: {
                        //shape: 'spline'
                    },
                    connectgaps: true
                }
                plot_data.push(data1);

            }

        }

        var layout = {
            autosize: true,
            //margin :{'t': 0, 'b': 1},
            margin: {
                l: 50,
                r: 50,
                b: 20,
                t: 10,
                pad: 4
            },
            height: 250,
            yaxis: {
                title: 'Frequency'
            }
        };

        Plotly.newPlot('time_series', plot_data, layout,{scrollZoom: true}, {displayModeBar: false});

    });
}


function readTextFile(file, callback) {
    const rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function find_vals(time_series_data, months) {

    var values = [];
    for( var month_in in months )
    {
        if (months[month_in] in time_series_data)
            values.push(time_series_data[months[month_in]]);
        else
            values.push(0);
    }

    return values;
}


//show_time_series("diarrhea");