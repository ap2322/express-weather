class FormatForecast {
  constructor(info) {
    this.locationInfo = info.place;
    this.currentlyInfo = info.data.currently;
    this.hourlyInfo = info.data.hourly;
    this.dailyInfo = info.data.daily;
  }

  makeCurrently() {
    let currently = {
          summary: this.currentlyInfo.summary,
          icon: this.currentlyInfo.icon,
          precipIntensity: this.currentlyInfo.precipIntensity,
          precipProbability: this.currentlyInfo.precipProbability,
          temperature: this.currentlyInfo.temperature,
          humidity: this.currentlyInfo.humidity,
          pressure: this.currentlyInfo.pressure,
          windSpeed: this.currentlyInfo.windSpeed,
          windGust: this.currentlyInfo.windGust,
          windBearing: this.currentlyInfo.windBearing,
          cloudCover: this.currentlyInfo.cloudCover,
          visibility: this.currentlyInfo.visibility,
        }

    return currently;
  }

  makeDaily(days) {
    let daily = {
      summary: this.dailyInfo.summary,
      icon: this.dailyInfo.icon,
      data: this.loopDays(days, this.dailyInfo.data)
      }

    return daily
  }

  makeHourly(hours) {
    let hourly = {
      summary: this.hourlyInfo.summary,
      icon: this.hourlyInfo.icon,
      data: this.loopHourly(hours, this.hourlyInfo.data)
    }
    return hourly
  }

  loopHourly(hours, hourlyCollection) {
    let collection = [];
    for(let i=0; i<hours; i++){
      collection.push({
        time: hourlyCollection[i].time,
        summary: hourlyCollection[i].summary,
        icon: hourlyCollection[i].icon,
        precipIntensity: hourlyCollection[i].precipIntensity,
        precipProbability: hourlyCollection[i].precipProbability,
        temperature: hourlyCollection[i].temperature,
        humidity: hourlyCollection[i].humidity,
        pressure: hourlyCollection[i].pressure,
        windSpeed: hourlyCollection[i].windSpeed,
        windGust: hourlyCollection[i].windGust,
        windBearing: hourlyCollection[i].windBearing,
        cloudCover: hourlyCollection[i].cloudCover,
        visibility: hourlyCollection[i].visibility,
      })
    }
    return collection;
  }

  loopDays(days, dailyCollection) {
    let collection = [];
    for(let i=0; i < days; i++){
      collection.push({
        time: dailyCollection[i].time,
        summary: dailyCollection[i].summary,
        icon: dailyCollection[i].icon,
        sunriseTime: dailyCollection[i].sunriseTime,
        sunsetTime: dailyCollection[i].sunsetTime,
        precipIntensity: dailyCollection[i].precipIntensity,
        precipIntensityMax: dailyCollection[i].precipIntensityMax,
        precipIntensityMaxTime: dailyCollection[i].precipIntensityMaxTime,
        precipProbability: dailyCollection[i].precipProbability,
        precipType: dailyCollection[i].precipType,
        temperatureHigh: dailyCollection[i].temperatureHigh,
        temperatureLow: dailyCollection[i].temperatureLow,
        humidity: dailyCollection[i].humidity,
        pressure: dailyCollection[i].pressure,
        windSpeed: dailyCollection[i].windSpeed,
        windGust: dailyCollection[i].windGust,
        cloudCover: dailyCollection[i].cloudCover,
        visibility: dailyCollection[i].visibility,
        temperatureMin: dailyCollection[i].temperatureMin,
        temperatureMax: dailyCollection[i].temperatureMax,
      })
    }
    return collection;
  }


}

module.exports = FormatForecast;
