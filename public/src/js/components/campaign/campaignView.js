var TweenMax = require('tween-max');
var CampaignSlice = require('./campaignSlice.js');

// Requires Modernizr (Modernizr.csstransforms)

/**
 * View for a single campaign.  
 * Contains methods for adjusting slice widths and navigating the slideshow
 *
 * @constructor
 * @param {DOM node} el - The container element.  Has class 'campaign-view' and a data attribute 'season'

    <div class="campaign-view" data-season="FW15SS15">
      <div class="campaign-view-items">
        <div class="campaign-view-item" style="background-image:url(...);"></div>

 */
var CampaignView = function(el) {
  var t = this;

  var numSlicesToDisplay = 4;
  var sliceOverWidthPercent = 0.52; // 52% of the screen, 100% - 52% = 48% left for the other 3 slices = 16% width each
  var sliceOverWidthPercentLeft = 1 - sliceOverWidthPercent;

  this.el = el;
  this.wrapperEl = this.el.querySelector('.campaign-view-items');
  this.season = this.el.getAttribute('data-season');
  this.slices = [];

  // Sliderstuff
  var currentSlice = 0; // currentSlice is the index of the slice that is on the left side of the screen,
  var transformsSupported = Modernizr.csstransforms; // Use css transforms to translate the slider if supported, otherwise use left margin
  var isTransitioning = !1; // Lock UI while transitioning

  this.slider = {
    buttonNext : document.createElement('div'),
    buttonPrev : document.createElement('div')
  }

  var getOffScreenPositionProps = function() {
    var left = - (window.innerWidth / numSlicesToDisplay) * currentSlice;
    return transformsSupported ? { x : left } : { 'margin-left' : left }
  }

  var setUpSliderNavigation = function() {
    t.slider.buttonPrev.innerHTML = "⇽";
    t.slider.buttonPrev.className = "campaign-slide-nav campaign-slide-nav--prev";
    t.slider.buttonPrev.setAttribute('title', 'Previous Slide');
    t.slider.buttonPrev.addEventListener('mouseenter', t.resetSlices.bind(t));
    t.slider.buttonPrev.addEventListener('click', t.prev.bind(t));

    t.slider.buttonNext.innerHTML = "⇾";
    t.slider.buttonNext.className = "campaign-slide-nav campaign-slide-nav--next";
    t.slider.buttonNext.setAttribute('title', 'Next Slide');
    t.slider.buttonNext.addEventListener('mouseenter', t.resetSlices.bind(t));
    t.slider.buttonNext.addEventListener('click', t.next.bind(t));
    
    if(t.slices.length > numSlicesToDisplay){ // If there are more slices than displayed on the screen, add the nav to the UI
      t.el.appendChild(t.slider.buttonPrev);
      t.el.appendChild(t.slider.buttonNext);
      t.doSliderNavDisabledUpdate() // Make sure the nav buttons have the correct disabled attributes
      t.el.setAttribute('tabindex', 1); // So that we can bind to it
      t.el.addEventListener('keydown', t.keydown.bind(t));
    }

  }
  
  /**
   * Go to the next slide in the slideshow
   *
   * Method returns if there are no more slices further offscreen (currentSlice will never equal numSlicesToDisplay)
   * i.e. If we're on the 2nd of 5 slices where 4 are visible at a time, 1 == (5 - 4) ~ can't go any further
   */
  this.next = function() {
    if(currentSlice == this.slices.length - numSlicesToDisplay || isTransitioning) return;
    currentSlice++;
    this.adjustOffScreenPosition();
    this.doSliderNavDisabledUpdate();
  }

  /**
   * Go to the previous slide in the slideshow
   *
   * Method returns if we have hit the beginning of the slide show
   */
  this.prev = function() {
    if(currentSlice == 0 || isTransitioning) return;
    currentSlice--;
    this.adjustOffScreenPosition();
    this.doSliderNavDisabledUpdate();
  }


  /**
   * Add / remove 'disabled' attributes on the slider UI if necessary
   */
  this.doSliderNavDisabledUpdate = function() {
    if(currentSlice == 0 && !this.slider.buttonPrev.getAttribute('disabled')) {
      this.slider.buttonPrev.setAttribute('disabled', 'disabled');
    }
    else if(currentSlice == this.slices.length - numSlicesToDisplay) {
      this.slider.buttonNext.setAttribute('disabled', 'disabled');
    }
    else {
      this.slider.buttonPrev.removeAttribute('disabled');
      this.slider.buttonNext.removeAttribute('disabled');
    }
  }

  /**
   * Window resize call back
   */
  this.sliderOnResize = function() {
    this.adjustOffScreenPosition();
  }

  /**
   * Ensure the first visible slide is always pinned to the left of the screen
   */
  this.adjustOffScreenPosition = function() {
    isTransitioning = true;
    transitionProps = getOffScreenPositionProps();
    transitionProps.onComplete = function(){
      isTransitioning = false;
    }

    TweenMax.to(this.wrapperEl, 0.5, transitionProps);
  }

  /**
   * Returns the array of CampaignSlices that are currently visible on screen
   * @returns {Array}
   */
  this.getVisibleSlices = function() {
    var visibles = [];
    for (var i = currentSlice + numSlicesToDisplay - 1; i >= currentSlice; i--) {
      visibles.push( t.slices[i] );
    };
    return visibles;
  }

  // End SliderStuff

  /**
   * Returns the width of a 'hovered over' slice.  Our magic value (sliceOverWidthPercent) multiplied by screen width
   * @returns {Number} pixels
   */
  this.getSliceOverWidth = function(){
    return sliceOverWidthPercent * window.innerWidth;
  }

  /**
   * Returns the width of a non-hovered slice while another slice is hovered over
   * @returns {Number} pixels
   */
  this.getSliceOverMinusWidth = function(){
    return (sliceOverWidthPercentLeft * window.innerWidth) / (numSlicesToDisplay - 1);
  }

  /**
   * Callback for when a slice is hovered over.  Expands the target slice and minimizes the other visible slices
   * @param {MouseEvent} e
   */
  this.sliceOver = function(e) {
    var target = e.target;
    // this.slices.forEach(function(i){
    this.getVisibleSlices().forEach(function(i){
      if(i.el == target) {
        i.updateWidth(this.getSliceOverWidth());
        i.overSlice();
      }
      else {
        i.updateWidth( this.getSliceOverMinusWidth() );
        i.outSlice();
      }
    }, this); // bind this to CampaignView
  }

  /**
   * Resets all slices back to their original state.
   */
  this.resetSlices = function(){
    this.slices.forEach(function(slice){
      slice.resetSlice();
      slice.updateWidth( window.innerWidth / numSlicesToDisplay );
    }.bind(this));
  }

  /**
   * Focuses the CampaignView to allow keyboard navigation of the slideshow
   * Note - Doesn't work yet
   */
  this.focus = function() {
    this.el.setAttribute('tabindex', 1);
  }

  /**
   * Hides the CampaignView
   * @returns {self}
   */
  this.hide = function() {
    this.el.style.display = "none";
    this.el.removeAttribute('tabindex');
    return this;
  }

  /**
   * Callback for when the window is resized.  
   *
   * - Resizes the view to be the full screen height
   * - Resizes the slice container to match the length of all the slices
   *
   */
  this.resize = function(){
    TweenMax.to(this.el, 0.01, {
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    });
    TweenMax.to(this.wrapperEl, 0.01, {
      width: ((window.innerWidth / numSlicesToDisplay) * this.slices.length) + this.slices.length // give it a little extra width for rounding errors
    });
    // Reset updates the width of the slices
    this.resetSlices();
    this.sliderOnResize(); // Maybe Remove
  }

  /**
   * Callback for when the view is not hovered over anymore and we can return it to it's initial state
   *
   * @param {MouseEvent} e
   */
  this.mouseleave = function(e){
    this.resetSlices();
  }

  /**
   * Handle keydown events while the slideshow has focus, maybe move this to the parent CampaignViewer?
   *
   * @param {KeyboardEvent} e
   */
  this.keydown = function(e) {
    switch(e.keyCode){
      case 37: // left
        t.prev();
        break;
      case 39: // right
        t.next();
        break;
      default:
        // console.log('keycode is unusable');
    }
  }

  /**
   * Initialize the CampaignView by creating CampaignSlices, attaching event handlers and creating slideshow navigation
   *
   * @returns {self}
   */
  this.init = function() {

    var sliceContainers = this.el.getElementsByClassName('campaign-view-item');

    for (var a = 0; a < sliceContainers.length; a++) {
      var sliceEl = sliceContainers[a];
      var slice = new CampaignSlice(sliceEl);
      slice.el.addEventListener('mouseover', t.sliceOver.bind(t));
      t.slices.push(slice);
    }

    setUpSliderNavigation();

    window.addEventListener('resize', t.resize.bind(t));
    t.el.addEventListener('mouseleave', t.mouseleave.bind(t));

    this.resize(); // Trigger resize to ensure the container is big enough for all the slices
    this.resetSlices(); // Call this to fit all the slices inside the container

    return t;
  }

  return t;
}

module.exports = CampaignView;