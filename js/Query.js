function add(keyword) {

    //Create an input type dynamically.
    var element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "button");
    element.setAttribute("value", keyword);
    element.setAttribute("name", keyword);
    element.setAttribute("class", "btn btn-info btn-sm");
    element.setAttribute("id", "backMe");
    //element.setAttribute('onclick','showChart(keyword);');
    element.onclick = function () {
        showChart(keyword);
        show_time_series(keyword);
        barChart(keyword);
        add_details(keyword);
    };

    var foo = document.getElementById("keywords");
    var arr = Array.from(foo.children);
    var flag = 1;
    if (keyword != "") {
        arr.forEach(function (d) {
            if (d.value == keyword) {
                flag = 0;
            }
        });

        if (flag == 1 || foo.childElementCount == 0) {
            foo.appendChild(element); //Append the element in page (in span).
        }
    }
}