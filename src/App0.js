import React, { Component } from 'react';
import './App.css';
import Map from './components/Map.js'

import axios from 'axios'

class App extends Component {

  state = {
    venues: []
  }

  componentDidMount() {
    this.getVenues()
  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDIZ-5GLvu0xUA2f6vwt82p2R8W2au8aDc&callback=initMap")
    window.initMap = this.initMap
  }
//used LatLong.net to get ll for Harpa Concert Hall in Reykjavik, Iceland
//used Foursquare API for venue recommendations/venue information
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "L5DKG5X0DKH5JYOCWVFLRP1UPSWZJKJY51HYMEK2CFCSD5KV",
      client_secret: "APCJA50MQOTWPKJXYABRI0C1NQZCHL0VD40NWAEODBRSEKQU",
      query: "coffee",
      ll: "64.150420, -21.932570",
      radius: "2000",
      v: "20180901",
      limit: 15
    }

//like fetchAPI
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        console.log("ERROR! " + error)
      })
  }

  initMap = () => {
    // Create A Map
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 64.150420, lng: -21.932570},
      zoom: 14
    })
    // Create An InfoWindow
    const infowindow = new window.google.maps.InfoWindow()
    // Display Dynamic Markers
    this.state.venues.forEach(myVenue => {
      const contentString = `${myVenue.venue.name}`
      // Create A Marker
      const marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
        map: map,
        title: myVenue.venue.name
      })
      marker.addListener('click', function() {
        infowindow.setContent(contentString)
        infowindow.open(map, marker);
      })
    })
  }

  render() {
    return (
      <Map />
    );
  }
}

function loadScript(url) {
  const index = window.document.getElementsByTagName("script")[0]
  const script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;
