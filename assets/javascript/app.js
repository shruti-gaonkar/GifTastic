window.onload = function () {
    showTopicButtons();

    $(document).on("click", "#topicBtn", showImages)
        .on("click", ".gif", animateImages)

};

var topicsArr = ["captain planet", "disney", "finding nemo",
    "mickey mouse", "pink panther", "minions", "scooby doo", "teenage mutant ninja turtles", "tom and jerry",
    "the simpsons", "toy story", "wall e", "batman"];

function showTopicButtons() {
    $("#topic_div").empty();
    $.each(topicsArr, function (i, val) {
        var newBtn = $("<button id='topicBtn' class='btn btn-primary'>" + val + "</button>");
        newBtn.attr("data-cartoon", val);
        $("#topic_div").append(newBtn);
    });
}

function showImages() {
    var cartoon = $(this).attr("data-cartoon");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        cartoon + "&api_key=zONFyrtr69ZHztB9A6XPdnsh7HPATTW5&limit=10";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var results = response.data;
        for (var i = 0; i < results.length; i++) {
            var imgUrlStill = results[i].images.fixed_height_still.url;
            var imgUrlAnimate = results[i].images.fixed_height.url;
            console.log(results);
            var cartoonDiv = $("<div>");

            var cartoonImg = $("<img>");
            cartoonImg.attr("src", imgUrlStill);
            cartoonImg.attr("class", "gif");
            cartoonImg.attr("data-still", imgUrlStill);
            cartoonImg.attr("data-animate", imgUrlAnimate);
            cartoonImg.attr("data-state", "still");


            var p = $("<p>").text("Rating: " + results[i].rating);
            $(cartoonDiv).append(cartoonImg);
            $(cartoonDiv).append(p);
            $("#images_div").prepend(cartoonDiv);
        }

    });
}

//https://www.omdbapi.com/?t=the+revenant&y=&plot=short&apikey=trilogy"

function animateImages() {
    var state = $(this).attr("data-state");
    var still_image = $(this).attr("data-still");
    var animated_image = $(this).attr("data-animate");
    if (state == "still") {
        $(this).attr("data-state", "animate");
        $(this).attr("src", animated_image);
    } else {
        $(this).attr("data-state", "still");
        $(this).attr("src", still_image);
    }
};



