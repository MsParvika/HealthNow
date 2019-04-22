function show_time_series(symptom) {

    readTextFile("data.json", function(text){
        inp = symptom
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
                    width: 4
                },
                marker: {
                    size: 8
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
            autosize: false,
            width: 800,
            height: 400,
            title:"Yearly Symptoms Trend ",
            "titlefont": {
            "size": 24,
        },
            yaxis: {
                title: 'Frequency'
            }
        };

        Plotly.newPlot('time_series', plot_data, layout, {displayModeBar: false});

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