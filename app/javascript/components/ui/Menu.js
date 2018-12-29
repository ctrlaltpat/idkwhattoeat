import React, { Component } from 'react'

// import gimme a choice .... need to change this name tho
// should i still inlcude setting date and time??
// import history
// import settings

class Menu extends Component {
  state={
    isOpen: false,
    create: false,
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
      case 'create':
        this.setState({create: !this.state.create})
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
      create: false,
    })
  }
  render() {
    const { isOpen, create } = this.state;
    return (
      <React.Fragment>
        {/* <div className={`overlay ${ isOpen ? "open": ""}`}></div> */}
        <div className={`menu ${isOpen ? "open" : ""} `}>
          <div className="close-menu" onClick={() => this.closeMenu()}>x</div>
          <ul className="options">
            <li className="menu-item" onClick={()=> this.handleClick('create')}>Gimme a choice</li>
            <li className="menu-item">View History</li>
            <li className="menu-item">Settings</li>
            <li className="menu-item" onClick={this.props.signout}>Sign Out</li>
          </ul>
          <div className="toggle" onClick={() => this.handleClick('main')}></div>
        </div>
      </React.Fragment>
    )
  }
}

export default Menu