//const language = "hu"
const weatherForm = document.querySelector('form')
const geocodingApiRouteBase = "https://maps.googleapis.com/maps/api/geocode/json?"//address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
const currentWeatherApiRouteBase = "https://weather.googleapis.com/v1/currentConditions:lookup?"//key=YOUR_API_KEY&location.latitude=LATITUDE&location.longitude=LONGITUDE

let apiKey = ""
let currentWeatherInfo = null

loadApiKey()

weatherForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    showWeather()
})

async function loadApiKey() {
    try {
        const response = await fetch('GoogleMapsApiKey.txt')

        if(!response.ok){throw new Error(`${response.status}`)}

        apiKey = await response.text()
        console.log("key is ok");
    }catch (err) {
        console.error("no api key");
    }
}

async function showWeather() {
    input = document.getElementById("input-location").value

    if (input.length == 0){console.log("no input, skip"); return}

    try {
        const location = await getLocationAsync(input)
        currentWeatherInfo = await getCurrentWeatherAsnyc(location)
    } catch(error){
        console.log(error.message, error)
    }
    await updateUI()
}

async function getCurrentWeatherAsnyc(location){
    const response = await fetch(`${currentWeatherApiRouteBase}key=${apiKey}&location.latitude=${location.lat}&location.longitude=${location.lng}`)
    if(!response.ok){
        throw new Error("problem with current weather api")
    }
    const data = await response.json()
    return {
        temp: data.temperature.degrees,
        condition: data.type, 
        isDayTime: data.isDayTime
    }
}

async function getLocationAsync(input){
    console.log(input)
    const response = await fetch(`${geocodingApiRouteBase}address=${input}&key=${apiKey}`)
    if(!response.ok){
        throw new Error("problem with geocoding api")
    }
    const data = await response.json()
    if (data.status == 'ZERO_RESULTS'){ throw new Error(`${data.status}`)}
    const location = data.results[0].geometry.location
    return location
}

async function updateUI(){

}