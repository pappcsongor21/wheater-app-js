//const language = "hu"
const weatherForm = document.querySelector('form')
const geocodingApiRouteBase = "https://maps.googleapis.com/maps/api/geocode/json?"//address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
const currentWeatherApiRouteBase = "https://weather.googleapis.com/v1/currentConditions:lookup?"//key=YOUR_API_KEY&location.latitude=LATITUDE&location.longitude=LONGITUDE

let apiKey = ""
let currentWeatherInfo = null
let currentLocation = ""
let firstUpdate = true

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
    currentLocation = input

    try {
        const location = await getLocationAsync(input)
        currentWeatherInfo = await getCurrentWeatherAsnyc(location)
    } catch(error){
        console.log(error.message, error)
        if(error.message == 'ZERO_RESULTS'){
            currentLocation = "location not found"
            currentWeatherInfo = {
                temperature: "unknown",
                condition: "unknown",
                isDayTime: "unknown"
            }
        }
        else if(error.message == "problem with current weather api"){
            currentWeatherInfo = {
                temperature: "unknown",
                condition: "no info",
                isDayTime: "unknown"
            }
        }
    }
    updateUI()
}

async function getCurrentWeatherAsnyc(location){
    const response = await fetch(`${currentWeatherApiRouteBase}key=${apiKey}&location.latitude=${location.lat}&location.longitude=${location.lng}`)
    if(!response.ok){
        throw new Error("problem with current weather api")
    }
    const data = await response.json()
    return {
        temperature: data.temperature.degrees,
        condition: data.weatherCondition.description.text, 
        isDayTime: data.isDayTime
    }
}

async function getLocationAsync(input){
    const response = await fetch(`${geocodingApiRouteBase}address=${input}&key=${apiKey}`)
    if(!response.ok){
        throw new Error("problem with geocoding api")
    }
    const data = await response.json()
    if (data.status == 'ZERO_RESULTS'){ throw new Error(`${data.status}`)}
    const location = data.results[0].geometry.location
    return location
}

