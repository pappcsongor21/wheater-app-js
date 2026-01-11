let apiKey = ""
const language = "hu"
const weatherForm = document.querySelector('form')
const geocodingApiRouteBase = "https://maps.googleapis.com/maps/api/geocode/json?"//address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY

loadApiKey()

weatherForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    console.log("button pressed")
    getWeather()
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

async function getWeather(){
    input = document.getElementById("")

    if(input.length == 0){
        console.log("no input, skip")
        return}

    const location = await getLocationAsync(input)


    //if(!locationIsFound(input)){console.error("Location not found")}
    
}

async function getLocationAsync(input){
    response = await fetch(`${geocodingApiRouteBase}address=${input}&key=${apiKey}`)
    if(!response.ok){
        throw new Error("problem with geocoding api")
    }
    data = await response.json()
    console.log(data)
}

function locationIsFound(input){
    return true
}