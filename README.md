# GifTastic

1. Link to the site: https://shruti-gaonkar.github.io/GifTastic/

2. Array of cartoons and movies are created

3. The app loops through the arrays and creates buttons in HTML.
   
4. When the user clicks on a cartoon button: 

    * the page grabs 10 static, non-animated gif images from the GIPHY API and places them on the page.

    * When the user clicks one of the still GIPHY images, the gif animates. If the user clicks the gif again, it  stops playing.

    * Every gif has a rating and title displayed.

    * An add to favourite icon is displayed for each image.

5. When the user clicks on a movie button

    * the page shows the movie name, year of release and poster related to the movie from the OMDB API

    * An add to favourite icon is displayed for each image.

6. A form is added that takes a value from a user input box and adds it to the cartoon or movie `topics` array based on the category selected (i.e cartoon or movie). 

7. When add to favourite icon is clicked

    * it toggles the heart image to red to tell user the image has been added to favourite.

    * if the icon is clicked again, the image is removed from favourite section.

8. Users can add their favorite gifs to a `my favorites` section. It has 2 sections:

    * to display favourite cartoon images.

    * to display favourite movie images.

9. The app is mobile responsive.  

10. The app uses sessionStorage to show My Favourites section

Built With HTML, CSS, Javascript, Bootstrap, Jquery