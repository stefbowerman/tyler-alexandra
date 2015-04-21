var TweenMax = require('tween-max');

(function(Modernizr){
  
  var $ = require('jquery');

  // Our Namespace
  TylerAlexandra = window.TylerAlexandra || {};

  // Add Components to our namespace
  TylerAlexandra.Overlay = require('./components/overlay.js');

  // Required Component Constructors
  var CampaignViewer = require('./components/campaign/campaignViewer.js');
  var MapView        = require('./components/map/mapView.js');

  // Initialize components as needed
  
  if( $('#map-canvas').length ){
    TylerAlexandra.MapView = new MapView('TylerAlexandra.MapView').init();
  }

  if( $('.campaign-views').length ){
    TylerAlexandra.CampaignViewer = new CampaignViewer( $('.campaign-views').first() ).init();
  }

  var promoView = require('./components/promo/promoView.js');
  window.pp = new promoView($('#promo-press'), $('#promo-press-slideshow'));
  // window.ps = new promoView($('#promo-spotted'), $('#promo-spotted-slideshow'));

  // Handle Overlay Launching
  $(document).on('click', '[data-overlay]', function(e){
    var target = document.getElementById( $(this).attr('data-overlay') ); // Make this more extensible
    var overlay = new TylerAlexandra.Overlay( target );
    e.preventDefault();
    return false;
  });

})(Modernizr);