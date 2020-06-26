var savedCities = [];
var userCity;
var APIKey = "efd4aeef590f4c9e7f336687419f306c";
initialize();
currentDay();


function initialize(){
    savedCities = JSON.parse(localStorage.getItem("cities"))||[]
    
    $("#savedCities").empty();
    for(let i = 0; i< savedCities.length; i++){
        $("#savedCities").append(`<p>${savedCities[i]}</p>
        <a class="waves-effect waves-light btn-small" id="clear">Clear</a>`);
        // if()
    }
}

function currentDay(){
    $("#today").text(moment().format("dddd MMM Do YYYY"));
}

$("#clear").on("click", function(){
    $(this).html("");
})
//activate search for the API
$("#search").on("click", function(event) {

    event.preventDefault();

    var userCity = $("#citySearch").val();
    console.log(userCity);
    $("#citySearch").val("");
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&appid=" + APIKey;
    fiveDayForecast(userCity)
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
            console.log(response);
            var lat = response.coord.lat
            var lon = response.coord.lon
            getUV(lat,lon);
            // Convert the temp to fahrenheit
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            $('#todayWeatherH').html(userCity);
            $('#todayWeather').append('<li> Temperature: ' + tempF.toFixed(2) + '  °F </li>');
            $('#todayWeather').append('<li> Humidity: ' + response.main.humidity + '%</li>');
            $('#todayWeather').append('<li> Wind Speed: ' + response.wind.speed + ' mph </li>');
            $("#todayWeather").append(`<li><img src="http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png"/></li>`);
            //Saving search to local storage
            savedCities.push(userCity);
            localStorage.setItem("cities", JSON.stringify(savedCities))
            initialize();
        });
    

});

function getUV(lat, lon){
    console.log(lat,lon)
    var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon
    $.ajax({
        url: uvQuery,
        method: "GET"
    }).then (function(uvResponse){
        console.log(uvResponse);
        $("#UV").append(uvResponse.value);
    })

}
function fiveDayForecast(userCity){
    var uvQuery = "https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&appid=" + APIKey
    $.ajax({
        url: uvQuery,
        method: "GET"
    }).then (function(forecast){
        console.log(forecast);
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $("#fiveDay").empty();
        for(let i = 0; i< forecast.list.length; i= i +8){
            $("#fiveDay").append(` <div class="col s12 m2 offset-m1">
            <div class="card-panel blue-grey darken-1">
                <div class="card-content white-text">
                    <span class="card-title" id="Day-1">${forecast.list[i].dt_txt.split(" ")[0]}</span>
                    <ul>
                        <li>${forecast.list[i].tempF.toFixed(2) + '  °F'}</li>
                        <li>${forecast.list[i].main.humidity}</li>
                        <li>${forecast.list[i].weather[0].main}</li>
                        <li><img src="http://openweathermap.org/img/wn/${forecast.list[0].weather[0].icon}@2x.png"/></li>
                    </ul>
                </div>
            </div>
        </div>`)
        }
    })
}
function displayCities(){
    var cities = localStorage.getItem(userCity)
}
//grab specific data from weather API (using specific time around 3pm)
//Display that info in cards
//get current day display in first card
//get next 5 days and display in the other 5 cards
//Save the history of search and display on page
