window.onload = function () {
    // show all topic buttons
    showTopicButtons();

    // initialise all the click events for all buttons
    $(document).on("click", "#cartoonBtn", showCartoonImages)
        .on("click", ".gif", animateImages)
        .on("click", "#btnSubmit", addTopic)
        .on("click", "#movieBtn", showMovieImages)
        .on("click", "#btnShowMore", showCartoonImages)
        .on("click", ".fab", addToFav)
        .on("click", "#btnFav", showFavs);
};

// initialising global variables
var topicArr = [];
var limit = 10;

// stores all the cartoons and movies shown on page to use it for favourite section
var imgObj = {};
var imgMObj = {};

// stores session variables for favourite cartoon and movies
var favObj = {};
var favMObj = {};

// iniatialise the topics for the cartoons and movies
var cartoonArr = ["captain planet", "disney", "finding nemo",
    "mickey mouse", "pink panther", "minions", "scooby doo", "teenage mutant ninja turtles", "tom and jerry",
    "the simpsons", "toy story", "wall e"];

var movieArr = ["avengers", "inception", "black panther", "joker", "avatar", "the departed"];

/**
 * function to show the topic buttons for cartoon and movies
 */
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

    // loop through the array to show the topic buttons
    $.each(topicArr, function (i, val) {
        var newDiv = $("<div class='float-left p-1'>");
        var newBtn = $("<button id='" + btn + "' class='btn btn-info'>" + val + "</button>");
        newBtn.attr("data-cat", val);
        $(newDiv).append(newBtn);

        $("#topic_div").append(newDiv);
    });

    $("#topic_div").prepend("<div class='p-2 bg-secondary text-white'><h6>Category: " + $("#categoryId").val().toUpperCase() + "</h6></div>");
}


/**
 * function to fetch the cartoon images by connecting to the Giphy API
 */
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

        // shows the Category on the page and Show More button
        $("#images_div").prepend("<div class='p-2 bg-secondary text-white overflow-hidden'><div class='float-left'><h3>Cartoons</h3></div><div class='float-right'><button id='btnShowMore' class='btn btn-warning' data-cartoon='" + cartoon + "'>Show more</button></div></div>");
    });
}

/**
 * function to show movies by connecting to the OMDB API
 */
function showMovieImages() {
    var movie = $(this).attr("data-cat");
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=29e7a54a";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        if (response.Response.toLowerCase() == "false") {
            alert("Movie not found!");
            return;
        }
        renderImages("movie", response);
    });
}


/**
 * 
 * @param {string} cat : to check if it is cartoon or movie to display
 * @param {object} response : details to show in html
 * @param {boolean} favPage : to check if the section to be displayed is my favourites section
 */
function renderImages(cat, response, favPage = false) {
    if (cat == "cartoon") {
        var imgId = response.id;
        var title = response.title.toUpperCase();
        var rating = response.rating;
        var imgUrlStill = response.images.fixed_height_still.url;
        var imgWidthStill = response.images.fixed_height_still.width;
        var imgHeightStill = response.images.fixed_height_still.height;
        var imgUrlAnimate = response.images.fixed_height.url;

        // store the data in imgObj object to use for favourite section
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

        // display the title for giphy cartoon images
        var tDiv = $("<div>").html("<h6>" + truncate(title, 5) + "</h6>");

        // display the giphy cartoon images
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

        // to assign red heart class if the image is selected as a favourite
        if (favList[imgId]) var favClass = "heart";

        // to show rating and grey heart image to add to favs
        var p1 = $("<div>").html('<div class="float-left"><strong>Rating:</strong> ' + rating + '</div><div class="float-right"><i data-id="' + imgId + '" data-cat="cartoon" class="fab fa-gratipay ' + favClass + ' m-1 cursor-pointer"></i></div>');

        var cartoonDiv = $("<div class='view m-4'>");
        $(cartoonDiv).append(tDiv).append(p1);

        $("#images_div").prepend(cartoonDiv);
    } else {
        var imgId = response.imdbID;
        var title = response.Title;
        var actors = response.Actors;
        var release_year = response.Year;
        var poster = response.Poster;

        if (!favPage) {
            if (imgMObj[imgId]) return;
        }

        // store the movies data in imgMObj object to use for favourite section
        imgMObj[imgId] = {
            Title: title,
            Actors: actors,
            Year: release_year,
            Poster: poster,
            imdbID: imgId
        };

        // to show title and release date
        var tDiv = $("<div>").html("<h5>" + title + "(" + release_year + ")</h5>");
        var movieImg = $("<img>");
        movieImg.attr("src", poster);

        var cDiv = $("<div>")
        $(cDiv).append(movieImg);
        $(tDiv).append(cDiv);

        // to assign red heart class if the image is selected as a favourite
        if (favMList[imgId]) var favClass = "heart";

        // to show rating and grey heart image to add to favs
        var p1 = $("<div>").html('<div class="float-left">&nbsp;</div><div class="float-right"><i data-id="' + imgId + '" data-cat="movie" class="fab fa-gratipay ' + favClass + ' m-1 cursor-pointer"></i></div>');

        // append details to a new div
        var movieDiv = $("<div class='view m-4'>");
        $(movieDiv).append(tDiv).append(p1);

        // if fav section then append details in topic_div else image_div
        var divToAppend = (favPage) ? "#topic_div" : "#images_div";
        $(divToAppend).prepend(movieDiv);
    }
}