function updateUI(){

    if(firstUpdate){
        div = document.querySelector("#wrapper-weather-info")
        div.innerHTML = `
        <p id="location-text"></p>
        <div id = "current-weather-wrapper">
            <p id="current-weather-condition"></p>
            <p class="weather-icon" id="current-weather-icon"></p>
            <p id="current-temperature" class="temperature"></p>
        </div>
        `
        firstUpdate = false
    }

    const locationText = document.querySelector('#location-text')
    locationText.innerHTML = currentLocation

    const currentWeatherCon = document.querySelector('#current-weather-condition')
    currentWeatherCon.innerHTML = currentWeatherInfo.condition

    let icon
    switch(currentWeatherInfo.condition.toLowerCase()){
        case "sunny":
            icon = '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M446.67-766.67V-920h66.66v153.33h-66.66ZM706-659.33l-46.33-46.34 108-109.66 46.66 47.66L706-659.33Zm60.67 212.66v-66.66H920v66.66H766.67ZM446.67-40v-153.33h66.66V-40h-66.66ZM253.33-660.67l-108-107 47-46.66L300.67-706l-47.34 45.33ZM768-145.33l-108.33-109L705-299.67l110 106-47 48.34ZM40-446.67v-66.66h153.33v66.66H40Zm153 301.34-47.33-47L253-299.67l24.33 22.34L301.67-254 193-145.33ZM480-240q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-66.67q72 0 122.67-50.66Q653.33-408 653.33-480t-50.66-122.67Q552-653.33 480-653.33t-122.67 50.66Q306.67-552 306.67-480t50.66 122.67Q408-306.67 480-306.67ZM480-480Z"/></svg>'
            break
        case "cloudy":
            icon = '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z"/></svg>'
            break
        case "raining":
            icon = '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M558-83.33q-12.33 6-25.83 1.5-13.5-4.5-19.5-16.84l-66-132q-6-12.33-1.84-25.83Q449-270 461.33-276q12.34-6 25.84-1.5t19.5 16.83l66 132q6 12.34 1.83 25.84T558-83.33ZM798-84q-12.33 6-25.83 1.5-13.5-4.5-19.5-16.83l-66-132q-6-12.34-1.84-25.84 4.17-13.5 16.5-19.5 12.34-6 25.84-1.5t19.5 16.84l66 132q6 12.33 1.83 25.83Q810.33-90 798-84Zm-480 0q-12.33 6-25.83 1.83-13.5-4.16-19.5-16.5l-66-132q-6-12.33-1.5-25.83Q209.67-270 222-276q12.33-6 25.83-1.83 13.5 4.16 19.5 16.5l66 132.66q6 12.34 1.5 25.5Q330.33-90 318-84Zm-24.67-249.33q-88.33 0-150.83-62.5Q80-458.33 80-546.67 80-627 136-689q56-62 139-69.67 32-56.33 85.5-88.83T480-880q90.67 0 153.83 57.5Q697-765 711-679.67 786.67-675 833.33-625 880-575 880-506.67q0 71.67-50.5 122.5-50.5 50.84-122.83 50.84H293.33Zm0-66.67h413.34q44.66 0 75.66-31.33 31-31.34 31-75.34 0-44.66-31-75.66t-75.66-31h-60v-33.34q0-69.33-48.67-118-48.67-48.66-118-48.66-50 0-91.5 27t-61.5 73l-8.67 20h-27q-60.33 2-102.5 44.5-42.16 42.5-42.16 102.16 0 60.67 43 103.67t103.66 43ZM480-606.67Z"/></svg>'
            break
        case "snowing":
            icon = '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M259.91-206.67q-18.24 0-30.74-12.59t-12.5-30.83q0-18.24 12.59-30.74t30.83-12.5q18.24 0 30.74 12.59t12.5 30.83q0 18.24-12.59 30.74t-30.83 12.5ZM379.91-80q-18.24 0-30.74-12.59-12.5-12.6-12.5-30.84 0-18.24 12.59-30.74t30.83-12.5q18.24 0 30.74 12.6 12.5 12.59 12.5 30.83T410.74-92.5Q398.15-80 379.91-80Zm120-126.67q-18.24 0-30.74-12.59t-12.5-30.83q0-18.24 12.59-30.74t30.83-12.5q18.24 0 30.74 12.59t12.5 30.83q0 18.24-12.59 30.74t-30.83 12.5Zm240 0q-18.24 0-30.74-12.59t-12.5-30.83q0-18.24 12.59-30.74t30.83-12.5q18.24 0 30.74 12.59t12.5 30.83q0 18.24-12.59 30.74t-30.83 12.5ZM619.91-80q-18.24 0-30.74-12.59-12.5-12.6-12.5-30.84 0-18.24 12.59-30.74t30.83-12.5q18.24 0 30.74 12.6 12.5 12.59 12.5 30.83T650.74-92.5Q638.15-80 619.91-80ZM293.33-373.33q-88.24 0-150.78-62.52Q80-498.36 80-586.56 80-667 136-729t139-69.67q32-56.33 85.5-88.83T480.28-920q90.39 0 153.55 57.5Q697-805 711-719.67 786.67-715 833.33-665 880-615 880-546.92q0 71.92-50.56 122.75-50.55 50.84-122.77 50.84H293.33Zm0-66.67h413.34q44.8 0 75.73-31.33 30.93-31.34 30.93-75.67t-30.93-75.33q-30.93-31-75.73-31h-60v-33.34q0-69.33-48.67-118-48.67-48.66-117.86-48.66-50.32 0-91.73 27-41.41 27-61.41 73l-8.67 20h-27q-60.33 2-102.5 44.42-42.16 42.43-42.16 102.15 0 60.76 42.95 103.76 42.95 43 103.71 43ZM480-546.67Z"/></svg>'
            break
        default:
            icon = '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M424-320q0-81 14.5-116.5T500-514q41-36 62.5-62.5T584-637q0-41-27.5-68T480-732q-51 0-77.5 31T365-638l-103-44q21-64 77-111t141-47q105 0 161.5 58.5T698-641q0 50-21.5 85.5T609-475q-49 47-59.5 71.5T539-320H424Zm56 240q-33 0-56.5-23.5T400-160q0-33 23.5-56.5T480-240q33 0 56.5 23.5T560-160q0 33-23.5 56.5T480-80Z"/></svg>'
    }
    const currentWeatherIcon = document.querySelector("#current-weather-icon")
    currentWeatherIcon.innerHTML = icon

    const temp = document.querySelector('#current-temperature')
    temp.innerHTML = `${currentWeatherInfo.temperature}°C`
}