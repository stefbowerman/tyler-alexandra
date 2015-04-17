var TweenMax = require('tween-max');

CampaignSlice = function(el) {
  this.el = el;

  return this;
};

CampaignSlice.prototype = {

  resetSlice : function() {
    TweenMax.killTweensOf(this.el);
    TweenMax.to(this.el, 0.5, {
      alpha: 1,
      // filter: 'grayscale(0%)',
      // '-webkit-filter' : 'grayscale(0%)'
    });
  },

  updateWidth : function(px) {
    TweenMax.to(this.el, 0.35, {
      width : px + "px",
      ease : Quad.easeOut,
      onComplete: this.updateWidthComplete.bind(this),
      lazy : !1
    });
    return this;
  },

  updateWidthComplete : function() {

  },

  overSlice : function() {
    // if(this.open)
    //   return;
    TweenMax.to(this.el, 0.5, {
      alpha: 1,
      // filter: 'grayscale(0%)',
      // '-webkit-filter' : 'grayscale(0%)',
      onComplete: this.openSlice.bind(this)
    });
  },

  outSlice : function() {
    // if(this.open)
    //   return;
    TweenMax.to(this.el, 0.5, {
      alpha: 0.3,
      // filter: 'grayscale(100%)',
      // '-webkit-filter' : 'grayscale(100%)'
    });
  },

  openSlice : function() {
    // console.log('slice opened');
  }

}

module.exports = CampaignSlice;