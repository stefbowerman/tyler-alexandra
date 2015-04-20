TylerAlexandra = window.TylerAlexandra || {};

// Exposes TweenLite, TweenMax, TweenPlugin, TimelineLite, & TimelineMax
//require('./modules/gsap');

(function(Modernizr){

  // Required Components
  var Utils = require('./components/utils.js');
  var CampaignViewer = require('./components/campaign/campaignViewer.js');
  var TylerMap = require('./components/tylermap.js');

  // Add Components to tyler namespace
  TylerAlexandra.Utils = new Utils();
  TylerAlexandra.Overlay = require('./components/overlay.js');

  // Initialize components as needed
  if(document.getElementById('map-canvas')){
    TylerAlexandra.MapSection = new TylerMap('TylerAlexandra.MapSection').init();
  }
  if(document.getElementsByClassName('campaign-views').length){

    TylerAlexandra.CampaignViewer = new CampaignViewer(document.getElementsByClassName('campaign-views')[0]).init();
  }

  // Handle Overlay Launching
  document.addEventListener('click', function(e){
    if(e.target.getAttribute('data-overlay')){
      var target = document.getElementById( e.target.getAttribute('data-overlay') ); // Make this more extensible
      var overlay = new TylerAlexandra.Overlay( target );
      e.preventDefault();
      return false;
    }
  });

})(Modernizr);