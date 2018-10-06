import React, { Component } from 'react';

class ListView extends Component {
  render() {
    return(
      <div id="list-venues">
        <div id="search-venues">
          <input
            type="text"
            placeholder="Search Venues"
          />
        </div>
        <div id="venue-list">
        </div>
      </div>
    );
  }
}

export default ListView;
