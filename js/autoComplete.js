$(document).ready(function () {
    var topics = [
        "Alabama",
        "Alaska",
        "Arizona",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming"
    ];

    $("#autocomplete").autocomplete({
        source: topics
    });
});