/**
 * function to animate the still images
 */
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

/**
 * function to add a topic and show in the topics section
 */
function addTopic() {
    event.preventDefault();

    // clear the temp arrays when submit button is clicked to add topics or change category
    imgObj = [];
    imgMObj = [];
    $("#images_div").empty();

    var inputName = $("#nameId").val().trim();
    if (inputName) {
        var cat = $("#categoryId").val().trim();
        // push the new added topic to cartoon or movie array based on the category selected
        if (!cartoonArr.includes(inputName) && cat == "cartoon") cartoonArr.push(inputName);
        if (!movieArr.includes(inputName) && cat == "movie") movieArr.push(inputName);
        $("#nameId").val('');
    }

    // show all topic buttons
    showTopicButtons();
}

/**
 * Function to add to favourites
 */
function addToFav() {
    var data_id = $(this).attr("data-id");
    var category = $(this).attr("data-cat");

    // toggle the heart image if added to fav or removed from fav
    $(this).toggleClass("heart");
    if (category == "cartoon") {
        // Get all content from sessionStorage
        favObj = JSON.parse(sessionStorage.getItem("favList"));
        if (!favObj) favObj = {};
        if ($(this).hasClass("heart")) {
            // if added to fav, update the favourite temp session array
            favObj[data_id] = imgObj[data_id];
        } else {
            // if removed from fav, remove from the favourite temp session array
            delete favObj[data_id];
        }
        // update the session fav list based on the temp session array
        sessionStorage.setItem("favList", JSON.stringify(favObj));

        // get the session array and store in favList
        favList = JSON.parse(sessionStorage.getItem("favList"));
    } else {
        // Get all movie content from sessionStorage
        favMObj = JSON.parse(sessionStorage.getItem("favMList"));
        if (!favMObj) favMObj = {};
        if ($(this).hasClass("heart")) {
            // if added to fav, update the favourite temp session array
            favMObj[data_id] = imgMObj[data_id];
        } else {
            // if removed from fav, remove from the favourite temp session array
            delete favMObj[data_id];
        }
        // update the session fav list based on the temp session array
        sessionStorage.setItem("favMList", JSON.stringify(favMObj));

        // get the session array and store in favMList
        favMList = JSON.parse(sessionStorage.getItem("favMList"));
    }
}

/**
 * function to truncate the words in a string
 * @param {string} str : the string to truncate
 * @param {number} no_words : number of words to truncate
 */
function truncate(str, no_words) {
    return str.split(" ").splice(0, no_words).join(" ");
}

/**
 * function to show the favourite images my calling renderImages function
 */
function showFavs() {
    event.preventDefault();
    $("#topic_div").empty();
    $("#images_div").empty();

    // if no fav images show no images message
    if (Object.entries(favList).length == 0 && Object.entries(favMList).length == 0) {

        $("#images_div").html('<div class="alert alert-danger text-center" role="alert">Oops! You don\'t have any favourites added.</div>');
        return;
    }

    // display the cartoon images
    for (var key in favList) {
        renderImages("cartoon", favList[key]);
    }

    // to show the heading for fav cartoon
    if (Object.entries(favList).length > 0)
        $("#images_div").prepend('<div class="p-3 mb-2 bg-secondary text-white text-center"><h5>Favourite Cartoons</h5></div>');

    // display the movie images
    for (var key in favMList) {
        renderImages("movie", favMList[key], true);
    }

    // to show the heading for fav movies
    if (Object.entries(favMList).length > 0)
        $("#topic_div").prepend('<div class="p-3 mb-2 bg-secondary text-white text-center"><h5>Favourite Movies</h5></div>');
}

// on load of page, populate the arrays with session variables
var favList = JSON.parse(sessionStorage.getItem("favList"));
var favMList = JSON.parse(sessionStorage.getItem("favMList"));

if (!favList) {
    favList = {};
}

if (!favMList) {
    favMList = {};
}