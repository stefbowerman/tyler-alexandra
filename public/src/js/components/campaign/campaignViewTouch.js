var CampaignSliceTouch = require('./campaignSliceTouch.js');

/**
 * View for a single campaign on a touch screen device.  
 * Contains methods for adjusting slice sizes and displaying / showing the view
 *
 * @constructor
 * @param {DOM node} el - The container element.  Has class 'campaign-view' and a data attribute 'season'

    <div class="campaign-view" data-season="FW15SS15">
      <div class="campaign-view-items">
        <div class="campaign-view-item" style="background-image:url(...);"></div>

 */
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

    return this;

  };

  /**
   * Focuses the CampaignView to allow keyboard navigation of the slideshow
   * Note - Doesn't work yet
   * @returns {self}
   */
  this.focus = function() {
    this.el.setAttribute('tabindex', 1);
    return this;
  }

  /**
   * Hides the CampaignViewTouch
   * @returns {self}
   */
  this.hide = function() {
    this.el.style.display = "none";
    this.el.removeAttribute('tabindex');
    return this;
  }

  /**
   * Initialize the CampaignViewTouch by creating CampaignSliceTouch-es, attaching event handlers
   *
   * @returns {self}
   */
  this.init = function() {
    var sliceContainers = document.querySelectorAll('.campaign-view-item');
    
    for (var a = 0; a < sliceContainers.length; a++) {
      var sliceEl = sliceContainers[a];
      var slice = t.slices.push( new CampaignSliceTouch(sliceEl) );
    }

    window.addEventListener('resize', t.onResize.bind(t));

    this.onResize(); // trigger resize

    return this;

  };
}

module.exports = CampaignViewTouch;