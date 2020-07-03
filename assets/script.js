var savedCities = [];
var userCity;
var APIKey = "efd4aeef590f4c9e7f336687419f306c";
initialize();
currentDay();


function initialize(){
    savedCities = JSON.parse(localStorage.getItem("cities"))||[]
    
    $("#savedCities").empty();
    for(let i = 0; i< savedCities.length; i++){
        $("#savedCities").append(`<p class= "cityList">${savedCities[i]}</p>
        <button data-city="${savedCities[i]}"class="clearButton waves-effect waves-light btn-small">Clear</button>`);
    }
}
$("#savedCities").on("click", ".cityList", function(){
    var city = $(this).text();
    currentForecast(city);
})
function currentDay(){
    $("#today").text(moment().format("dddd MMM Do YYYY"));
}

$("#savedCities").on("click",".clearButton", function(){
    var previousCities = savedCities
    var newList = []
    var currentCity = $(this).attr("data-city")
    for(let i = 0; i< previousCities.length; i++){
        if(previousCities[i] !== currentCity){
            newList.push(previousCities[i])
        }
    }
    localStorage.setItem("cities", JSON.stringify(newList))
    initialize()
})
function currentForecast(userCity){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&appid=" + APIKey + "&units=imperial"
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
            $('#weatherHeading').append('<h1>' + userCity + '</h1>');
            $('#todayWeather').append('<li> Temperature: ' + response.main.temp + '  °F </li>');
            $('#todayWeather').append('<li> Humidity: ' + response.main.humidity + '%</li>');
            $('#todayWeather').append('<li> Wind Speed: ' + response.wind.speed + ' mph </li>');
            $("#todayWeather").append(`<li><img src="http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png"/></li>`);
            //Saving search to local storage
            if(savedCities.indexOf(userCity)=== -1){
                savedCities.push(userCity);
                localStorage.setItem("cities", JSON.stringify(savedCities))
                initialize();
            }
          
        });
}
//activate search for the API
$("#search").on("click", function(event) {

    event.preventDefault();

    var userCity = $("#citySearch").val();
    console.log(userCity);
    $("#citySearch").val("");
    currentForecast(userCity);
    

});

function getUV(lat, lon){
    console.log(lat,lon)
    var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon
    $.ajax({
        url: uvQuery,
        method: "GET"
    }).then (function(uvResponse){
        console.log(uvResponse);
        $("#UV").append("UV Index: " + uvResponse.value); 
        if(uvResponse.value > 11){
        $("#UV").addClass("violet");
        }
        if(uvResponse.value < 11 && uvResponse.value >= 8){
            $("#UV").addClass("red")
        }
        if(uvResponse.value < 8 && uvResponse.value >= 6){
            $("#UV").addClass("orange")
        }
        if(uvResponse.value < 6 && uvResponse.value >= 3){
            $("#UV").addClass("yellow")
        }
        else{
            $("#UV").addClass("green")
        }
    })

}
function fiveDayForecast(userCity){
    var uvQuery = "https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&appid=" + APIKey + "&units=imperial"
    $.ajax({
        url: uvQuery,
        method: "GET"
    }).then (function(forecast){
        console.log(forecast);
        
        $("#fiveDay").empty();
        for(let i = 0; i< forecast.list.length; i= i +8){
            $("#fiveDay").append(` <div class="col s12 m3 offset-m2">
            <div class="card-panel blue-grey darken-1">
                <div class="card-content white-text">
                    <span class="card-title" id="Day-1">${forecast.list[i].dt_txt.split(" ")[0]}</span>
                    <ul>
                        <li>Temp: ${forecast.list[i].main.temp + '  °F'}</li>
                        <li>Humidity: ${forecast.list[i].main.humidity} % </li>
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
