function add_details(keyword) {
    d3.json("processedData/data3.json").then(function (data) {
        console.log(data[keyword]);
        document.getElementById("details").appendChild("abc");
    });
    
}