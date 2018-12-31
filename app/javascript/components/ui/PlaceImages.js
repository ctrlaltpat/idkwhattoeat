import React from "react";
import Slider from "react-slick";

class PlaceImages extends React.Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    const images = this.props.images && this.props.images.map((img, idx) => 
      <div className="place-image" key={`${idx}${img.height}${img.width}`}>
        <img className="img_cover" src={`${img.getUrl()}`} alt={`image-${idx}`}/>
      </div>
    )
    return (
      <Slider {...settings}>
        { images.length && images.length >= 7 ? images.slice(0,7) : images }
      </Slider>
    );
  }
}

export default PlaceImages