const mapsKey = process.env.REACT_APP_MAPS_API_KEY

export function load_google_maps () {
  return new Promise(function(resolve, reject) {
    window.resolveGoogleMapsPromise = function() {
      resolve(window.google);
      delete window.resolveGoogleMapsPromise;
    }
    const script = document.createElement("script");
    const API_KEY = mapsKey;
    script.id = "mapscript"
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=resolveGoogleMapsPromise`;
    script.async = true;
    document.body.appendChild(script);
  });
}

export const styles = [
  {
      "featureType": "all",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "simplified"
          },
          {
              "hue": "#0083ff"
          },
          {
              "invert_lightness": true
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#004e92"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#070c18"
          }
      ]
  },
  {
      "featureType": "transit.line",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "transit.line",
      "elementType": "labels",
      "stylers": [
          {
              "color": "#004e92"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
          {
              "color": "#003b73"
          }
      ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#004e92"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#FFFFFF"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1b2687"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1b2687"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#FFFFFF"
      }
    ]
  },
]