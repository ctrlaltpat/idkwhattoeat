import React, { Component } from 'react'
import Place from './Place'

export default class GetRandom extends Component {
  state = {
    service: null,
    search: 'food',
    cuisine: '',

    places: [],
    currentRandom: null
  }
  setUpSearch = () => {
    const { map, gMaps } = this.props
    this.setState({
      service : new gMaps.places.PlacesService(map)
    })
  }
  getPlaces = (results, status) => {
    let places = []
    if (status === this.props.gMaps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        let place = {
          name: results[i].name
        }
        places.push(place)
      }
    }
    const randomPlace = places[Math.floor(Math.random()*places.length-1)]
    this.setState({
      places: places,
      currentRandom: randomPlace
    })
  }
  getRandom = () => {
    const { userLocation, gMaps } = this.props
    const location = new gMaps.LatLng(userLocation.lat, userLocation.lng)
    this.state.service.nearbySearch({
      location: location,
      keyword: this.state.search,
      openNow: true,
      radius: 500,
    }, this.getPlaces)
  }
  componentDidMount(){
    this.setUpSearch()
  }
  render() {
    const { _open } = this.props
    const random = this.state.currentRandom
    return (
      <React.Fragment>
        <div className={`overlay ${ _open ? "open": ""}`}></div>
        <div className={`get-random ${_open ? "open" : ""}`}>
          <button 
            type="submit" 
            className="btn--ripple wh"
            onClick={this.getRandom}
          >
            Get Random
          </button>
          {random && <Place place={random} />}
        </div>
      </React.Fragment>
    )
  }
}
