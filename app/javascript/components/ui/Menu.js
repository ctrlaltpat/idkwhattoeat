import React, { Component } from 'react'

import GetRandom from './GetRandom'
import History from './History'
import Settings from './Settings'

class Menu extends Component {
  state={
    isOpen: false,
    random: false,
    history: false,
    settings: false,
    userFoundIt: false
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
  componentDidMount(){
    this.props.doneLoading()
  }
  render() {
    const { isOpen, random, history, settings } = this.state;
    const { map, gMaps, user, userLocation, userSettings, addToHistory, userHistory, signout } = this.props
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
                _open={history}/>
        }
        {
          userSettings
            &&
              <Settings 
                settings={userSettings} 
                toggle={this.handleClick} 
                _open={settings}/>
        }
      </React.Fragment>
    )
  }
}

export default Menu