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
