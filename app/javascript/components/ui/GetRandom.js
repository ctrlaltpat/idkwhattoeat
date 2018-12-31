import React, { Component } from 'react'
const pin = require('../../marker.png')
import Place from './Place'

export default class GetRandom extends Component {
  state = {
    placesService: null,
    directionsService: null,
    search: 'food',
    cuisine: this.props.userSettings.cuisine,
    radius: this.props.userSettings.radius,
    places: [],
    activeDirections: null,
    activeMarkers: null,
    currentRandom: null,
    seen: []
  }
  setUpServices = () => {
    const { map, gMaps } = this.props
    this.setState({
      placesService : new gMaps.places.PlacesService(map),
      directionsService : new gMaps.DirectionsService
    })
  }
  getNearby = () => {
    this.props.isLoading()
    const { userLocation, gMaps } = this.props
    const location = new gMaps.LatLng(userLocation.lat, userLocation.lng)
    this.state.placesService.nearbySearch({
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
          this.props.addToHistory(currentRandom)
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
    const { map, gMaps, toggle } = this.props
    const { directionsService, activeDirections } = this.state
    let markerArray = []
    if (activeDirections) {
      activeDirections.setMap(null)
    }
    const directionsDisplay = new gMaps.DirectionsRenderer({
      map: map,
      polylineOptions: { strokeColor: "#E87527" }
    });
    this.setState({activeDirections: directionsDisplay})
    let stepDisplay = new gMaps.InfoWindow;

    this.calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);

    toggle('random')
  }
  calculateAndDisplayRoute = (directionsDisplay, directionsService, markerArray, stepDisplay, map) => {
    const { userLocation, gMaps } = this.props
    const userLoc = new gMaps.LatLng(
      userLocation.lat, 
      userLocation.lng
    )
    const placeLoc = new gMaps.LatLng(
      this.state.currentRandom.geometry.location.lat(),
      this.state.currentRandom.geometry.location.lng()
    )
    // First, remove any existing markers from the map.
    this.state.activeMarkers && this.state.activeMarkers.forEach( marker => marker.setMap(null) )
    this.setState({activeMarkers: null})
    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.
    directionsService.route({
      origin: userLoc,
      destination: placeLoc,
      travelMode: 'WALKING'
    }, (response, status) => {
      // Route the directions and pass the response to a function to create
      // markers for each step.
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        this.showSteps(response, markerArray, stepDisplay, map);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }
  showSteps = (directionResult, markerArray, stepDisplay, map) => {
    const { gMaps } = this.props
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    let myRoute = directionResult.routes[0].legs[0];
    for (let i = 0; i < myRoute.steps.length; i++) {
      let marker = markerArray[i] = markerArray[i] || new gMaps.Marker({
        icon: pin,
        animation: google.maps.Animation.DROP
      });
      marker.setMap(map);
      marker.setPosition(myRoute.steps[i].start_location);
      this.attachInstructionText(
          stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
    this.setState({activeMarkers: markerArray})
  }
  attachInstructionText = (stepDisplay, marker, text, map) => {
    const { gMaps } = this.props
    gMaps.event.addListener(marker, 'click', () => {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }
  componentDidMount(){
    this.setUpServices()
  }
  render() {
    const { _open, toggle } = this.props
    const random = this.state.currentRandom
    return (
      <React.Fragment>
        <div className={`overlay ${ _open ? "open": ""}`}></div>
        <div className={`get-random ${_open ? "open" : ""}`}>
          {random && <Place place={random} />}
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
