window.onload = function () {
    showTopicButtons();

    $(document).on("click", "#cartoonBtn", showCartoonImages)
        .on("click", ".gif", animateImages)
        .on("click", "#btnSubmit", addTopic)
        .on("click", "#movieBtn", showMovieImages)
        .on("click", "#btnShowMore", showCartoonImages)
        .on("click", ".fab", addToFav);
};

var topicArr = [];
var limit = 10;
var imgObj = {};
var imgMObj = {};
var favObj = {};
var favMObj = {};

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
        var newDiv = $("<div class='float-left p-1'>");
        var newBtn = $("<button id='" + btn + "' class='btn btn-info'>" + val + "</button>");
        newBtn.attr("data-cat", val);
        $(newDiv).append(newBtn);

        $("#topic_div").append(newDiv);
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
            //console.log(imgObj);
            //console.log(results[i].title.toUpperCase());
            renderImages("cartoon", results[i]);
        }
        //$("#images_div").prepend("<button id='btnShowMore' data-cartoon='" + cartoon + "'>Show more</button>");
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
        //console.log(response);
        //console.log(imgMObj);

        renderImages("movie", response);
    });
}


function renderImages(cat, response) {
    if (cat == "cartoon") {
        var imgId = response.id;
        var title = response.title.toUpperCase();
        var rating = response.rating;
        var imgUrlStill = response.images.fixed_height_still.url;
        var imgWidthStill = response.images.fixed_height_still.width;
        var imgHeightStill = response.images.fixed_height_still.height;
        var imgUrlAnimate = response.images.fixed_height.url;

        imgObj[imgId] = {
            id: imgId,
            title: title,
            rating: rating,
            images: {
                fixed_height_still:
                {
                    url: imgUrlStill,
                    width: imgWidthStill,
                    height: imgHeightStill
                },
                fixed_height:
                {
                    url: imgUrlAnimate
                }
            }
        };

        var tDiv = $("<div>").html("<h6>" + truncate(title, 5) + "</h6>");

        var cartoonImg = $("<img>");
        cartoonImg.attr("src", imgUrlStill);
        cartoonImg.attr("class", "gif");
        cartoonImg.attr("style", "width:" + imgWidthStill + "px;height: " + imgHeightStill + ";");
        cartoonImg.attr("data-still", imgUrlStill);
        cartoonImg.attr("data-animate", imgUrlAnimate);
        cartoonImg.attr("data-state", "still");

        var cDiv = $("<div>")
        $(cDiv).append(cartoonImg);
        $(tDiv).append(cDiv);

        var p1 = $("<div>").html('<div class="float-left"><strong>Rating:</strong> ' + rating + '</div><div class="float-right"><i data-id="' + imgId + '" data-cat="cartoon" class="fab fa-gratipay cursor-pointer"></i></div>');

        var cartoonDiv = $("<div class='view m-4'>");
        $(cartoonDiv).append(tDiv).append(p1);

        $("#images_div").prepend(cartoonDiv);
    } else {
        var imgId = response.imdbID;
        var title = response.Title;
        var actors = response.Actors;
        var release_year = response.Year;
        var poster = response.Poster;

        imgMObj[imgId] = {
            Title: title,
            Actors: actors,
            Year: release_year,
            Poster: poster,
            imdbID: imgId
        };

        var movieDiv = $("<div>");
        var p = $("<p>").html("<h1>" + title + "</h1>" + release_year + "<span>" + actors + "</span");

        var movieImg = $("<img>");
        movieImg.attr("src", poster);

        movieDiv.append(movieImg).append(p);

        $(movieDiv).append($('<i data-id="' + imgId + '" data-cat="movie" class="fab fa-gratipay"></i>'));

        $("#images_div").prepend(movieDiv);
    }
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

function addToFav() {
    var data_id = $(this).attr("data-id");
    var category = $(this).attr("data-cat");
    //console.log(data_id + "=====" + category);
    if (category == "cartoon") {
        // Store all content into sessionStorage
        favObj[data_id] = imgObj[data_id];
        console.log(favObj);
        sessionStorage.setItem("favList", JSON.stringify(favObj));
    } else {
        favMObj[data_id] = imgMObj[data_id];
        console.log(favMObj);
        sessionStorage.setItem("favMList", JSON.stringify(favMObj));
    }

    //console.log(JSON.parse(sessionStorage.getItem("favList")));
    //console.log(JSON.parse(sessionStorage.getItem("favMList")));
}

function truncate(str, no_words) {
    return str.split(" ").splice(0, no_words).join(" ");
}

var favList = JSON.parse(sessionStorage.getItem("favList"));
var favMList = JSON.parse(sessionStorage.getItem("favMList"));

if (!Array.isArray(favList)) {
    favList = [];
}

if (!Array.isArray(favMList)) {
    favMList = [];
}

console.log(JSON.parse(sessionStorage.getItem("favList")));
console.log(JSON.parse(sessionStorage.getItem("favMList")));