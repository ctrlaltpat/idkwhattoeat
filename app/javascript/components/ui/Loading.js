import React from 'react'
const pin = require('../../loading-pin.png')

const Loading = ({show}) => {
  return (
    <div className={`loading ${show ? "show" : ""}`}>
      <img src={pin} alt="Loading..." className="loading-pin"/>
    </div>
  )
}

export default Loading