import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'

class ListView extends Component {

  state = {
    query: ''
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  render() {
    let showingVenues
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i')
      showingVenues = this.props.venues.filter((venue) => match.test(venue.name))
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
          />
        </div>
        <ul className='venue-list'>
          {showingVenues.map((venue) => (
            <li key={venue.id} className='venue-list-item'>
              <div className='venue-details'>
                <p>{venue.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ListView;
