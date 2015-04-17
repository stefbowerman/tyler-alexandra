var CampaignSliceTouch = require('./campaignSliceTouch.js');

var CampaignViewTouch = function(el) {

  var t = this;

  this.el = el;
  this.slices = [];
  this.season = this.el.getAttribute('data-season');

  this.onResize = function() {
    var h;

    this.slices.forEach(function(slice){
      h = h || (slice.el.offsetWidth * slice.aspectRatio);
      slice.setHeight(h)
    });

  };

  this.focus = function() {
    this.el.setAttribute('tabindex', 1);
  }

  this.hide = function() {
    this.el.style.display = "none";
    this.el.removeAttribute('tabindex');
  }

  this.init = function() {
    var sliceContainers = document.querySelectorAll('.campaign-view-item');
    
    for (var a = 0; a < sliceContainers.length; a++) {
      var sliceEl = sliceContainers[a];
      var slice = t.slices.push( new CampaignSliceTouch(sliceEl) );
    }

    window.addEventListener('resize', t.onResize.bind(t));

    this.onResize(); // trigger resize

  };
}

module.exports = CampaignViewTouch;