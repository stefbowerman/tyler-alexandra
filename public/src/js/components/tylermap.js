var Utils = require('./utils.js');
var utils = new Utils();

var TylerMap = function(namespaceMapLocation){ // add 'loadScriptOnDomReady' to the passed in args
        
  var t = this;

  // Where is Tyler Alexandra?
  var coordinates = {
    latitude  : 40.7408855,
    longitude : -73.9942641
  };

  // Window resize throttle variables
  var resizeTimer;
  var resizeTimerThrottleDelay;

  this.namespaceMapLocation = namespaceMapLocation; // Google maps API requires a global function to reference as a callback
  this.el = document.getElementById('map-canvas'); // Where are we placing the map
  this.viewMapEl = document.getElementById('view-map'); // Link to click to view the map
  this.dismissMapEl = document.getElementById('map-dismiss'); // Link to click to dismiss the map
  this.mapSectionWrapperEl = document.querySelectorAll('.map-section-wrapper')[0]; // Container for the map and the info
  this.map = {}; // (google.maps.Map) The actual Map
  this.marker = {}; // (google.maps.Marker) The marker for the location
  this.markerIcon = {}; // The custom image for the location marker
  this.currentCenter = {}; // Store the current center of the map to use on resize and stuff

  // Booleans to keep track of map load progress
  var tilesLoaded = !1;
  var loadScriptOnDomReady = !utils.isMobile(); // Only load the script on dom ready if we're not on a mobile browser 
  var showMapOnScriptLoaded = !loadScriptOnDomReady; // if we load the script on dom ready, don't show the map immediately
  // If we load the script on demand, then show the map immediately

  this.init = function(){
    t.addDomListeners();
    if(loadScriptOnDomReady) this.loadMapScript();
    // else, wait until they click the button to show the map
    return this;
  };
  this.initMap = function(){
    var latLng = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
    var mapOptions = {
      zoom : 17,
      center : latLng
    };

    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    this.currentCenter = this.map.getCenter();

    this.markerIcon = {
      url : '/img/tyler-map-marker.png',
      size : new google.maps.Size(72, 110),
      origin : new google.maps.Point(0, 0),
      anchor : new google.maps.Point(12, 36),
      scaledSize : new google.maps.Size(24, 36)
    };

    this.marker = new google.maps.Marker({
        position : latLng,
        animation : google.maps.Animation.DROP,
        title : "Tyler Alexandra",
        icon : this.markerIcon
    });

    this.addMapListeners();

  };
  this.loadMapScript = function(){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
        '&signed_in=false&callback=' + this.namespaceMapLocation + '.onScriptLoaded';
    document.body.appendChild(script);
  };
  this.apiIsReady = function(){
    return window.google && window.google.maps;
  };
  this.onScriptLoaded = function(){
    this.initMap();
    if(showMapOnScriptLoaded) this.showMap();
  };
  this.addDomListeners = function(){ // Listeners on non map dom elements
    this.viewMapEl.addEventListener('click', function(){
      if( t.apiIsReady() ){
        t.showMap();
      }
      else {
        showMapOnScriptLoaded = true;
        t.loadMapScript();
      }
    });

    this.dismissMapEl.addEventListener('click', function(){
      t.mapSectionWrapperEl.classList.remove('show-map');
      t.clearPin();
    });
  }
  this.addMapListeners = function(){ // Listeners that must be added to the map, can't be added until api loads and runs
    google.maps.event.addListenerOnce(t.map, 'tilesloaded', t.onTilesLoaded.bind(t));
    google.maps.event.addListener(t.map, 'drag', t.onMapDrag.bind(t));
    window.onresize = function(){
      // Basic throttle
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(t.onMapResize.bind(t), resizeTimerThrottleDelay);
    };
  };
  this.dropPin = function(){
    tO(function(){
      t.marker.animation = google.maps.Animation.DROP; // Animation resets once we remove the marker, so set it again
      t.marker.setMap(t.map);
    });
  };
  this.clearPin = function(){
    tO(function(){
      t.marker.setMap(null);
    });
  };
  // Returns true if the pin is currently on the map
  // False if the pin has been removed
  this.pinIsOnMap = function(){
    return !!this.marker.map;
  }
  this.onTilesLoaded = function(){
    tilesLoaded = true;
    if( !t.pinIsOnMap() ){ // If there is no map set on the marker, drop the pin
      t.dropPin();
    }
  };
  this.onMapDrag = function(){
    this.currentCenter = this.map.getCenter();
  };
  this.onMapResize = function(){
    this.map.panTo(this.currentCenter);
  };
  this.onMapShow = function(){
    if(tilesLoaded) this.dropPin();
    // else, wait for onTilesLoaded which will set 'tilesLoaded' to true and will drop the pin for us
  };
  this.onMapDismiss = function(){
    this.clearPin();
  };
  this.showMap = function(){
    this.mapSectionWrapperEl.classList.add('show-map');
    t.onMapShow();
  };
  this.dismissMap = function(){
    this.mapSectionWrapperEl.classList.remove('show-map');
    t.onMapDismiss();
  };

  /* Helper Functions */

  // Timeout wrapper
  function tO(func, ms) {
    setTimeout(func, ms || 1000);
  }

  return t;
}

module.exports = TylerMap;