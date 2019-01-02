import React, { Component } from 'react'

const pin = require('../../marker.png')
import GetRandom from './GetRandom'
import History from './History'
import Settings from './Settings'

class Menu extends Component {
  state={
    isOpen: false,
    random: false,
    history: false,
    settings: false,
    userFoundIt: false,
    currentPlace: null,
    directionsService: null,
    activeDirections: null,
    activeMarkers: null,
  }
  handleClick = (context) => {
    switch (context) {
      case 'main':
        this.setState({isOpen: !this.state.isOpen}, () => {
          if(!this.state.isOpen) {
            this.closeMenu()
          }
          if(!this.state.userFoundIt) {
            this.setState({userFoundIt: true})
          }
        })
        break;
      case 'random':
        this.setState({
          random: !this.state.random, 
          isOpen: false, 
          history: false, 
          settings: false
        })
        break;
      case 'history':
        this.setState({
          history: !this.state.history, 
          isOpen: false, 
          random: false,
          settings: false
        })
        break;
      case 'settings':
        this.setState({
          settings: !this.state.settings, 
          isOpen: false, 
          random: false,
          history: false
        })
        break;
      case 'X-X':
        this.closeMenu()
        break;
      default:
        break;
    }
  }
  closeMenu = () => {
    this.setState({
      isOpen: false,
      random: false,
      history: false,
      settings: false
    })
  }
  setUpServices = () => {
    const { gMaps } = this.props
    this.setState({
      directionsService : new gMaps.DirectionsService
    })
  }
  changeCurrentPlace = (place) => {
    this.setState({
      currentPlace: place
    })
  }
  getDirections = () => {
    const { map, gMaps } = this.props
    this.setState({
      directionsService : new gMaps.DirectionsService
    }, () => {
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

      this.handleClick('X-X')
    })
    
  }
  calculateAndDisplayRoute = (directionsDisplay, directionsService, markerArray, stepDisplay, map) => {
    const { userLocation, gMaps, user, addToHistory } = this.props

    addToHistory({place: JSON.stringify(this.state.currentPlace), username: user.username})
    const userLoc = new gMaps.LatLng(
      userLocation.lat, 
      userLocation.lng
    )
    const { geometry } = this.state.currentPlace
    const placeLat = typeof geometry.location.lat === "number" ? geometry.location.lat : geometry.location.lat()
    const placeLng = typeof geometry.location.lng === "number" ? geometry.location.lng : geometry.location.lng()
    const placeLoc = new gMaps.LatLng(placeLat, placeLng)
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
        animation: gMaps.Animation.DROP
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
    this.props.doneLoading()
  }
  render() {
    const { isOpen, random, history, settings, currentPlace } = this.state;
    const { map, gMaps, user, userLocation, userSettings, updateUserSettings, addToHistory, userHistory, signout } = this.props
    return (
      <React.Fragment>
        {/* <div className={`overlay ${ isOpen ? "open": ""}`}></div> */}
        <div className={`menu ${isOpen ? "open" : ""} `}>
          <div className="close-menu btn--ripple wh" onClick={() => this.closeMenu()}>x</div>
          <ul className="options">
            <li className="menu-item btn--ripple" 
                onClick={()=> this.handleClick('random')}>I Don't know what to eat!</li>

            <li className="menu-item btn--ripple"
                onClick={() => this.handleClick('history')}>View History</li>

            <li className="menu-item btn--ripple"
                onClick={() => this.handleClick('settings')}>Settings</li>

            <li className="menu-item btn--ripple" 
                onClick={signout}>Sign Out</li>
          </ul>
          <div className="toggle btn--ripple wh" onClick={() => this.handleClick('main')}></div>
        </div>
        {
          gMaps 
            && 
              <GetRandom 
                _open={random} 
                user={user}
                userLocation={userLocation}
                userSettings={userSettings}
                addToHistory={addToHistory}
                currentPlace={currentPlace}
                changeCurrentPlace={this.changeCurrentPlace}
                getDirections={this.getDirections}
                map={map} 
                gMaps={gMaps} 
                toggle={this.handleClick}
                isLoading={this.props.isLoading}
                doneLoading={this.props.doneLoading}
              />
        }
        {
          userHistory 
            &&
              <History 
                history={userHistory} 
                toggle={this.handleClick} 
                changeCurrentPlace={this.changeCurrentPlace}
                getDirections={this.getDirections}
                _open={history}/>
        }
        {
          userSettings
            &&
              <Settings 
                settings={userSettings}
                updateUserSettings={updateUserSettings} 
                toggle={this.handleClick} 
                _open={settings}/>
        }
      </React.Fragment>
    )
  }
}

export default Menu