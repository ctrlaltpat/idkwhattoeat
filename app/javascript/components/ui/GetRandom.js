import React, { Component } from 'react'

import Place from './Place'

export default class GetRandom extends Component {
  state = {
    placesService: null,
    // directionsService: null,
    search: 'food',
    cuisine: this.props.userSettings.cuisine,
    radius: this.props.userSettings.radius,
    places: [],
    currentRandom: this.props.currentPlace,
    seen: []
  }
  setUpServices = () => {
    const { map, gMaps } = this.props
    this.setState({
      placesService : new gMaps.places.PlacesService(map),
      // directionsService : new gMaps.DirectionsService
    })
  }
  getNearby = () => {
    this.props.isLoading()
    const { userLocation, gMaps } = this.props
    const location = new gMaps.LatLng(userLocation.lat, userLocation.lng)
    this.state.placesService.nearbySearch({
      location: location,
      keyword: `${this.state.cuisine} ${this.state.search}`,
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
    }, () => this.getRandom(places))
  }
  getRandom = (places) => {
    // const unSeen = places.filter(place => {
    //   return !this.state.seen.includes(this.state.seen.find(s=>s.id === place.place_id))
    // })
    // const randomPlace = unSeen[Math.floor(Math.random()*unSeen.length-1)]
    const randomPlace = places[Math.floor(Math.random()*places.length-1)]
    if (randomPlace !== undefined && randomPlace.place_id !== undefined) {
      const request = {
        placeId: randomPlace.place_id,
        fields: ['name', 
                  'rating', 
                  'formatted_phone_number', 
                  'formatted_address',
                  'geometry',
                  'opening_hours',
                  'photos',
                  'price_level',
                  'url',
                  'website'
                ]
      };
      this.state.placesService.getDetails(request, (place, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          const currentRandom = {
            ...place, 
            id: randomPlace.place_id
          }
          this.props.changeCurrentPlace(currentRandom)
          this.setState({
            currentRandom: currentRandom,
            seen: [...this.state.seen, currentRandom]
          }, () => this.props.doneLoading())
        }
      })
    } else {
      setTimeout(() => {
        alert('Sorry, something went VERY WRONG...please try again :)')
        this.props.doneLoading()
      }, 2000);
      // console.log("No Place ID...Q_Q... trying again..")
      // this.getRandom(places)
    }
  }
  getDirections = () => {
    this.props.getDirections()
  }
  componentDidMount(){
    this.setUpServices()
  }
  render() {
    const { _open, toggle, user } = this.props
    const random = this.state.currentRandom
    return (
      <React.Fragment>
        <div className={`overlay ${ _open ? "open": ""}`}></div>
        <div className={`get-random ${_open ? "open" : ""}`}>
          {random && <Place place={random} username={user.username} showImages={true} />}
          <button
            className="_btn btn--ripple wh"
            onClick={this.getNearby}
          >
            Get {random && "Another"} Random
          </button>
          {random && 
            <button
              className="_btn btn--ripple wh"
              onClick={this.getDirections}
            >
              Get Directions
            </button>
          }
          <div className="close-menu btn--ripple wh" onClick={() => toggle('random')}>x</div>
        </div>
      </React.Fragment>
    )
  }
}
