import React, { Component } from 'react'
import Place from './Place'

export default class GetRandom extends Component {
  state = {
    service: null,
    search: 'food',
    cuisine: '',
    radius: 500,
    places: [],
    currentRandom: null,
    seen: []
  }
  setUpSearch = () => {
    const { map, gMaps } = this.props
    this.setState({
      service : new gMaps.places.PlacesService(map)
    })
  }
  getNearby = () => {
    this.props.isLoading()
    const { userLocation, gMaps } = this.props
    const location = new gMaps.LatLng(userLocation.lat, userLocation.lng)
    this.state.service.nearbySearch({
      location: location,
      keyword: this.state.search,
      openNow: true,
      radius: this.state.radius,
    }, this.getPlaces)
  }
  getPlaces = (results, status) => {
    let places = []
    if (status === this.props.gMaps.places.PlacesServiceStatus.OK) {
      results.forEach(result => places.push({ ...result }))
    }
    this.setState({
      places: places
    }, () => this.getRandom())
  }
  getRandom = () => {
    const randomPlace = this.state.places[Math.floor(Math.random()*this.state.places.length-1)]
    setTimeout(() => {
      const request = {
        placeId: randomPlace.place_id,
        fields: ['name', 
                  'rating', 
                  'formatted_phone_number', 
                  'geometry',
                  'icon',
                  'opening_hours',
                  'photos',
                  'price_level',
                  'reviews',
                  'url',
                  'website'
                ]
      };
      this.state.service.getDetails(request, (place, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          console.log(place)
          this.setState({
            currentRandom: place,
            seen: [...this.state.seen, place]
          }, () => this.props.doneLoading())
        }
      })
    }, 1000); // need to figure out why this happens
  }
  componentDidMount(){
    this.setUpSearch()
  }
  render() {
    const { _open, toggle } = this.props
    const random = this.state.currentRandom
    return (
      <React.Fragment>
        <div className={`overlay ${ _open ? "open": ""}`}></div>
        <div className={`get-random ${_open ? "open" : ""}`}>
          <button 
            type="submit" 
            className="btn--ripple wh"
            onClick={this.getNearby}
          >
            Get Random
          </button>
          {random && <Place place={random} />}
          <div className="close-menu btn--ripple wh">x</div>
        </div>
      </React.Fragment>
    )
  }
}
