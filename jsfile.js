
const CITIES = {
  sydney: { lat: '-33.8688', lon:'151.2093' },
  brisbane: { lat: '-27.4698', lon:'153.0251' },
  melbourne: { lat: '-37.8136', lon:'144.9631' },
  snowyMountains: {lat: '-36.5000', lon: '148.3333' },
};

const API_KEY = "f4cd47437ae147a293b9808ef3f52c49";


const ASSETS = {
  // background
  background: "https://bit.ly/webApp_Assets_background",

  // arrows
  leftArrow: "https://bit.ly/webApp_Assets_leftArrow",
  rightArrow: "https://bit.ly/webApp_Assets_rightArrow",

  // weather icons
  cloudy: "https://bit.ly/webApp_Assets_cloudy",
  rain: "https://bit.ly/webApp_Assets_rain",
  snow: "https://bit.ly/webApp_Assets_snow",
  sunny: "https://bit.ly/webApp_Assets_sunny",
  thunderStorm: "https://bit.ly/webApp_Assets_thunderStorm"
};

//load top images for background  left and right button
document.getElementById("bg").style.backgroundImage = "url("+ASSETS.background+")";
document.getElementById("left").src = ASSETS.leftArrow;
document.getElementById("right").src = ASSETS.rightArrow;


//next and prv button handler
var prev = document.querySelector('div.prev');
var next = document.querySelector('div.next');
var index = 0;
var count = 4;

prev.addEventListener('click', function() {

  index--;
  if (index < 0){
    index = count-1;
  }
  getWeather(index);
});

next.addEventListener('click', function() {
  index++;
  if (index > count-1){
    index = 0;
  }
  getWeather(index);
});



var weatherCodeArr = new Array();

function getWeather(indexNumber=0){
  var key = Object.keys(CITIES)[indexNumber];
  value = CITIES[key];

  $.ajax({
        //For the free account hourly API is not giving 120hours (5 days) data. only giving 48 hours(2 days). becouse of that i used this one. if you can provide key for the advance account i can use hourly API.
        url: 'http://api.weatherbit.io/v2.0/forecast/daily?lat='+value.lat+'&lon='+value.lon+'&key=' + API_KEY,
        success: function (res) { 
          //remove all the bottom weather icon when new response recived
          var list = document.getElementById("ulList");
          while (list.hasChildNodes()) {  
            list.removeChild(list.firstChild);
          }

          document.getElementById("locationName").innerHTML = res.city_name;

          document.getElementById("status").innerHTML =res.data[0].weather.description;
          document.getElementById("temp").innerHTML = Math.round(res.data[0].temp)+"&#176;";
          document.getElementById("minMax").innerHTML = Math.round(res.data[0].app_max_temp)+"&#176;" +"  "+Math.round(res.data[0].app_min_temp)+"&#176;";
          document.getElementById("whetherIcon").src=predictWeatherIcon(res.data[0].weather.code);

          var index=1;
          var i;
          var d = new Date();
          var dayArr=["Sun","Mon","Tue","wed","Thu","Fri","Sat"];
          var day = d.getDay();

          //append bottom weather icon upon API response
          res.data.forEach(function (item, index) {
            index++;
            if(index<6){
              if(day>=6)
                day=0;

              var nodeLi = document.createElement("LI");
              nodeLi.className = "item flex-item";
              var nodeDiv = document.createElement("DIV");
              nodeDiv.className ="dayDetials";
              nodeLi.appendChild(nodeDiv);

              var nodeDiv1 =document.createElement("DIV");
              nodeDiv1.appendChild(document.createTextNode(dayArr[++day])); 
              var nodeDiv2 =document.createElement("DIV");
              nodeDiv2.className ="imgParentDiv";
              var nodeDiv3 =document.createElement("DIV");
              nodeDiv3.appendChild(document.createTextNode(Math.round(res.data[index].app_max_temp)+" / "+Math.round(res.data[0].app_min_temp))); 
              nodeDiv.appendChild(nodeDiv1);
              nodeDiv.appendChild(nodeDiv2);
              nodeDiv.appendChild(nodeDiv3);
              var nodeImg =document.createElement("IMG");
              nodeImg.src =predictWeatherIcon(res.data[index].weather.code);
              nodeDiv2.appendChild(nodeImg);
              nodeLi.appendChild(nodeDiv);
              document.getElementById("ulList").appendChild(nodeLi);

            }

          });

        },
      error: function (err) { console.log(err); } // network error
    });
  
}

// document load complete even
document.addEventListener('DOMContentLoaded', (event) => {
  getWeather();
})


//find the best weather icon
function predictWeatherIcon(code){

 var icon;
 if(code>=200 && code<=233){
   icon=ASSETS.thunderStorm;
 }else if(code>=300 && code<=522){
  icon=ASSETS.rain;
}else if(code>=600 && code<=751){
  icon=ASSETS.snow;
}else if(code>=800 && code<=804){
  icon=ASSETS.cloudy;
}

return icon;
}
