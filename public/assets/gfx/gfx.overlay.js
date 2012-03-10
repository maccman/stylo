(function() {
  var $, close, isOpen, overlayStyles, panelCSS;

  $ = jQuery;

  isOpen = function() {
    return !!$('#gfxOverlay').length;
  };

  close = function() {
    var overlay;
    overlay = $('#gfxOverlay');
    overlay.find('#gfxOverlayPanel').gfx({
      scale: '1.1',
      opacity: 0
    });
    overlay.gfx({
      background: 'rgba(0,0,0,0)'
    });
    return overlay.queueNext(function() {
      return overlay.remove();
    });
  };

  panelCSS = {
    opacity: 0,
    scale: 0.5
  };

  overlayStyles = {
    display: 'block',
    position: 'fixed',
    zIndex: 99,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0)'
  };

  $.gfxOverlay = function(element, options) {
    var overlay, panel;
    if (options == null) options = {};
    if (isOpen()) close();
    element = $(element);
    if (element[0].tagName === 'SCRIPT') {
      element = element.html();
    } else {
      element = element.clone();
    }
    options.css || (options.css = {});
    if (options.width) options.css.width = options.width;
    if (options.height) options.css.height = options.height;
    overlay = $('<div />').attr({
      'id': 'gfxOverlay'
    });
    overlay.css(overlayStyles);
    overlay.click(close);
    overlay.delegate('.close', 'click', close);
    overlay.bind('close', close);
    panel = $('<div />').attr({
      'id': 'gfxOverlayPanel'
    });
    panel.transform($.extend({}, panelCSS, options.css));
    panel.append(element);
    overlay.append(panel);
    $('body').append(overlay);
    overlay.delay().gfx({
      background: 'rgba(0,0,0,0.5)'
    }, {
      duration: options.duration
    });
    return panel.delay().gfx({
      scale: 1,
      opacity: 1
    }, {
      duration: options.duration
    });
  };

}).call(this);
