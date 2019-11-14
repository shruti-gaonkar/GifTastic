window.onload = function () {
    showTopicButtons();

    $(document).on("click", "#cartoonBtn", showCartoonImages)
        .on("click", ".gif", animateImages)
        .on("click", "#btnSubmit", addTopic)
        .on("click", "#movieBtn", showMovieImages)
        .on("click", "#btnShowMore", showCartoonImages);
};

var topicArr = [];
var limit = 10;

var cartoonArr = ["captain planet", "disney", "finding nemo",
    "mickey mouse", "pink panther", "minions", "scooby doo", "teenage mutant ninja turtles", "tom and jerry",
    "the simpsons", "toy story", "wall e"];

var movieArr = ["batman", "inception"];

function showTopicButtons() {
    $("#topic_div").empty();
    topicArr = [];
    if ($("#categoryId").val() == "cartoon") {
        topicArr = cartoonArr;
        var btn = "cartoonBtn";
    } else {
        topicArr = movieArr;
        var btn = "movieBtn";
    }
    $.each(topicArr, function (i, val) {
        var newBtn = $("<button id='" + btn + "' class='btn btn-primary'>" + val + "</button>");
        newBtn.attr("data-cat", val);
        $("#topic_div").append(newBtn);
    });
}

function showCartoonImages() {
    $("#images_div").empty();

    var cartoon = $(this).attr("data-cat");
    if ($(this).attr('data-cartoon')) {
        limit += 10;
        cartoon = $(this).attr('data-cartoon');
    }

    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        cartoon + "&api_key=zONFyrtr69ZHztB9A6XPdnsh7HPATTW5&limit=" + limit;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var results = response.data;
        console.log(results);
        for (var i = 0; i < results.length; i++) {
            var imgUrlStill = results[i].images.fixed_height_still.url;
            var imgUrlAnimate = results[i].images.fixed_height.url;


            //console.log(results[i].title.toUpperCase());
            var tDiv = $("<div>").html("Title: " + results[i].title.toUpperCase());

            var cartoonImg = $("<img>");
            cartoonImg.attr("src", imgUrlStill);
            cartoonImg.attr("class", "gif");
            cartoonImg.attr("data-still", imgUrlStill);
            cartoonImg.attr("data-animate", imgUrlAnimate);
            cartoonImg.attr("data-state", "still");

            var cDiv = $("<div>")
            $(cDiv).append(cartoonImg);
            $(tDiv).append(cDiv);

            var p1 = $("<p>").text("Rating: " + results[i].rating);

            var cartoonDiv = $("<div>");
            $(cartoonDiv).append(tDiv).append(p1);
            $("#images_div").prepend(cartoonDiv);
        }
        $("#images_div").prepend("<button id='btnShowMore' data-cartoon='" + cartoon + "'>Show more</button>");
    });
}

function showMovieImages() {
    $("#images_div").empty();
    var movie = $(this).attr("data-cat");
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=29e7a54a";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var movieDiv = $("<div>");
        var p = $("<p>").html("<h1>" + response.Title + "</h1>" + response.Year + "<span>" + response.Actors + "</span");

        var movieImg = $("<img>");
        movieImg.attr("src", response.Poster);

        movieDiv.append(movieImg).append(p);

        $("#images_div").prepend(movieDiv);

    });
}

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

function addTopic() {
    event.preventDefault();
    var first_name = $('#nameId').val();
    if (first_name.length < 1) {
        $('#nameId').after('<span class="error">This field is required</span>');
    }

    var inputName = $("#nameId").val().trim();
    var cat = $("#categoryId").val().trim();
    if (!cartoonArr.includes(inputName) && cat == "cartoon") cartoonArr.push(inputName);
    if (!movieArr.includes(inputName) && cat == "movie") movieArr.push(inputName);

    showTopicButtons();
}

