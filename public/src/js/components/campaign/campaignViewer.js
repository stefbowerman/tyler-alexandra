var CampaignView = require('./campaignView.js');
var CampaignViewTouch = require('./campaignViewTouch.js');

var TweenMax = require('tween-max');
var TimelineLite = require('timeline-lite');

// requires Modernizr.touch for touch testing
var CampaignViewer = function(){
  var t = this;

  this.el = document.querySelectorAll('.campaign-views')[0];
  this.seasonOptions = document.querySelectorAll('.campaign-season-options')[0];
  this.campaigns = [];
  this.currentCampaign; // Initialize this to the first displayed campaign

  this.onSeasonOptionClick = function(e) {
    var target = e.target;
    if(target.classList.contains('campaign-season-option')) {
      if(target.classList.contains('current')) {
        return;
      }
      else {
        this.seasonOptions.querySelectorAll('.current')[0].classList.remove('current');
        var midCallback = function(){
          target.classList.add('current');
        };
        this.switchToCampaign( target.getAttribute('data-season'), midCallback );
      }
    }
  }

  this.switchToCampaign = function(key, midCallback, endCallback) {
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

  this.getCampaignByKey = function(key) {
    var foundCampaign;
    this.campaigns.forEach(function(c){
      if(c.season == key) foundCampaign = c;
    });
    return foundCampaign;
  }

  this.init = function() {

    var campaignViews = document.querySelectorAll('.campaign-view');

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