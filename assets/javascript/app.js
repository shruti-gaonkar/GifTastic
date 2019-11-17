window.onload = function () {
    showTopicButtons();

    $(document).on("click", "#cartoonBtn", showCartoonImages)
        .on("click", ".gif", animateImages)
        .on("click", "#btnSubmit", addTopic)
        .on("click", "#movieBtn", showMovieImages)
        .on("click", "#btnShowMore", showCartoonImages)
        .on("click", ".fab", addToFav)
        .on("click", "#btnFav", showFavs);
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

var movieArr = ["avengers", "inception", "black panther", "joker", "avatar", "the departed"];

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
        for (var i = 0; i < results.length; i++) {
            renderImages("cartoon", results[i]);
        }
        $("#images_div").prepend("<div class='float-right'><button id='btnShowMore' class='btn btn-warning' data-cartoon='" + cartoon + "'>Show more</button></div>");
    });
}

function showMovieImages() {
    var movie = $(this).attr("data-cat");
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=29e7a54a";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        renderImages("movie", response);
    });
}


function renderImages(cat, response, favPage = false) {
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

        if (favList[imgId]) var favClass = "heart";
        var p1 = $("<div>").html('<div class="float-left"><strong>Rating:</strong> ' + rating + '</div><div class="float-right"><i data-id="' + imgId + '" data-cat="cartoon" class="fab fa-gratipay ' + favClass + ' m-1 cursor-pointer"></i></div>');

        var cartoonDiv = $("<div class='view m-4'>");
        $(cartoonDiv).append(tDiv).append(p1);

        $("#images_div").prepend(cartoonDiv);
    } else {
        //console.log(response);
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

        var tDiv = $("<div>").html("<h5>" + title + "(" + release_year + ")</h5>");
        var movieImg = $("<img>");
        movieImg.attr("src", poster);

        var cDiv = $("<div>")
        $(cDiv).append(movieImg);
        $(tDiv).append(cDiv);

        if (favMList[imgId]) var favClass = "heart";
        var p1 = $("<div>").html('<div class="float-left">&nbsp;</div><div class="float-right"><i data-id="' + imgId + '" data-cat="movie" class="fab fa-gratipay ' + favClass + ' m-1 cursor-pointer"></i></div>');

        var movieDiv = $("<div class='view m-4 w-25'>");
        $(movieDiv).append(tDiv).append(p1);

        var divToAppend = (favPage) ? "#topic_div" : "#images_div";
        $(divToAppend).prepend(movieDiv);
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

    $("#images_div").empty();

    var inputName = $("#nameId").val().trim();
    if (inputName) {
        var cat = $("#categoryId").val().trim();
        if (!cartoonArr.includes(inputName) && cat == "cartoon") cartoonArr.push(inputName);
        if (!movieArr.includes(inputName) && cat == "movie") movieArr.push(inputName);
        $("#nameId").val('');
    }

    showTopicButtons();
}

function addToFav() {
    var data_id = $(this).attr("data-id");
    var category = $(this).attr("data-cat");

    $(this).toggleClass("heart");
    if (category == "cartoon") {
        // Store all content into sessionStorage
        favObj = JSON.parse(sessionStorage.getItem("favList"));
        if (!favObj) favObj = {};
        if ($(this).hasClass("heart")) {
            favObj[data_id] = imgObj[data_id];
        } else {
            delete favObj[data_id];
        }
        sessionStorage.setItem("favList", JSON.stringify(favObj));
        favList = JSON.parse(sessionStorage.getItem("favList"));
    } else {
        favMObj = JSON.parse(sessionStorage.getItem("favMList"));
        if (!favMObj) favMObj = {};
        if ($(this).hasClass("heart")) {
            favMObj[data_id] = imgMObj[data_id];
        } else {
            delete favMObj[data_id];
        }
        sessionStorage.setItem("favMList", JSON.stringify(favMObj));
        favMList = JSON.parse(sessionStorage.getItem("favMList"));
    }
}

function truncate(str, no_words) {
    return str.split(" ").splice(0, no_words).join(" ");
}

function showFavs() {
    event.preventDefault();
    $("#topic_div").empty();
    $("#images_div").empty();

    if (Object.entries(favList).length == 0 && Object.entries(favMList).length == 0) {

        $("#images_div").html('<div class="alert alert-danger text-center" role="alert">Oops! You don\'t have any favourites added.</div>');
        return;
    }
    for (var key in favList) {
        renderImages("cartoon", favList[key]);
    }

    if (Object.entries(favList).length > 0)
        $("#images_div").prepend('<div class="p-3 mb-2 bg-secondary text-white text-center">Favourite Cartoons</div>');

    for (var key in favMList) {
        renderImages("movie", favMList[key], true);
    }

    if (Object.entries(favMList).length > 0)
        $("#topic_div").prepend('<div class="p-3 mb-2 bg-secondary text-white text-center">Favourite Movies</div>');
}

var favList = JSON.parse(sessionStorage.getItem("favList"));
var favMList = JSON.parse(sessionStorage.getItem("favMList"));

if (!favList) {
    favList = {};
}

if (!favMList) {
    favMList = {};
}