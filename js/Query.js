function add(keyword) {

    //Create an input type dynamically.
    var element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "button");
    element.setAttribute("value", keyword);
    element.setAttribute("name", keyword);
    element.setAttribute("class", "btn btn-info");
    element.setAttribute("id", "backMe");


    var foo = document.getElementById("keywords");

    //Append the element in page (in span).
    foo.appendChild(element);

}