/* Global Variables */
//Set API base URL and API key
const baseURL = 'api.openweathermap.org/data/2.5/weather?zip='; // append zip code + API Key
const apiKey = '&appid=8b9fe9db439c50ea5636ae2ea3a91d84&units=imperial';
const apiKeyName = 'Default';

// Creating an date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth() + 1)+'.'+ d.getDate()+'.'+ d.getFullYear();

//Using openweather.com to get current weather
const getWeather = async (baseURL, zipCode, apiKey) => {
    const response = await fetch(`https://${baseURL}${zipCode}${apiKey}`);

    try {
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.log(error);
    }
};

//Posting the User data from the DOM to the local server API
const getUserData = async (url = '', data = {}) => {
    const response = await fetch(url, 
        {
            method: "POST", 
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },       
            body: JSON.stringify(data), 
          }
        );

        try {
            const UserDataNew =  await response.json();
            return UserDataNew;
        } catch (error) {
            console.log(error);
        }
};


//Activating async event on click
document.getElementById('generate').addEventListener('click', (event)=> {
    event.preventDefault()

    //Disable the Error visibility of messages from the UI
    document.getElementById('zip-code-error').style.display = 'none';
    document.getElementById('feelings-error').style.display = 'none';
 
    //Returning Weather temperature async
    const weather = async () => {

        //Fetch User Content from the DOM and the OpenWeatherMap.com API
        let zipCode = document.getElementById('zip').value;
        let feelings = document.getElementById('feelings').value;

        //validate zip code and feelings
        const validate = async (zipCode, feelings) => {
            let zipCodePate = /^\d{5}$|^\d{5}-\d{4}$/;
            let zipCodeTester = zipCodePate.test(zipCode);

            //Generate zip code error message
            const zipMessage = () => {
                const zipCodeError = document.getElementById('zip-code-error');
                zipCodeError.style.display = 'block';
                zipCodeError.style.color = 'blue';
                zipCodeError.style.fontSize = '0.74em';
                zipCodeError.style.backgroundColor = '#fff';
                zipCodeError.innerHTML = 'Must be in range of(12345 or 12345-6789).';
            };

            //Generate feelings error message
            const feelingsMessage = () => {
                const feelingsError = document.getElementById('feelings-error');
                feelingsError.style.display = 'block';
                feelingsError.style.color = 'blue';
                feelingsError.style.fontSize = '0.74em';
                feelingsError.style.backgroundColor = '#fff';
                feelingsError.innerHTML = 'Typing what you feel Is Important .';
            };

            //Validation conditions
            if (zipCodeTester == false && feelings == '') {
                zipMessage();
                feelingsMessage();
                return;
            } else if (zipCodeTester == false) {
                zipMessage();
                return;
            } else if (feelings == '') {
                feelingsMessage();
                return;
            }

            //Initiate Current weather temperature
            const weatherAsync = await getWeather(baseURL, zipCode, apiKey);
            let temperature = weatherAsync.main.temp;

            //Construct Project Data in the local server
            let userData = {
                'zip-code': zipCode,
                'feelings': feelings,
                'temp': temperature,
                'date': newDate
            };

            //Initaite updating user content in the UI
            await userContent(userData);

            //Update the temperature in the UI
            document.getElementById('temp').innerHTML = `Temperature: ${temperature} °C`;
            return userData;
        }

        //Initiate validation
        await validate(zipCode, feelings);
    };

    //Return User Content async to local server
    const userContent = async (userData) => {
        const userAsyncContent = await getUserData('/api', userData);
        const latestZipCode = userAsyncContent['zip-code'];
        const latestFeelings = userAsyncContent['feelings'];

        //Updating the Date, zipCode and Feelings in the UI
        document.getElementById('date').innerHTML = `Date: ${newDate}`;
        document.getElementById('content').innerHTML = `Zipcode: ${latestZipCode}<br>Feelings: ${latestFeelings}`;
        return userAsyncContent;
    };

    //Initiate acynch functions weather() and userContent() on click
    weather();
});
