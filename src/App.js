import React, { Component } from 'react';
import './App.css';
import Map from './components/Map.js';
import ListView from './components/ListView.js';
import axios from 'axios';

class App extends Component {

  state = {
    venues: [],
    markers: []
  }

  componentDidMount() {
    this.getVenues()
  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDIZ-5GLvu0xUA2f6vwt82p2R8W2au8aDc&callback=initMap")
    window.initMap = this.initMap
  }
  //used LatLong.net to get ll for Harpa Concert Hall in Reykjavik, Iceland
  //used Foursquare API for venue recommendations/information
  getVenues = (venues) => {
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

    //using axios to fetch the data
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        alert("ERROR! " + error)
      })
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 64.150420, lng: -21.932570},
      zoom: 14
    })
    const infowindow = new window.google.maps.InfoWindow()
    this.state.venues.forEach((venue) => {
      const infoString = `<h4>${venue.venue.name}</h4><p>Street Address: ${venue.venue.location.address}</p><p>Distance from Harpa: ${venue.venue.location.distance} meters</p>`
      let marker = new window.google.maps.Marker({
        position: {lat: venue.venue.location.lat, lng: venue.venue.location.lng},
        map: map,
        title: venue.venue.name,
        id: venue.venue.id,
        animation: window.google.maps.Animation.DROP
      })
      marker.addListener('click', function() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
        }
        setTimeout(() => { marker.setAnimation(null) }, 1000);
        infowindow.setContent(infoString)
        infowindow.open(map, marker);
      })
      this.state.markers.push(marker);
    })
  }

  render() {
    return (
      <div id="app-container">
        <ListView
          venues={this.state.venues}
          markers={this.state.markers}
        />
        <Map />
      </div>
    );
  }
}

function loadScript(url) {
  const index = window.document.getElementsByTagName("script")[0]
  const script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  script.onerror = function() {
    alert("Error loading map!");
  };
  index.parentNode.insertBefore(script, index)
}

export default App;
