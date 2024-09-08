const searchInput=document.querySelector(".search-input");
const currentWeatherDiv=document.querySelector(".current-weather")

const locationButton=document.querySelector(".location-button")

const hourlyWeatherDiv=document.querySelector(".hourly-weather .weather-list")
  const API_KEY='846c4ffd345b4cf4bb4100250242908';

  function displayhourlyForecast(hourlyData){
             const currentHour=new Date().setMinutes(0,0,0);
             const next24Hours=currentHour + 24*60*60*1000;

             const next24HoursData=hourlyData.filter(({time})=>{
              const forecastTime=new Date (time).getTime();
              return forecastTime >=currentHour && forecastTime <= next24Hours;
             });
             
            //  console.log("hello:",next24HoursData[0].condition.icon);
            
        // Generate the html for each hourly forecast and display it 
          hourlyWeatherDiv.innerHTML=next24HoursData.map(item=>{
              const temperature=Math.floor(item.temp_c);
              const time=item.time.split(" ")[1].substring(0,5);
              const weatherIcon=item.condition.icon;
           
              return `<li class="weather-item">
              <p class="time">${time}</p>
              <img src="${weatherIcon}" alt="" class="weather-icon">
              <p class="temperature">${temperature}<span>&deg;C </span></p>
          </li>`;

            }).join("");

            // console.log(hourlyWeatherHTML);
            
          
             
  }

  async function getWeatherDetails(API_URL) {
      window.innerWidth <=768 && searchInput.blur();
      document.body.classList.remove("show-no-results");
      try {
        // here days=2 gives the hourly forecast of 2 days
        let responce=await axios.get(API_URL);
        console.log(`State: ${responce.data.location.region},country:${responce.data.location.country}`);
        console.log(responce.data.location);
        
       
        let src1 = responce.data.current.condition.icon; // Fetch the icon URL from the API response
        let icon = document.querySelector(".icons");    // Select the image element
        
        // console.log(icon.getAttribute('src'));           // Log the current src attribute (if any)
        
        // Set the src attribute using the template literal correctly
        icon.setAttribute('src', `${src1}`);
        
      const temperature=Math.floor(responce.data.current.temp_c);
      const desc=responce.data.current.condition.text;
    
      currentWeatherDiv.querySelector(".temperature").innerHTML=`${temperature}<span>&deg;C</span>`;
      currentWeatherDiv.querySelector(".description").innerText=desc;


      const combinedHourlyWeather=[...responce.data.forecast.forecastday
[0].hour,...responce.data.forecast.forecastday
[1].hour  ];
// console.log(combinedHourlyWeather);
displayhourlyForecast(combinedHourlyWeather);


// console.log(responce.data.forecast.forecastday
//   [1].hour)
        
    searchInput.value=responce.data.location.name;
    } catch (error) {
        // console.log(error);
        document.body.classList.add("show-no-results");
    }
  }

  // Set-up weather request for specific city

const setupWeatherRequest=(cityName)=>{

  const API_URL=`http://api.weatherapi.com/v1	/forecast.json?key=${API_KEY}&q=${cityName}&days=2`;  
  getWeatherDetails(API_URL);

}

searchInput.addEventListener("keyup",(event)=>{
    
    const cityName=searchInput.value.trim();

    if (event.key=="Enter" && cityName) {
        // console.log(cityName);
        setupWeatherRequest(cityName);
    }
})

locationButton.addEventListener('click',()=>{
  navigator.geolocation.getCurrentPosition(position => {
    console.log("position:",position.coords);
    const {latitude, longitude}=position.coords;
    
  const API_URL=`http://api.weatherapi.com/v1	/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=2`;  
  getWeatherDetails(API_URL);
  },error=>{
    alert("Location access denied. Please enable permision to use this features");
  });
})

//Intitial weather request for london as the default city
setupWeatherRequest("aurangabad")