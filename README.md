# Express Weather
A weather data API built in Express.js that retrieves forecast data for a single location or mulitple favorite locations at a time.

# Deployed At
https://express-weather-ap.herokuapp.com

# Technologies
* Node.js v12.14.1
* Express.js
* Knexjs v20.8
* Postgres v11.5

# External APIs Used
* [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro)
* [DarkSky API](http://darksky.net/dev)

</hr>

# Weather Endpoints
All endpoints require a valid api_key sent through the body of the request in an `x-www-form-urlencoded` format. Current version is `/api/v1/`. All endpoint requests use `Content-Type: application/json` and `Accept: application/json`.

Example request: `https://express-weather-ap.herokuapp.com/api/v1/forecast?Denver,CO` would return the current forecast for Denver, CO.

## Forecast
`GET /api/v1/forecast?<params>`

Required params:
* `location` - in the format `city,state` or `city,state,country` if applicable

Output Example:
```
{
  "location": "Denver, C0",
  "currently": {
      "summary": "Overcast",
      "icon": "cloudy",
      "precipIntensity": 0,
      "precipProbability": 0,
      "temperature": 54.91,
      "humidity": 0.65,
      "pressure": 1020.51,
      "windSpeed": 11.91,
      "windGust": 23.39,
      "windBearing": 294,
      "cloudCover": 1,
      "visibility": 9.12,
    },
  "hourly": {
    "summary": "Partly cloudy throughout the day and breezy this evening.",
    "icon": "wind",
    "data": [
      {
      "time": 1555016400,
      "summary": "Overcast",
      "icon": "cloudy",
      "precipIntensity": 0,
      "precipProbability": 0,
      "temperature": 54.9,
      "humidity": 0.65,
      "pressure": 1020.8,
      "windSpeed": 11.3,
      "windGust": 22.64,
      "windBearing": 293,
      "cloudCover": 1,
      "visibility": 9.02,
      },
    ]
  },
  "daily": {
    "summary": "No precipitation throughout the week, with high temperatures bottoming out at 58°F on Monday.",
    "icon": "clear-day",
    "data": [
      {
        "time": 1554966000,
        "summary": "Partly cloudy throughout the day and breezy in the evening.",
        "icon": "wind",
        "sunriseTime": 1554990063,
        "sunsetTime": 1555036947,
        "precipIntensity": 0.0001,
        "precipIntensityMax": 0.0011,
        "precipIntensityMaxTime": 1555045200,
        "precipProbability": 0.11,
        "precipType": "rain",
        "temperatureHigh": 57.07,
        "temperatureLow": 51.47,
        "humidity": 0.66,
        "pressure": 1020.5,
        "windSpeed": 10.94,
        "windGust": 33.93,
        "cloudCover": 0.38,
        "visibility": 9.51,
        "temperatureMin": 53.49,
        "temperatureMax": 58.44,
      },
    ]
  }
}
```

## Favorite Locations 
### Create Favorite
```
POST /favorites
body:
{
  "location": <city, state>,
  "api_key": <user api_key>
}
```
Both `location` and `api_key` are required. 

### List Favorite Locations and their Weather
```
GET /api/v1/favorites

body:
{
  "api_key": <user api_key>
}
```
Required `api_key` in the body of the request.

Output Example:
```
[
    {
        "location": "Denver, CO",
        "current_forecast": {
            "summary": "Clear",
            "icon": "clear-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 70.73,
            "humidity": 0.07,
            "pressure": 998.2,
            "windSpeed": 11.69,
            "windGust": 20.65,
            "windBearing": 170,
            "cloudCover": 0,
            "visibility": 10
        }
    }
 ]
```

### Delete a Favorite Location
```
DELETE /api/v1/favorites
body:
{
  "location": <city, state>,
  "api_key": <api key>
}
```
Both `location` and `api_key` required in body of request.


<hr>

# Local use and setup

## Getting started
To use this repo, you’ll need to `fork` the repo as your own. Once you have done that, you’ll need to run the following command below to get everything up and running. 

#### Installing necessary dependencies
The easiest way to get started is to run the following command. This will pull down any necessary dependencies that your app will require. You can think of this command as something incredibly similar to `bundle install` in Rails. 

`npm install`

#### Set up your local database
You’ll need to figure out a name for your database. We suggest calling it something like `sweater_weather_dev`.  

To get things set up, you’ll need to access your Postgres instance by typing in `psql` into your terminal. Once there, you can create your database by running the comment `CREATE DATABASE PUT_DATABASE_NAME_HERE_dev;`. 

Now you have a database for your new project.

#### Migrations
Once you have your database setup, you’ll need to run some migrations (if you have any). You can do this by running the following command: 

`knex migrate:latest`


Instructions to create database, run migrations, and seed: 
```
psql
CREATE DATABASE DATABASE_NAME_dev;
\q

knex migrate:latest
knex seed:run
```

#### Set up your test database
Most of the setup is going to be same as the one you did before. You’ll notice one small difference with setting the environment flag to `test`.  

```
psql
CREATE DATABASE DATABASE_NAME_test;
\q

knex migrate:latest --env test
```
## Environment Variables
Include the following environment varibles with your own api keys from Google Geocoding API and DarkSky API in your local `.env` file or in your config variables in production:
```
GEOCODING_API
DARKSKY_API_KEY
```

## Running your tests
Running tests are simple and require you to run the following command below: 

`npm test` 

## Setting up your production environment
- Start a brand new app on the Heroku dashboard 
- Add a Postgres instance to your new Heroku app
- Find the URL of that same Postgres instance and copy it. It should look like a long url. It may look something like like `postgres://sdflkjsdflksdf:9d3367042c8739f3...`.
- Update your `knexfile.js` file to use your Heroku database instance. You’ll see a key of `connection` with a value of an empty string. This is where you’ll paste your new Postgres instance URL. 

Once you’ve set all of that up, you’ll need to `add the remote` to your new app. This should work no differently than how you’ve done it with any Rails project. Adding this remote will allow you to run `git push heroku master`. 

Once you’ve done that, you’ll need to `bash` into your Heroku instance and get some things set up. 

- Run the following commands to get started:
```
heroku run bash
npm install
nom install -g knex
knex migrate:latest
```

This will install any dependencies, install Knex, and migrate any changes that you’ve made to the database. 
