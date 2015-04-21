var $ = require('jquery');
        require('slick-carousel'); // loads slick as a jQuery plugin
var TweenMax = require('tween-max');

// requires Modernizr.touch for touch testing

var PromoView = function($el, $overlay) {
  var t = this;

  this.$el = $el;
  this.overlay = {
    $el : $overlay,
    slider : {
      $el : $overlay.find('.promo-overlay-slides'),
      initialized : false,
      visible: false
    }
  }
  this.currentSlide = 0;

  this.setCurrentSlide = function(index) {
    this.currentSlide = parseInt(index);
    return this;
  }

  this.goToCurrentSlide = function() {
    console.log('going to ', t.currentSlide);
    t.overlay.slider.$el.slick('slickGoTo', t.currentSlide, false);
    return this;
  }

  this.createOverlaySlider = function() {
    if(t.overlay.slider.initialized) return;

    this.overlay.slider.$el.on( 'init', function(e, slick){
      // t.centerSlideImages();
    });

    this.overlay.slider.$el.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: !Modernizr.touch,
      dots: false,
      arrows: !Modernizr.touch,
      prevArrow: '<a href="#" class="campaign-slide-nav campaign-slide-nav--prev"><</a>',
      nextArrow: '<a href="#" class="campaign-slide-nav campaign-slide-nav--next">></a>'
    });

    // window.$el = this.overlay.slider.$el;

    t.overlay.slider.initialized = true;
  }

  this.onOverlayShow = function() {
    // TODO - Add in some sort of loading thing to block the slider initializing
    if(!t.overlay.slider.initialized) {
      this.createOverlaySlider();
    }
    else {
      t.goToCurrentSlide();
      t.centerSlideImages();
    }
  }

  this.onOverlayShown = function() {
    this.overlay.slider.visible = true;
    // this.overlay.slider.$el.slick('refresh');
    setTimeout(function(){
      t.goToCurrentSlide();
      t.centerSlideImages();
    }, 10);
  }

  this.onOverlayHidden = function() {
    this.overlay.slider.visible = false;
  }

  this.centerSlideImages = function() {
    var slideHeight = t.overlay.slider.$el.height();
    $('.promo-overlay-slide').each(function(i, slide){
      var img = $(slide).find('img');
      var imgHeight = img.height();
      if(imgHeight < slideHeight) {
        TweenMax.to(img, 0.1, {
          'margin-top' : (slideHeight - imgHeight) / 2
        })
      }
    });
  }

  this.onResize = function() {
    if(this.overlay.slider.visible) this.centerSlideImages();
  }

  var init = function() {
    
    t.$el.on('click', '[data-slide]', function(){
      t.setCurrentSlide(this.getAttribute('data-slide'));
    });

    t.overlay.$el.on('show.overlay', t.onOverlayShow.bind(t));
    t.overlay.$el.on('shown.overlay', t.onOverlayShown.bind(t));

    t.overlay.$el.on('hidden.overlay', t.onOverlayHidden.bind(t));

    $(window).on('resize', t.onResize.bind(t));

    // t.$el.find('.promo-slides').slick({
    //   slidesToShow: 6,
    //   slidesToScroll: 6,
    //   responsive : [
    //     {
    //       breakpoint: 992, 
    //       settings: {
    //         slidesToShow: 4,
    //         slidesToScroll: 4
    //       }
    //     },
    //     {
    //       breakpoint: 768, 
    //       settings: {
    //         slidesToShow: 2,
    //         slidesToScroll: 2 
    //       }
    //     }
    //   ]
    // });

    return t;
  };

  return init();
};

module.exports = PromoView;