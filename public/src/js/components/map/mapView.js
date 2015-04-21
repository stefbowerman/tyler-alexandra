var $ = require('jquery');
var utils = require('../utils.js');
var TweenMax = require('tween-max');
var TimelineLite = require('timeline-lite');

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
  this.mapSectionWrapperEl = document.getElementsByClassName('map-section-wrapper')[0]; // Container for the map and the info
  this.mapSectionContent = this.mapSectionWrapperEl.getElementsByClassName('map-section-content')[0];
  
  this.map = {}; // (google.maps.Map) The actual Map
  this.marker = {}; // (google.maps.Marker) The marker for the location
  this.markerIcon = {}; // The custom image for the location marker
  this.currentCenter = {}; // Store the current center of the map to use on resize and stuff

  // Booleans to keep track of map load progress
  var tilesLoaded = !1;
  var loadScriptOnDomReady = !utils.isMobile(); // Only load the script on dom ready if we're not on a mobile browser 
  var showMapOnScriptLoaded = !loadScriptOnDomReady; // if we load the script on dom ready, don't show the map immediately
  // If we load the script on demand, then show the map immediately

  /**
   * Initialize the section (dom only, not the map)
   * 
   * @return {self}
   */
  this.init = function(){
    t.addDomListeners();
    if(loadScriptOnDomReady) this.loadMapScript();
    // else, wait until they click the button to show the map
    return this;
  };

  /**
   * Initialize the google map
   * 
   * @return {self}
   */
  this.initMap = function(){
    var latLng = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
    var mapOptions = {
      zoom : 17,
      center : latLng
    };

    this.map = new google.maps.Map(t.el, mapOptions);
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

    return this;

  };

  /**
   * Loads the google maps API, calls a callback on load
   */
  this.loadMapScript = function(){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
        '&signed_in=false&callback=' + this.namespaceMapLocation + '.onScriptLoaded';
    document.body.appendChild(script);
  };

  /**
   * Checks if the google maps API is loaded
   * 
   * @return {bool}
   */
  this.apiIsReady = function(){
    return window.hasOwnProperty('google') && window.google.hasOwnProperty('maps');
  };

  /**
   * Callback for the gMap API loaded.  Initializes the map and shows it if necessary
   */
  this.onScriptLoaded = function(){
    this.initMap();
    if(showMapOnScriptLoaded) this.showMap();
  };

  /**
   * Adds event listeners to non-map elements
   * 
   * @return {self}
   */
  this.addDomListeners = function(){ // Listeners on non map dom elements
    $(this.viewMapEl).on('click', function(){
      if(this.apiIsReady()) {
        this.showMap();
      }
      else {
        showMapOnScriptLoaded = true;
        this.loadMapScript();
      }
    }.bind(t));

    $(this.dismissMapEl).on('click', t.dismissMap.bind(t));

    return this;
  }

  /**
   * Adds event listeners to map elements
   * - Map listeners can't be attached until the api loads
   *
   * @return {self}
   */
  this.addMapListeners = function(){
    google.maps.event.addListenerOnce(t.map, 'tilesloaded', t.onTilesLoaded.bind(t));
    google.maps.event.addListener(t.map, 'drag', t.onMapDrag.bind(t));
    window.onresize = function(){
      // Basic throttle
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(t.onMapResize.bind(t), resizeTimerThrottleDelay);
    };
    return this;
  };

  /**
   * Drops the marker onto the map
   */
  this.dropMarker = function(){
    tO(function(){
      t.marker.animation = google.maps.Animation.DROP; // Animation resets once we remove the marker, so set it again
      t.marker.setMap(t.map);
    });
  };

  /**
   * Removes the marker from the map
   * 
   * @return {self}
   */
  this.removeMarker = function(){
    tO(function(){
      t.marker.setMap(null);
    });
  };

  /**
   * Returns whether the marker is currently on the map (true) or it has been removed (false)
   * 
   * @return {bool}
   */
  this.markerIsOnMap = function(){
    return !!this.marker.map;
  }

  /**
   * Callback for when the map has all it's tiles loaded.  We only want to drop the marker once the map is loaded
   * 
   */
  this.onTilesLoaded = function(){
    tilesLoaded = true;
    if( !t.markerIsOnMap() ){
      t.dropMarker();
    }
  };

  /**
   * Callback for when the map is dragged.  Update this var to store for use later
   */
  this.onMapDrag = function(){
    this.currentCenter = this.map.getCenter();
  };

  /**
   * Callback for when the map is resized.  Keep the map centered even on resize
   */
  this.onMapResize = function(){
    this.map.panTo(this.currentCenter);
  };

  /**
   * Callback for when the map is shown.
   * - Drop the marker if the tiles are loaded
   * - If we don't, the marker will be dropped later (see this.onTilesLoaded)
   */
  this.onMapShow = function(){
    if(tilesLoaded) this.dropMarker();
  };

  /**
   * Callback for when the map is dismissed.
   * - Remove the marker so we can drop it again next time we reveal the map
   */
  this.onMapDismiss = function(){
    this.removeMarker();
  };

  /**
   * Reveal the map
   */
  this.showMap = function(){
    $(this.mapSectionWrapperEl).addClass('show-map');
    this.onMapShow();
  };

  /**
   * Hide the map
   */
  this.dismissMap = function(){
    $(this.mapSectionWrapperEl).removeClass('show-map');
    this.onMapDismiss();
  };

  /* Helper Functions */

  /**
   * Call setTimeout with a default time of 1000ms
   */
  function tO(func, ms) {
    setTimeout(func, ms || 1000);
  }

  return this;
}

module.exports = TylerMap;