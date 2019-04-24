function add_details(keyword) {
    d3.json("processedData/data3.json").then(function (data) {
        //console.log(data[keyword]);
        document.getElementById("details").textContent  = data[keyword].content
        var element = document.createElement("a");
        element.setAttribute("href", data[keyword].url);
        element.innerHTML = "More Info";
        //document.getElementById("details2").replaceWith(element);
        document.getElementById("more_info").href = data[keyword].url;
    });
    
}