(function() {
  var $, defaults;

  $ = jQuery;

  defaults = {
    width: 120,
    height: 120
  };

  $.fn.gfxFlip = function(options) {
    var back, front, opts;
    if (options == null) options = {};
    opts = $.extend({}, defaults, options);
    front = $(this).find('.front');
    back = $(this).find('.back');
    $(this).css({
      'position': 'relative',
      '-webkit-perspective': '600',
      '-moz-perspective': '600',
      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-webkit-transform-origin': '50% 50%',
      '-moz-transform-origin': '50% 50%',
      'width': opts.width,
      'height': opts.height
    });
    front.add(back).css({
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'block',
      '-webkit-backface-visibility': 'hidden',
      '-moz-backface-visibility': 'hidden'
    });
    back.transform({
      rotateY: '-180deg'
    });
    return $(this).bind('flip', function() {
      var flipped;
      $(this).toggleClass('flipped');
      flipped = $(this).hasClass('flipped');
      front.gfx({
        'rotateY': flipped ? '180deg' : '0deg'
      });
      return back.gfx({
        'rotateY': flipped ? '0deg' : '-180deg'
      });
    });
  };

}).call(this);
