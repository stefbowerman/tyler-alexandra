var TweenMax = require('tween-max');

/**
 * View for a single campaign slice
 *
 * @constructor
 * @param {DOM node} el -
 *  <div class="campaign-view-item" style="background-image:url(...);"></div>
 *   
 * @returns {self}
 */
CampaignSlice = function(el) {
  this.el = el;

  return this;
};

CampaignSlice.prototype = {

  /**
   * Return the slice to its OG state
   * @returns {self}
   */
  resetSlice : function() {
    TweenMax.killTweensOf(this.el);
    TweenMax.to(this.el, 0.5, {
      alpha: 1,
      // filter: 'grayscale(0%)',
      // '-webkit-filter' : 'grayscale(0%)'
    });
    return this;
  },

  /**
   * Adjust the slice width
   * @param {number} w - width in px
   * @returns {self}
   */
  updateWidth : function(w) {
    TweenMax.to(this.el, 0.35, {
      width : w + "px",
      ease : Quad.easeOut,
      onComplete: this.updateWidthComplete.bind(this),
      lazy : !1
    });
    return this;
  },

  updateWidthComplete : function() {},

  /**
   * Transition to hover over state
   * @returns {self}
   */
  overSlice : function() {
    // if(this.open)
    //   return;
    TweenMax.to(this.el, 0.5, {
      alpha: 1,
      // filter: 'grayscale(0%)',
      // '-webkit-filter' : 'grayscale(0%)',
      onComplete: this.openSlice.bind(this)
    });
    return this;
  },

  /**
   * Transition to state while another slice is hovered over
   * @returns {self}
   */
  outSlice : function() {
    // if(this.open)
    //   return;
    TweenMax.to(this.el, 0.5, {
      alpha: 0.3,
      // filter: 'grayscale(100%)',
      // '-webkit-filter' : 'grayscale(100%)'
    });
    return this;
  },

  openSlice : function() {
    // console.log('slice opened');
  }

}

module.exports = CampaignSlice;