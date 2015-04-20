var CampaignView = require('./campaignView.js');
var CampaignViewTouch = require('./campaignViewTouch.js');

var TimelineLite = require('timeline-lite');

// requires Modernizr.touch for touch testing

/**
 * View for multiple campaigns.
 *  
 * Parent to CampaignViews which are parents to CampaignViewSlices
 *
 * @constructor
 * @param {DOM node} el - The container element.  Has class 'campaign-views'
 */
var CampaignViewer = function(el){
  var t = this;

  this.el = el;
  this.seasonOptions = document.getElementsByClassName('campaign-season-options')[0];
  this.campaigns = [];
  this.currentCampaign; // Initialize this to the first displayed campaign

  /**
   * Handler for clicking on the different campaign seasons
   * - Changes the selected season option, swaps to the correct campaign view
   * 
   * @param {MouseEvent} e
   * @return {self}
   */
  this.onSeasonOptionClick = function(e) {
    var target = e.target;
    if(target.classList.contains('campaign-season-option')) {
      var currentOpt = this.seasonOptions.getElementsByClassName('current')[0];
      if(target == currentOpt) {
        return;
      }
      else {
        if(currentOpt) currentOpt.classList.remove('current');
        var midCallback = function(){
          target.classList.add('current');
        };
        this.switchToCampaign( target.getAttribute('data-season'), midCallback );
      }
    }
    return this;
  }

  /**
   * Handles transitioning to a different campaign
   * 
   * @param {String} key - the string specifying which campaing we want (acts as an ID)
   * @param {Function} midCallback - Function to call halfway through the campaign swap transition
   * @param {Function} endCallback - Function to call at the end of the campaign swap transition
   * @return {self}
   */
  this.switchToCampaign = function(key, midCallback, endCallback) {
    if (this.currentCampaign == key) return;

    var curr = this.getCampaignByKey(this.currentCampaign);
    var next = this.getCampaignByKey(key);

    var tL = new TimelineLite();

    tL.to(curr.el, 0.5, { 
      opacity : 0,
      onComplete: function() {
        curr.hide();
        next.el.style.opacity = 0;
        next.el.style.display = 'block';
        if(midCallback) midCallback.call();
      }
    });

    tL.to(next.el, 0.5, { 
      opacity : 1,
      onComplete : function() {
        // next.focus();
        t.currentCampaign = key;
        if(endCallback) endCallback.call();
      }
    });

  }

  /**
   * Returns a CampaignView or CampaignViewTouch based on a passed in key
   * 
   * @param {String} key - the string specifying which campaing we want (acts as an ID)
   * @return {CampaignView(Touch)}
   */
  this.getCampaignByKey = function(key) {
    var foundCampaign;
    this.campaigns.forEach(function(c){
      if(c.season == key) foundCampaign = c;
    });
    return foundCampaign;
  }

  /**
   * Initialize the CampaignViewer by creating CampaignViews, attaching event handlers and only showing the first CampaignView
   *
   * @returns {self}
   */
  this.init = function() {

    var campaignViews = document.getElementsByClassName('campaign-view');

    [].forEach.call(campaignViews, function(campaign, i){
      // Create the right type of campaign
      var c = Modernizr.touch ? new CampaignViewTouch(campaign) : new CampaignView(campaign);
      // Init and then add it to the array of campaigns
      c.init();
      this.campaigns.push(c);

      if(i){
        c.hide(); // Hide the campaign unless it's the first one
      } else {
        this.currentCampaign = c.season; // Then initialize the currentCampaign var
      }

    }.bind(this));

    this.seasonOptions.addEventListener('click', t.onSeasonOptionClick.bind(t));

    window.cViewer = this;

    return this;
  }
}

module.exports = CampaignViewer;