import React from 'react'
import PlaceImages from './PlaceImages'

const computeStars = (rating) => {
  const baseSize = 69; 
  let ratingRounded = Math.round(rating * 2) / 2;
  let starsWidth = Math.ceil(ratingRounded * baseSize / 5);
  return starsWidth + 'px';
}


const Place = ({place}) => {
  const starStyle = {
    width: `${computeStars(place.rating)}`
  }
  return (
    <div className="place">
      <div className="place-name">{place.name}</div>
      <div className="rating">{place.rating}</div>
      <div className="rating-stars">
        <span style={starStyle}></span>
      </div>
      <div className="place-address">{place.formatted_address}</div>
      <a className="place-number" 
        href={`tel:${place.formatted_phone_number}`}
      > {place.formatted_phone_number}</a>
      <PlaceImages />
    </div>
  )
}

export default Place
