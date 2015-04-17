CampaignSliceTouch = function(el) {
  var t = this;

  this.el = el;
  this.aspectRatio = 1.6;

  return this;

};

CampaignSliceTouch.prototype = {

  setHeight : function(height) {
    this.el.style.height = height + "px";
    return this;
  },

}

module.exports = CampaignSliceTouch;