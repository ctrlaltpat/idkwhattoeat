import React from 'react'

const allOptions = ["American", "Asian", "Bagel Shop", "Bakery", "BBQ", "Bistro", "British", "Cafe", "Caribbean", "Chinese", "Coffee Bar", "Comfort Food", "Cuban", "Deli", "Diner", "Eclectic", "European", "Fine Dining", "French", "Gastropub", "German", "Greek", "Ice Cream", "Indian", "Irish", "Island/Hawaiian", "Italian", "Japanese", "Jewish", "Juice Bar", "Latin American", "Mediterranean", "Mexican", "Pizza", "Pub", "Sandwiches", "Seafood", "Southern", "Southwestern", "Spanish", "Steakhouse", "Sushi", "Tapas", "Tavern/Bar", "TexMex", "Thai", "Vietnamese", "Wine Bar"]

const varify = (option) => option.split(" ").join("-").split("/").join("-").toLowerCase()

const distances = [200, 500, 1000, 1500, 2000]

class Settings extends React.Component {
  state = this.props.settings
  handleChange = event => {
    this.setState({ 
      [event.target.name]: event.target.value 
    })
  }
  render(){
    const { settings, updateUserSettings, toggle, _open } = this.props
    return (
      <div className={`user_settings ${_open ? "open" : ""}`}>
        <div className="input_holder">
          <label htmlFor="cuisine">Cuisine:</label>
          <select name="cuisine" id="cuisine" value={settings.cuisine} onChange={this.handleChange}>
            {settings.cuisine !== "" ? 
              <option value={settings.cuisine}>{allOptions.find(c=>varify(c)===settings.cuisine)}</option>
              : 
              <option value="">--Any--</option>
            }
            {settings.cuisine !== "" && <option value="">--Any--</option>}
            {allOptions.filter(o=>varify(o)!==settings.cuisine).map((c,i)=><option key={i} value={varify(c)}>{c}</option>)}
          </select>
        </div>
        <div className="input_holder">
          <label htmlFor="radius">Search Area:</label>
          <select name="radius" id="radius" value={settings.radius} onChange={this.handleChange}>
            {<option value={settings.radius}>{`${settings.radius}m`}</option>}
            {
              distances.filter(d=>d!==settings.radius).map((r,i)=><option key={i} value={r}>{`${r}m`}</option>)
            }
          </select>
        </div>
        <button
          className="_btn btn--ripple wh"
          onClick={() => updateUserSettings(this.state)}
        >
          Save Settings
        </button>
        <div className="close-menu btn--ripple wh" onClick={() => toggle('settings')}>x</div>
      </div>
    )
  }
}

export default Settings
