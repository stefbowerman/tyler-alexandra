/* ========================================================================
 * Site overlay content.
 * Handles display, and cleanup
 * ======================================================================== */

var $ = require('jquery');
var TimelineLite = require('timeline-lite');

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

  this.$body = $(document.body);
  this.el = element;
  this.$el = $(element);
  this.closeButton = this.$el.find('.overlay-close');
  this.$closeButton = $(this.closeButton);
  this.overlayContentContainer = this.$el.find('.overlay-content');

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
    
    var t = this;
    var e = $.Event('show.overlay', { target: t.$el });

    this.$el.trigger(e);

    if (this.isShown) return;

    this.isShown = true;

    this.$body.addClass('overlay-open');

    this.escape();

    this.$closeButton.on('click', t.hide.bind(t));

    this.enforceFocus();

    // Timeline for show animations
    var tL = new TimelineLite({
      onComplete: function(){
        this.$el.trigger('focus').trigger('shown.overlay')
      }.bind(this) // this overlay
    });

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

    this.$el.show();

    return this;
  },

  /**
   * Hides the overlay and removes event listeners
   *
   * @return {self}
   */
  hide : function() {

    var t = this;
    var e = $.Event('hide.overlay');

    this.$el.trigger(e);

    if (!this.isShown) return;

    this.isShown = false;

    this.$body.removeClass('overlay-open');

    this.escape();

    $(document).off('focusin.bs.modal')

    this.$closeButton.off('click');
    
    // Show timeline
    var tL = new TimelineLite({
      onComplete: function(){
        this.$el.hide();
        this.$el.trigger('hidden.overlay');
      }.bind(this)
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
   * Triggers focus on the overlay allowing us to capture keydown events
   */
  enforceFocus : function() {

    $(document)
      .off('focusin.overlay') // guard against infinite focus loop
      .on('focusin.overlay', $.proxy(function (e) {
        if (this.$el[0] !== e.target && !this.$el.has(e.target).length) {
          this.$el.trigger('focus')
        }
      }, this));
  },

  /**
   * Attaches / Removes keydown handler on the overlay that checks if the esc key has been pressed
   * - Hides the overlay if it is displayed and 'esc' has been pressed
   */
  escape : function() {
    if (this.isShown) {
      this.$el.on('keydown.dismiss.overlay', $.proxy(function (e) {
        e.which == 27 && this.hide() // esc key
      }, this))
    }
    else {
      this.$el.off('keydown.dismiss.overlay');
    }    
  }

};

module.exports = Overlay;