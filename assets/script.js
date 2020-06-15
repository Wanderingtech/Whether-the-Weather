var savedCities = [];
var userCity;

function initialize(){
    savedCities = JSON.parse(localStorage).getItem("cities")
}
//activate search for the API
$("#search").on("click", function(event) {

    event.preventDefault();

    var userCity = $("#citySearch").val();
    console.log(userCity);
    //add city to array
    // var savedCities = $()
    var APIKey = "efd4aeef590f4c9e7f336687419f306c";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
            console.log(response);
            // Convert the temp to fahrenheit
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            // $("#todayWeather").text(JSON.stringify(response));
            $("#todayWeather").text("Temperature (K): " + response.main.temp);
            $("#todayWeather").text("Temperature (F): " + tempF.toFixed(2));
            console.log("Temperature (F): " + tempF);
            $("#todayWeather").text("Humidity: " + response.main.humidity + "%");
            $("#todayWeather").text("Wind Speed: " + response.wind.speed + "mph");
            //Saving search to local storage
            localStorage.setItem("cities", JSON.stringify(savedCities))

        });

});

//grab specific data from weather API (using specific time around 3pm)
//Display that info in cards
//get current day display in first card
//get next 5 days and display in the other 5 cards
//Save the history of search and display on page
