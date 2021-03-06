import React from 'react'
import API from './api/RailsAPI'

import SignIn from './components/auth/SignIn'
import Menu from './components/ui/Menu'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { load_google_maps, styles } from './api/GoogleMaps'
import Loading from './components/ui/Loading';

class App extends React.Component {
  state={
    user: null,
    userLocation: {
      lat: 43.6570321,
      lng: -79.6010311
    },
    userSettings: {
      cuisine: '',
      radius: 500
    },
    userHistory: [],
    map: null,
    googleMaps: null,
    loading: true
  }
  signIn = user => {
    localStorage.setItem('token', user.token)
    this.isLoading()
    this.setState({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.firstname ? `${user.firstname} ${user.lastname}` : "",
        email: user.email
      },
      userSettings: {
        cuisine: user.cuisine,
        radius: user.radius
      },
      userHistory: user.history ? user.history.map(h=>JSON.parse(h.placeObj)) : []
    }, () => this.loadMap())
  }
  signOut = () => {
    localStorage.removeItem('token')
    this.setState({ user: null })
    const mapScript = document.getElementById("mapscript")
    if (mapScript) window.location.reload() // clear everything to make sure maps api doesn't stack
  }
  getUserLocation = () => {
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.setState({
              userLocation: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            })
            resolve()
          },
          error => {
            console.log(error)
            reject()
          }
        )
      })
    } else {
      this.setState({
          userLocation: {
            lat: 51.513870,
            lng: -0.098362
          }
      })
      return Promise.resolve()
    }
  }
  updateUserSettings = ({cuisine, radius}) => {
    API.updateSettings({
      cuisine, 
      radius,
      username: this.state.user.username
    }).then((settings) => this.setState({
      userSettings: settings
    }, () => this.notify("Settings Updated!")))
  }
  addToHistory = ({place, username}) => {
    API.addToHistory({place, username})
      .then(data => this.setState({
        userHistory: [JSON.parse(data.place.placeObj),...this.state.userHistory]
      }))
  }
  loadMap = () => {
    let googleMaps
    let map
    load_google_maps().then(res => {
      googleMaps = res.maps
      map = new googleMaps.Map(document.getElementById('map'), {
        center: {
          lat: 43.6570321,
          lng: -79.6010311
        },
        zoom: 15,
        scaleControl: false,
        mapTypeControl: false,
        zoomControl: true,
        streetViewControl: false,
        zoomControlOptions: {
            position: googleMaps.ControlPosition.LEFT_BOTTOM
        },
        fullscreenControl: false,
        styles: styles
      })
    }).then(() => {
      this.getUserLocation().then(() =>{
        map.setCenter({
          lat: this.state.userLocation.lat, 
          lng: this.state.userLocation.lng
        })
        this.setState({
          map: map,
          googleMaps: googleMaps
        }, () => this.doneLoading())
      })
    })
  }
  isLoading = () => this.setState({loading: true})
  doneLoading = () => this.setState({loading: false})
  notify = (text) => toast(text,{
    className: 'notify-text',
    bodyClassName: 'notify-text'
  });
  componentDidMount(){
    API.validate()
      .then(data => {
        if (data.error) {
          this.signOut()
        } else {
          this.signIn(data)
          this.notify("Welcome back! :)")
        }
      })
  }
  render () {
    const { user, userLocation, userSettings, userHistory, map, googleMaps, loading } = this.state

    return (
      <div className={`App ${user ? "userSignedIn" : '' }`}>
        { user ? (
          <React.Fragment>
            <div id="map"></div>
            <Menu 
              map={map}
              user={user}
              userLocation={userLocation}
              userSettings={userSettings}
              updateUserSettings={this.updateUserSettings}
              userHistory={userHistory}
              addToHistory={this.addToHistory}
              gMaps={googleMaps}
              isLoading={this.isLoading}
              doneLoading={this.doneLoading}
              signout={this.signOut}
            />
          </React.Fragment>
        ) : (
          <SignIn 
            signin={this.signIn}
            isLoading={this.isLoading}
            doneLoading={this.doneLoading}
            notify={this.notify}
          />
        )}
        <Loading show={loading}/>
        <ToastContainer />
      </div>
    )
  }
}

export default App