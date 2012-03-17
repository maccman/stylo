# Additional Effects

$.fn.gfxPopIn = (options = {}) ->
  options.scale ?= '.2'

  $(@).queueNext ->
    $(@).transform(
      '-webkit-transform-origin': '50% 50%'
      '-moz-transform-origin': '50% 50%'
      scale: options.scale
    ).show()

  $(@).gfx({
    scale:   '1'
    opacity: '1'
  }, options)

$.fn.gfxPopOut = (options) ->
  $(@).queueNext ->
    $(@).transform
      '-webkit-transform-origin': '50% 50%'
      '-moz-transform-origin': '50% 50%'
      scale:   '1'
      opacity: '1'

  $(@).gfx({
    scale:   '.2'
    opacity: '0'
  }, options)

  $(@).queueNext ->
    $(@).hide().transform(
      opacity: '1'
      scale:   '1'
    )

$.fn.gfxFadeIn = (options = {}) ->
  options.duration ?= 1000
  $(@).queueNext ->
    $(@).css(opacity: '0').show()
  $(@).gfx({opacity: 1}, options);

$.fn.gfxFadeOut = (options = {}) ->
  $(@).queueNext ->
    $(@).css(opacity: 1)
  $(@).gfx({opacity: 0}, options)
  $(@).queueNext ->
    $(@).hide().css(opacity: 1)

$.fn.gfxShake = (options = {}) ->
  options.duration ?= 100
  options.easing   ?= 'ease-out'
  distance = options.distance or 20
  $(@).gfx({translateX: "-#{distance}px"}, options)
  $(@).gfx({translateX: "#{distance}px"}, options)
  $(@).gfx({translateX: "-#{distance}px"}, options)
  $(@).gfx({translateX: "#{distance}px"}, options)
  $(@).queueNext ->
    $(@).transform(translateX: 0)

$.fn.gfxBlip = (options = {}) ->
  options.scale or= '1.15'
  $(@).gfx({scale: options.scale}, options)
  $(@).gfx({scale: '1'}, options)

$.fn.gfxExplodeIn = (options = {}) ->
  options.scale or= '3'
  $(@).queueNext ->
    $(@).transform(scale: options.scale, opacity: '0').show()
  $(@).gfx({scale: '1', opacity: '1'}, options)

$.fn.gfxExplodeOut = (options = {}) ->
  options.scale or= '3'
  $(@).queueNext ->
    $(@).transform(scale: '1', opacity: '1')
  $(@).gfx({scale: options.scale, opacity: '0'}, options)

  unless options.reset is false
    $(@).queueNext ->
      $(@).hide().transform(scale: '1', opacity: '1')
  this

$.fn.gfxFlipIn = (options = {}) ->
  $(@).queueNext ->
    $(@).transform(rotateY: '180deg', scale: '.8', display: 'block')
  $(@).gfx({rotateY: 0, scale: 1}, options)

$.fn.gfxFlipOut = (options = {}) ->
  $(@).queueNext ->
    $(@).transform(rotateY: 0, scale: 1)
  $(@).gfx({rotateY: '-180deg', scale: '.8'}, options)

  unless options.reset is false
    $(@).queueNext ->
      $(@).transform(scale: 1, rotateY: 0, display: 'none')
  this

$.fn.gfxRotateOut = (options = {}) ->
  $(@).queueNext ->
    $(@).transform(rotateY: 0).fix()
  $(@).gfx({rotateY: '-180deg'}, options)

  unless options.reset is false
    $(@).queueNext ->
      $(@).transform(rotateY: 0, display: 'none').unfix()
  @

$.fn.gfxRotateIn = (options = {}) ->
  $(@).queueNext ->
    $(@).transform(rotateY: '180deg', display: 'block').fix()
  $(@).gfx({rotateY: 0}, options)
  $(@).queueNext -> $(@).unfix()

  $ = jQuery

$.fn.gfxSlideOut = (options = {}) ->
  options.direction or= 'right'

  distance = options.distance or 100
  distance *= -1 if options.direction is 'left'
  distance += "%"

  opacity = if options.fade then 0 else 1

  $(@).queueNext -> $(@).show()
  $(@).gfx({translate3d: "#{distance},0,0", opacity: opacity}, options)
  $(@).queueNext ->
    $(@).transform(translate3d: "0,0,0", opacity: 1).hide()

$.fn.gfxSlideIn = (options = {}) ->
  options.direction or= 'right'

  distance = options.distance or 100
  distance *= -1 if options.direction is 'left'
  distance += "%"

  opacity = if options.fade then 0 else 1

  $(@).queueNext ->
    $(@).transform(translate3d: "#{distance},0,0", opacity: opacity).show()
  $(@).gfx({translate3d: "0,0,0", opacity: 1}, options)

$.fn.gfxRaisedIn = (options = {}) ->
  $(@).queueNext ->
    $(@).transform(scale: '1', opacity: '0', translate3d: '0,-15px,0').show()
  $(@).gfx({scale: '1', opacity: '1', translate3d: '0,0,0'}, options)

$.fn.gfxRaisedOut = (options = {}) ->
  $(@).queueNext ->
    $(@).transform(scale: '1', opacity: '1', translate3d: '0,0,0')
  $(@).gfx({scale: '1', opacity: '0', translate3d: '0,-8px,0'}, options)

  $(@).queueNext ->
    $(@).hide().transform(scale: '1', opacity: '1', translate3d: '0,0,0')

$.fn.fix = ->
  $(@).each ->
    element = $(@)
    styles  = element.offset()
    parentOffset = element.parent().offset()
    styles.left -= parentOffset.left
    styles.top  -= parentOffset.top
    styles.position = 'absolute'
    element.css(styles)

$.fn.unfix = ->
  $(@).each ->
    element = $(@)
    element.css(position: '', top:'', left: '')