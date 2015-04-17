utils = function(){
  var t = {};

  this.isTouch = function() {
    return t.isTouch != undefined ? t.isTouch : t.isTouch = ('ontouchstart' in window || 'onmsgesturechange' in window);
  };

  this.isTablet = function(){
    console.log('method not implemented yet');
  };

  this.isIpad = function(){
    console.log('method not implemented yet');
  };

  this.isIphone = function(){
    return navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i);
  };

  this.isMobile = function(){
    return t.isMobile != undefined ? t.isMobile : t.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

};

module.exports = utils;