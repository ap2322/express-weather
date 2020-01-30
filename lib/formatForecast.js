class Format {
  constructor(info) {
    this.locationInfo = info.place;
    this.currentlyInfo = info.data.currently;
    this.hourlyInfo = info.data.hourly;
    this.dailyInfo = info.data.daily;
  }

  makeCurrently() {
    let currently = {
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

module.exports = Format;
