import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'

class ListView extends Component {

  state = {
    query: ''
  }

  updateQuery = (query) => {
    this.setState({ query: query })
  }

  render() {
    let showingVenues
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i')
      showingVenues = this.props.venues.filter((venue) => match.test(venue.venue.name))
    } else {
      showingVenues = this.props.venues
    }

    return(
      <div id='list-venues'>
        <div className='list-venues-top'>
          <input
            className='search-venues'
            type='text'
            value={this.state.query}
            onChange={(event) => this.updateQuery(event.target.value)}
            placeholder='Search Venues'
            labelledby="placeholder"
            role="search"
          />
        </div>
        <ul className='venue-list' aria-label='List of coffee shops near Harpa'>
          {showingVenues.map((showingVenue) => (
            <li key={showingVenue.venue.id} tabIndex="0" aria-label={showingVenue.venue.name} role="menuitem" className='venue-list-item'>
              <p>{showingVenue.venue.name}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ListView;
