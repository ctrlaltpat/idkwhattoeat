import React from 'react'
import PlaceImages from './PlaceImages'

const computeStars = (rating) => {
  const baseSize = 69; 
  let ratingRounded = Math.round(rating * 2) / 2;
  let starsWidth = Math.ceil(ratingRounded * baseSize / 5);
  return starsWidth + 'px';
}

const getClosingTime = (hours) => {
  if (hours && hours.periods.length === 7) {
    let closed = hours.periods[new Date().getDay()].close
    let _M = closed.hours > 13 ? "PM" : "AM"
    let closingTime = _M === "AM" ? 
            `${closed.hours}:${closed.time.slice(2)}` 
            :
            `${closed.hours-12}:${closed.time.slice(2)}`
    
    return (
      `Closes at ${closingTime} ${_M}`
    )
  }
}

const Place = ({place}) => {
  const starStyle = {
    width: `${computeStars(place.rating)}`
  }
  return (
    <div className="place">
      <div className="place-name">
        <a target="_blank" href={place.website}>{place.name}</a>
      </div>
      {/* <div className="rating">{place.rating}</div> */}
      <div className="rating-stars">
        <span style={starStyle}></span>
      </div>
      <div className="place-address">{place.formatted_address}</div>
      <a className="place-number" 
        href={`tel:${place.formatted_phone_number}`}
      > {place.formatted_phone_number}</a>
      <div className="place-images-container">
        <PlaceImages images={place.photos}/>
      </div>
      <div className="closes-at">
        {getClosingTime(place.opening_hours)}
      </div>
    </div>
  )
}

export default Place
