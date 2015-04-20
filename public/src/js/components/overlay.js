/* ========================================================================
 * Site overlay content.
 * Handles display, and cleanup
 * ======================================================================== */

var TimelineLite = require('timeline-lite');

var DEFAULTS = {
  show: true
};

/**
 * Overlay Constructor
 * 
 * @constructor
 * @param {DOM node} element - The overlay element, containing all the proper markup and classnames
 * @param {bool} show - Boolean flag, whether or not to display the overlay on instantiation
 */
var Overlay = function(element, show) {
  
  show = show || true;
  
  var t = this;

  this.body = document.body;
  this.el = element;
  this.closeButton = this.el.getElementsByCallName('overlay-close')[0];
  this.overlayContentContainer = this.el.getElementsByCallName('overlay-content')[0];

  this.isShown = !1;

  function init(){

    if(show) t.show();

    return t;

  };

  return init();
  
};

Overlay.prototype = {

  /**
   * Toggles the overlay visibility
   *
   * @return {self}
   */
  toggle : function() {
    return this.isShown ? this.hide() : this.show();
  },

  /**
   * Shows the overlay and adds event listeners
   *
   * @return {self}
   */
  show : function() {

    if (this.isShown) return;

    this.isShown = true;

    this.body.classList.add('overlay-open');

    var t = this;

    this.el.addEventListener('click', t.handleClick.bind(t));

    // Timeline for show animations
    var tL = new TimelineLite();

    // Hide the close button offscreen
    tL.set(this.closeButton, {
      x: "100%",
    });

    // Make the modal content transparent and translate it up to give it a nice little drop in
    tL.set(this.overlayContentContainer, {
      opacity : 0,
      y : "-20px",
    });

    // Start the timeline, animate the overlay opacity to 1
    tL.to(this.el, 0.5, {
      opacity : 1,
      ease : Power3.easeOut
    });

    // Then animate the content in, opacity to 1 100ms before the previous animation ends
    tL.to(this.overlayContentContainer, 0.5, {
      opacity : 1,
      y : "0px",
      ease : Power3.easeOut
    }, "-=0.1");

    // Then animate the close button onto the screen, 100ms after the overlay content finishes animating
    tL.to(this.closeButton, 0.5, {
      // opacity : 1,
      x : "0%",
      ease : Power3.easeOut
    }, "-=0.4");

    this.el.style.display = "block";

    return this;
  },

  /**
   * Hides the overlay and removes event listeners
   *
   * @return {self}
   */
  hide : function() {
    if (!this.isShown) return;

    this.isShown = false;

    this.body.classList.remove('overlay-open');

    var t = this;

    this.closeButton.removeEventListener('click', t.hide.bind(t));
    
    // Show timeline
    var tL = new TimelineLite({
      onComplete: function(){
        this.el.style.display = 'none';
      }.bind(this) // this overlay
    });

    // Animate the close button off screen
    tL.to(this.closeButton, 0.3, {
      // opacity : 0,
      x : "100%",
      ease : Power3.easeIn
    });    

    // Animate the content up and to 0 opacity in 500ms, 200ms before the closebutton finishes animating
    tL.to(this.overlayContentContainer, 0.5, {
      opacity : 0,
      y : "-20px",
      ease : Power3.easeIn
    }, "-=0.2");

    // Animate the overlay to 0 opacity, 200ms before the content finishes animating
    tL.to(this.el, 0.5, {
      opacity : 0,
      ease : Power3.easeIn
    }, "-=0.2");

    return this;

  },

  /**
   * Handles click events on the overlay
   *
   * @param {MouseEvent} e
   */
  handleClick : function(e) {
    var target = e.target;
    if(target == this.closeButton) { // Handle click on the close button
      this.hide();
    }
  }

};

module.exports = Overlay;