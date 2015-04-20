/**
 * View for a single campaign slice on a touch screen device.  
 *
 * @constructor
 * @param {DOM node} el -
 *  <div class="campaign-view-item" style="background-image:url(...);"></div>
 *   
 * @returns {self}
 */
var CampaignSliceTouch = function(el) {
  var t = this;

  this.el = el;
  this.aspectRatio = 771 / 736;

  return this;

};

CampaignSliceTouch.prototype = {

  /**
   * Set the height of the view element
   * @returns {self}
   */
  setHeight : function(h) {
    this.el.style.height = h + "px";
    return this;
  },

}

module.exports = CampaignSliceTouch;