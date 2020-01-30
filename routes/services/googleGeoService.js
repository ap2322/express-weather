class googleGeoService {
  constructor(searchLocation) {
    this.searchLocation = searchLocation.location;
  }

  latLong() {
    // make api call to googleGeoService
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=
      ${process.env.GEOCODING_API}&address=${this.searchLocation}`)
      .then(response => response.json())
      .catch(response => response.error)
  }
}

module.exports = googleGeoService;
