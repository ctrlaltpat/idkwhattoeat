import React from 'react'

const Settings = ({ settings, toggle, _open }) => {
  return (
    <div className={`user_settings ${_open ? "open" : ""}`}>
      cuisine: {settings.cuisine}
      <br/>
      radius: {settings.radius}
    </div>
  )
}

export default Settings
