import React, { Component } from 'react';
import './App.css';

import MapDiv from './components/MapDiv.js';
import NavBar from './components/NavBar.js';
import SideBar from './components/SideBar.js';
import InfoModal from './components/InfoModal.js';

import * as utils from './utils'


class AppRyan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: null,
      sidebarOpen: false,
      query: "",
      showModal: false
    }
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.menuKeyEnter = this.menuKeyEnter.bind(this);
    this.liKeyEnter = this.liKeyEnter.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.li_click = this.li_click.bind(this);
    this.liKeyEnter = this.liKeyEnter.bind(this);
    this.filterVenues = this.filterVenues.bind(this);
  }

  handleClose() {
    this.setState({ showModal: false });
  }

  handleShow() {
    this.setState({ showModal: true });
  }

  toggleSidebar() {
    this.setState(state => ({ sidebarOpen: !state.sidebarOpen }));
  }

  getGoogleMaps() {
    if (!this.googleMapsPromise) {
      this.googleMaps.Promise = new Promise((resolve) => {
        window.resolveGoogleMapsPromise = () => {
          resolve(window.google);
          delete window.resolveGoogleMapsPromise;
        };
        const script = document.createElement("script");
        const API = 'API KEY HERE';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
      });
    }
    return this.googleMapsPromise;
  }

  componentWillMount() {
    this.getGoogleMaps();
  }

  li_click(venue) {
    let marker = this.markers.filter(m => m.venue.id === venue.id)[0];
    let info_obj = this.info_boxes.filter(i => i.id === venue.id)[0];
    let infoBox = info_obj && info_obj.contents || "nothing...";
    if(marker && infoBox) {
      if (marker.getAnimation() !== null) { marker.setAnimation(null); }
      else { marker.setAnimation(this.google.maps.Animation.BOUNCE); }
      setTimeout(() => { marker.setAnimation(null) }, 1500);

      this.infowindow.setContent(infoBox);
      this.map.setZoom(13);
      this.map.setCenter(marker.position);
      this.infowindow.open(this.map, marker);
      this.map.panBy(0, -125);
      if(window.innerWidth < 769) {
        this.toggleSidebar();
      }
    }
  }

  componentDidMount() {
    let get_google = this.getGoogleMaps();
    let get_venues = utils.loadPlaces();
    let get_wiki = utils.loadWiki();

    Promise.all([ get_google, get_venues, get_wiki ])
    .then(values => {
      console.log(values);
      let google = values[0];
      let venues = values[1];
      let wikidata = values[2];

      let markers = [];
      let info_boxes = [];

      this.google = google;
      this.infowindow = new google.maps.InfoWindow();
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        scrollwheel: true,
        center: { lat: venues[0].location.lat, lng: venues[0].location.lng }
      });

      venues.forEach(venue => {
        let marker = new google.maps.Marker({
          position: { lat: venue.location.lat, lng: venue.location.lng },
          map: this.map,
          venue: venue,
          id: venue.id,
          name: venue.name,
          animation: google.maps.Animation.DROP
        });
        let infoBox = '<div class="info_box">' +
        '<h4>' + venue.name + '/h4>' +
        '<p>' + utils.aft(venue.location.formattedAddress) + '</p>' +
        '<p>' + venue.hereNow.summary + '</p>' +
        '<img class="middlr" alt="' + venue.name + '"src="' + utils.getGoogleImage(venue) + '" />' +
        '</div>';
        marker.addListener('click', () +> {
          if (marker.getAnimation() !== null) { marker.setAnimation(null); }
          else { marker.setAnimation(google.maps.Animation.BOUNCE); }
          setTimeout(() => { marker.setAnimation(null) }, 1500);
        });
        google.maps.event.addListener(marker, 'click', () => {
          this.infowindow.setContent(infoBox);
          this.map.setZoom(13);
          this.map.setCenter(marker.position);
          this.infowindow.open(this.map, marker);
          this.map.panBy(0, -125);
        });
        markers.push(marker);
        info_boxes.push({ id: venue.id, name: venue.name, contents: infoBox });
      });

      this.venues = utils.sort_by(venues, "name", "asc");
      this.markers = utils.sort_by(markers, "name", "asc");
      this.info_boxes = utils.sort_by(info_boxes, "name", "asc");

      this.setState({ sidebarOpen: true, filtered: this.venues, wikidata });
    })
    .catch(error => {
      console.log(error);
      alert('Error loading page...');
    })
  }

  filterVenues(query) {
    let f = query ? this.venues.filter(v => v.name.toLowerCase().includes(query.toLowerCase())) : this.venues;
    this.markers.forEach(m => {
      m.name.toLowerCase().includes(query.toLowerCase()) ?
      m.setVisible(true) :
      m.setVisible(false);
    });
    this.setState({ filtered: f, query: query });
  }

  menuKeyEnter(event) {
    var code = event.keyCode || event.which;
    if(code === 13) {
      this.toggleSidebar();
    }
  }

  liKeyEnter(event, venue) {
    var code = event.keyCode || event.which;
    if(code === 13) {
      this.li_click(venue);
    }
  }

  render() {
    let displaySidebar = this.state.sidebarOpen ? "block" : "none";
    let menuText = this.state.sidebarOpen ? "Close" : "Open";

    return(
      <div id="app-container">
        <NavBar
          menuText={menuText}
          sidebarOpen={this.state.sidebarOpen}
          toggleSidebar={this.toggleSidebar}
          li_click={this.li_click}
          menuKeyEnter={this.menuKeyEnter} />

        <SideBar
          menuText={menuText}
          wikidata={this.state.wikidata}
          query={this.state.query}
          filtered={this.state.filtered}
          sidebarOpen={this.state.sidebarOpen}
          toggleSidebar={this.toggleSidebar}
          liKeyEnter={this.liKeyEnter}
          filterVenues={this.filterVenues}
          li_click={this.li_click}
          liKeyEnter={this.liKeyEnter}
          handleShow={this.handleShow}
          displaySidebar={displaySidebar} />

          {
            this.state.wikidata && (
              <InfoModal
                wikidata={this.state.wikidata}
                showModal={this.state.showModal}
                handleClose={this.handleClose} />
            )
          }

          <MapDiv />
      </div>
    );
  }
}

export default AppRyan;
