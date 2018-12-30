import React, { Component } from 'react'

import GetRandom from './GetRandom'
// import gimme a choice .... need to change this name tho
// should i still inlcude setting date and time??
// import history
// import settings

class Menu extends Component {
  state={
    isOpen: false,
    random: false,
  }
  handleClick = (context) => {
    switch (context) {
      case 'main':
        this.setState({isOpen: !this.state.isOpen}, () => {
          if(!this.state.isOpen) {
            this.closeMenu()
          }
        })
        break;
      case 'random':
        this.setState({random: !this.state.random, isOpen: false})
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
    })
  }
  componentDidMount(){
    this.props.doneLoading()
  }
  render() {
    const { isOpen, random } = this.state;
    const { map, gMaps, user, userLocation, signout } = this.props
    return (
      <React.Fragment>
        {/* <div className={`overlay ${ isOpen ? "open": ""}`}></div> */}
        <div className={`menu ${isOpen ? "open" : ""} `}>
          <div className="close-menu btn--ripple wh" onClick={() => this.closeMenu()}>x</div>
          <ul className="options">
            <li className="menu-item btn--ripple" onClick={()=> this.handleClick('random')}>Gimme a choice</li>
            <li className="menu-item btn--ripple">View History</li>
            <li className="menu-item btn--ripple">Settings</li>
            <li className="menu-item btn--ripple" onClick={signout}>Sign Out</li>
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
                map={map} 
                gMaps={gMaps} 
                toggle={this.handleClick}
                isLoading={this.props.isLoading}
                doneLoading={this.props.doneLoading}
              />
        }
      </React.Fragment>
    )
  }
}

export default Menu