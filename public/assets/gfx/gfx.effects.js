(function() {

  $.fn.gfxPopIn = function(options) {
    if (options == null) options = {};
    if (options.scale == null) options.scale = '.2';
    $(this).queueNext(function() {
      return $(this).transform({
        '-webkit-transform-origin': '50% 50%',
        '-moz-transform-origin': '50% 50%',
        scale: options.scale
      }).show();
    });
    return $(this).gfx({
      scale: '1',
      opacity: '1'
    }, options);
  };

  $.fn.gfxPopOut = function(options) {
    $(this).queueNext(function() {
      return $(this).transform({
        '-webkit-transform-origin': '50% 50%',
        '-moz-transform-origin': '50% 50%',
        scale: '1',
        opacity: '1'
      });
    });
    $(this).gfx({
      scale: '.2',
      opacity: '0'
    }, options);
    return $(this).queueNext(function() {
      return $(this).hide().transform({
        opacity: '1',
        scale: '1'
      });
    });
  };

  $.fn.gfxFadeIn = function(options) {
    if (options == null) options = {};
    if (options.duration == null) options.duration = 1000;
    $(this).queueNext(function() {
      return $(this).css({
        opacity: '0'
      }).show();
    });
    return $(this).gfx({
      opacity: 1
    }, options);
  };

  $.fn.gfxFadeOut = function(options) {
    if (options == null) options = {};
    $(this).queueNext(function() {
      return $(this).css({
        opacity: 1
      });
    });
    $(this).gfx({
      opacity: 0
    }, options);
    return $(this).queueNext(function() {
      return $(this).hide().css({
        opacity: 1
      });
    });
  };

  $.fn.gfxShake = function(options) {
    var distance;
    if (options == null) options = {};
    if (options.duration == null) options.duration = 100;
    if (options.easing == null) options.easing = 'ease-out';
    distance = options.distance || 20;
    $(this).gfx({
      translateX: "-" + distance + "px"
    }, options);
    $(this).gfx({
      translateX: "" + distance + "px"
    }, options);
    $(this).gfx({
      translateX: "-" + distance + "px"
    }, options);
    $(this).gfx({
      translateX: "" + distance + "px"
    }, options);
    return $(this).queueNext(function() {
      return $(this).transform({
        translateX: 0
      });
    });
  };

  $.fn.gfxBlip = function(options) {
    if (options == null) options = {};
    options.scale || (options.scale = '1.15');
    $(this).gfx({
      scale: options.scale
    }, options);
    return $(this).gfx({
      scale: '1'
    }, options);
  };

  $.fn.gfxExplodeIn = function(options) {
    if (options == null) options = {};
    options.scale || (options.scale = '3');
    $(this).queueNext(function() {
      return $(this).transform({
        scale: options.scale,
        opacity: '0'
      }).show();
    });
    return $(this).gfx({
      scale: '1',
      opacity: '1'
    }, options);
  };

  $.fn.gfxExplodeOut = function(options) {
    if (options == null) options = {};
    options.scale || (options.scale = '3');
    $(this).queueNext(function() {
      return $(this).transform({
        scale: '1',
        opacity: '1'
      });
    });
    $(this).gfx({
      scale: options.scale,
      opacity: '0'
    }, options);
    if (options.reset !== false) {
      $(this).queueNext(function() {
        return $(this).hide().transform({
          scale: '1',
          opacity: '1'
        });
      });
    }
    return this;
  };

  $.fn.gfxFlipIn = function(options) {
    if (options == null) options = {};
    $(this).queueNext(function() {
      return $(this).transform({
        rotateY: '180deg',
        scale: '.8',
        display: 'block'
      });
    });
    return $(this).gfx({
      rotateY: 0,
      scale: 1
    }, options);
  };

  $.fn.gfxFlipOut = function(options) {
    if (options == null) options = {};
    $(this).queueNext(function() {
      return $(this).transform({
        rotateY: 0,
        scale: 1
      });
    });
    $(this).gfx({
      rotateY: '-180deg',
      scale: '.8'
    }, options);
    if (options.reset !== false) {
      $(this).queueNext(function() {
        return $(this).transform({
          scale: 1,
          rotateY: 0,
          display: 'none'
        });
      });
    }
    return this;
  };

  $.fn.gfxRotateOut = function(options) {
    if (options == null) options = {};
    $(this).queueNext(function() {
      return $(this).transform({
        rotateY: 0
      }).fix();
    });
    $(this).gfx({
      rotateY: '-180deg'
    }, options);
    if (options.reset !== false) {
      $(this).queueNext(function() {
        return $(this).transform({
          rotateY: 0,
          display: 'none'
        }).unfix();
      });
    }
    return this;
  };

  $.fn.gfxRotateIn = function(options) {
    var $;
    if (options == null) options = {};
    $(this).queueNext(function() {
      return $(this).transform({
        rotateY: '180deg',
        display: 'block'
      }).fix();
    });
    $(this).gfx({
      rotateY: 0
    }, options);
    $(this).queueNext(function() {
      return $(this).unfix();
    });
    return $ = jQuery;
  };

  $.fn.gfxSlideOut = function(options) {
    var distance, opacity;
    if (options == null) options = {};
    options.direction || (options.direction = 'right');
    distance = options.distance || 100;
    if (options.direction === 'left') distance *= -1;
    distance += "%";
    opacity = options.fade ? 0 : 1;
    $(this).queueNext(function() {
      return $(this).show();
    });
    $(this).gfx({
      translate3d: "" + distance + ",0,0",
      opacity: opacity
    }, options);
    return $(this).queueNext(function() {
      return $(this).transform({
        translate3d: "0,0,0",
        opacity: 1
      }).hide();
    });
  };

  $.fn.gfxSlideIn = function(options) {
    var distance, opacity;
    if (options == null) options = {};
    options.direction || (options.direction = 'right');
    distance = options.distance || 100;
    if (options.direction === 'left') distance *= -1;
    distance += "%";
    opacity = options.fade ? 0 : 1;
    $(this).queueNext(function() {
      return $(this).transform({
        translate3d: "" + distance + ",0,0",
        opacity: opacity
      }).show();
    });
    return $(this).gfx({
      translate3d: "0,0,0",
      opacity: 1
    }, options);
  };

  $.fn.fix = function() {
    return $(this).each(function() {
      var element, parentOffset, styles;
      element = $(this);
      styles = element.offset();
      parentOffset = element.parent().offset();
      styles.left -= parentOffset.left;
      styles.top -= parentOffset.top;
      styles.position = 'absolute';
      return element.css(styles);
    });
  };

  $.fn.unfix = function() {
    return $(this).each(function() {
      var element;
      element = $(this);
      return element.css({
        position: '',
        top: '',
        left: ''
      });
    });
  };

}).call(this);
